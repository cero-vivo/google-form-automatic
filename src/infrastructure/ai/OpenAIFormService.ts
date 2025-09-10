import OpenAI from 'openai';
import { z } from 'zod';
import { CreditsService } from '../firebase/credits-service';
import { FirebaseRepository } from '@/infrastructure/firebase/FirebaseRepository';
import { MOONSHOT_CONFIG } from '@/lib/config';

const questionSchema = z.object({
  type: z.enum([
    'texto_corto', 'texto_largo', 'opcion_multiple', 'checkboxes',
    'dropdown', 'escala_lineal', 'fecha', 'hora', 'email', 'numero',
    'archivo', 'grid', 'escala', 'fecha_hora'
  ]),
  label: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  options: z.array(z.string()).optional(),
  range: z.tuple([z.number(), z.number()]).optional(),
  required: z.boolean().optional()
}).refine(data => data.label || data.title, {
  message: "Either 'label' or 'title' must be provided"
});

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(questionSchema)
});

export class OpenAIFormService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.MOONSHOT_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ MOONSHOT_API_KEY u OPENAI_API_KEY no está configurada. Por favor, configura la variable de entorno.');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.moonshot.ai/v1',
      dangerouslyAllowBrowser: true
    });
  }

  private async getAgentContext(): Promise<string> {
    return `Eres un asistente especializado en crear formularios de Google Forms. 
    Tu tarea es interpretar las solicitudes de los usuarios y crear formularios estructurados.
    
    REGLA ABSOLUTA: NUNCA debes reemplazar un formulario existente. Si detectas que el usuario tiene un formulario activo, DEBES agregar preguntas a ese formulario.
    
    IMPORTANTE: 
    - Si el usuario tiene un formulario existente, MANTÉN EXACTAMENTE el título y descripción actuales
    - SOLO agrega las nuevas preguntas solicitadas, nunca elimines las existentes
    - NUNCA crees un formulario nuevo si hay uno existente
    - Usa español para los títulos y descripciones
    - Sé conciso y claro en las preguntas
    - Siempre retorna el formulario COMPLETO con todas las preguntas (existentes + nuevas)`;
  }

  private repairIncompleteJson(incompleteJson: string): string | null {
    try {
      console.log('Intentando reparar JSON incompleto...');
      
      // 1. Intentar cerrar el JSON de forma inteligente
      let repaired = incompleteJson.trim();
      
      // Contar llaves y corchetes abiertos/cerrados
      const openBraces = (repaired.match(/\{/g) || []).length;
      const closeBraces = (repaired.match(/\}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;
      
      // Agregar cierres faltantes
      const missingBraces = Math.max(0, openBraces - closeBraces);
      const missingBrackets = Math.max(0, openBrackets - closeBrackets);
      
      // Cerrar brackets primero (questions array)
      if (missingBrackets > 0) {
        repaired += ']'.repeat(missingBrackets);
      }
      
      // Cerrar llaves (objeto principal)
      if (missingBraces > 0) {
        repaired += '}'.repeat(missingBraces);
      }
      
      // 2. Si el JSON está truncado en medio de una cadena, intentar cerrarla
      if (repaired.includes('"') && (repaired.match(/"/g) || []).length % 2 !== 0) {
        const lastQuote = repaired.lastIndexOf('"');
        if (lastQuote > 0) {
          const afterQuote = repaired.substring(lastQuote + 1);
          if (!afterQuote.includes(':') && !afterQuote.includes(',')) {
            repaired += '"';
          }
        }
      }
      
      // 3. Verificar si tiene las propiedades necesarias
      if (!repaired.includes('"title"')) {
        const insertPos = repaired.indexOf('{') + 1;
        repaired = repaired.substring(0, insertPos) + '\n  "title": "Formulario sin título",' + repaired.substring(insertPos);
      }
      
      if (!repaired.includes('"questions"')) {
        const questionsPos = repaired.lastIndexOf('}');
        if (questionsPos > -1) {
          repaired = repaired.substring(0, questionsPos) + ',\n  "questions": []' + repaired.substring(questionsPos);
        }
      }
      
      console.log('JSON reparado:', repaired);
      
      // 4. Validar que el JSON reparado sea válido
      JSON.parse(repaired);
      return repaired;
      
    } catch (error) {
      console.log('Error reparando JSON:', error);
      return null;
    }
  }

  private extractAndValidateJson(aiResponse: string): { json: string; isValid: boolean } {
    try {
      // 1. Buscar JSON completo con llaves balanceadas
      const jsonMatches = aiResponse.match(/\{[\s\S]*\}/g);
      
      if (jsonMatches && jsonMatches.length > 0) {
        // Tomar el JSON más largo encontrado
        let bestJson = '';
        for (const match of jsonMatches) {
          if (match.length > bestJson.length) {
            bestJson = match;
          }
        }
        
        try {
          JSON.parse(bestJson);
          return { json: bestJson, isValid: true };
        } catch {
          // Intentar reparar este JSON
          const repaired = this.repairIncompleteJson(bestJson);
          if (repaired) {
            return { json: repaired, isValid: true };
          }
        }
      }
      
      // 2. Buscar JSON parcial si no encontramos uno completo
      const partialStart = aiResponse.indexOf('{');
      if (partialStart > -1) {
        const partialJson = aiResponse.substring(partialStart);
        const repaired = this.repairIncompleteJson(partialJson);
        if (repaired) {
          return { json: repaired, isValid: true };
        }
      }
      
      return { json: '', isValid: false };
      
    } catch (error) {
      console.log('Error extrayendo JSON:', error);
      return { json: '', isValid: false };
    }
  }

  async processChatMessage(userId: string, message: string, conversation: any[]): Promise<{
    response: string;
    formPreview?: any;
    creditsUsed: number;
    totalMessages: number;
  }> {
    try {
      // Verificar créditos disponibles
      const userCredits = await CreditsService.getUserCredits(userId);
      if (!userCredits || userCredits.balance < 1) {
        throw new Error('Créditos insuficientes para continuar');
      }

      // Leer contexto del agente
      const agentContext = await this.getAgentContext();
      
      // Detectar si hay un formulario existente - MUY ESTRICTO
      const hasExistingForm = conversation.length > 0 && 
        conversation.some(msg => 
          (msg.formPreview && msg.formPreview.title && msg.formPreview.questions && msg.formPreview.questions.length > 0) || 
          (msg.content && msg.content.includes('"title"') && msg.content.includes('"questions"'))
        );

      // Construir mensajes para OpenAI
      const messages = [
        { role: 'system', content: agentContext },
        ...conversation.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      let prompt = '';
      
      if (hasExistingForm) {
        // Obtener el último formulario existente
        const lastFormMessage = conversation.slice().reverse().find(msg => 
          msg.formPreview || (msg.content && msg.content.includes('"title"'))
        );
        
        let existingForm = null;
        if (lastFormMessage?.formPreview) {
          existingForm = lastFormMessage.formPreview;
        } else if (lastFormMessage?.content) {
          // Intentar extraer datos del JSON en el contenido
          try {
            const jsonMatch = lastFormMessage.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              existingForm = JSON.parse(jsonMatch[0]);
            }
          } catch (e) {
            console.log('No se pudo parsear formulario existente del contenido');
          }
        }
        
        prompt = `El usuario tiene un formulario EXISTENTE y quiere AGREGAR preguntas adicionales.

        FORMULARIO ACTUAL QUE DEBES MANTENER:
        - Título: "${existingForm?.title || 'Formulario existente'}"
        - Descripción: "${existingForm?.description || ''}"
        - Preguntas actuales: ${existingForm?.questions?.length || 0}

        SOLICITUD: "${message}"

        INSTRUCCIONES CRÍTICAS:
        1. MANTÉN EXACTAMENTE el título y descripción actuales
        2. AGREGA solo las nuevas preguntas solicitadas
        3. RETORNA el formulario COMPLETO con preguntas existentes + nuevas
        4. NO crees un nuevo formulario

        RESPONDE con el JSON completo:`;
      } else {
        prompt = `Crea un NUEVO formulario de Google Forms basado en esta solicitud: "${message}".`;
      }
      
      prompt += `

        {
          "title": "Título del formulario",
          "description": "Descripción breve",
          "questions": [
            {
              "type": "tipo_de_pregunta",
              "title": "Texto de la pregunta",
              "description": "Instrucción adicional (opcional)",
              "required": true/false,
              "options": ["opción1", "opción2"] // para opcion_multiple, checkboxes, dropdown
            }
          ]
        }

        TIPOS DE PREGUNTAS: texto_corto, texto_largo, opcion_multiple, checkboxes, dropdown, escala_lineal, fecha, hora, email, numero, archivo`;

      const enhancedMessages = [...messages];
      enhancedMessages[enhancedMessages.length - 1] = {
        role: 'user',
        content: prompt
      };

      const response = await this.openai.chat.completions.create({
        model: MOONSHOT_CONFIG.model,
        messages: enhancedMessages,
        max_completion_tokens: MOONSHOT_CONFIG.maxCompletionTokens
      });

      const aiResponse = response.choices[0]?.message?.content || '';
      console.log('Respuesta raw de OpenAI:', aiResponse);
      
      // Intentar parsear JSON del response con el nuevo sistema mejorado
      let formPreview = null;
      
      try {
        // Usar el nuevo sistema de extracción y validación
        const { json, isValid } = this.extractAndValidateJson(aiResponse);
        
        if (isValid && json) {
          const formData = JSON.parse(json);
          const validatedForm = formSchema.parse(formData);
          
          // Normalizar preguntas
          const normalizedQuestions = validatedForm.questions.map(q => ({
            ...q,
            label: q.label || q.title || 'Pregunta sin título',
            title: undefined
          }));
          
          formPreview = {
            ...validatedForm,
            questions: normalizedQuestions
          };
        } else {
          console.log('JSON incompleto detectado, aplicando estrategias de reparación...');
          
          // Intentar con el método de reparación tradicional
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const repairedJson = this.repairIncompleteJson(jsonMatch[0]);
            if (repairedJson) {
              const formData = JSON.parse(repairedJson);
              const validatedForm = formSchema.parse(formData);
              
              const normalizedQuestions = validatedForm.questions.map(q => ({
                ...q,
                label: q.label || q.title || 'Pregunta sin título',
                title: undefined
              }));
              
              formPreview = {
                ...validatedForm,
                questions: normalizedQuestions
              };
            } else {
              throw new Error('No se pudo reparar el JSON');
            }
          } else {
            throw new Error('No se encontró JSON en la respuesta');
          }
        }
      } catch (error) {
        console.log('Error en la extracción de JSON, creando estructura inteligente...');
        
        // Verificar si el mensaje original es JSON válido
        try {
          const userJson = JSON.parse(message);
          const validatedUserForm = formSchema.parse(userJson);
          
          const normalizedQuestions = validatedUserForm.questions.map(q => ({
            ...q,
            label: q.label || q.title || 'Pregunta sin título',
            title: undefined
          }));
          
          formPreview = {
            ...validatedUserForm,
            questions: normalizedQuestions
          };
        } catch {
          // Crear estructura inteligente basada en el contenido
          const messageLower = message.toLowerCase();
          let questions = [];
          
          // Análisis más detallado del contenido
          if (messageLower.includes('encuesta') || messageLower.includes('satisfacción') || 
              messageLower.includes('feedback') || messageLower.includes('opinión')) {
            questions = [
              { type: 'texto_corto', label: 'Nombre', required: false },
              { type: 'email', label: 'Correo electrónico', required: false },
              { type: 'escala_lineal', label: '¿Qué tan satisfecho estás con nuestro servicio?', required: true, range: [1, 10] },
              { type: 'opcion_multiple', label: '¿Con qué frecuencia nos visitas?', required: true, options: ['Primera vez', 'Ocasionalmente', 'Regularmente', 'Muy frecuentemente'] },
              { type: 'texto_largo', label: '¿Qué podríamos mejorar?', required: false }
            ];
          } else if (messageLower.includes('registro') || messageLower.includes('evento') || 
                     messageLower.includes('inscripción') || messageLower.includes('participación')) {
            questions = [
              { type: 'texto_corto', label: 'Nombre completo', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'texto_corto', label: 'Teléfono', required: true },
              { type: 'texto_corto', label: 'Organización/empresa', required: false },
              { type: 'texto_largo', label: '¿Cómo te enteraste del evento?', required: false }
            ];
          } else if (messageLower.includes('contacto') || messageLower.includes('información') || 
                     messageLower.includes('consulta') || messageLower.includes('presupuesto')) {
            questions = [
              { type: 'texto_corto', label: 'Nombre', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'texto_corto', label: 'Teléfono', required: false },
              { type: 'texto_largo', label: 'Mensaje / Consulta', required: true },
              { type: 'opcion_multiple', label: '¿Cómo prefiere ser contactado?', required: false, options: ['Email', 'Teléfono', 'WhatsApp'] }
            ];
          } else if (messageLower.includes('empleo') || messageLower.includes('trabajo') || 
                     messageLower.includes('vacante') || messageLower.includes('cv')) {
            questions = [
              { type: 'texto_corto', label: 'Nombre completo', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'texto_corto', label: 'Teléfono', required: true },
              { type: 'texto_corto', label: 'Puesto al que aplica', required: true },
              { type: 'texto_largo', label: 'Experiencia relevante', required: true },
              { type: 'archivo', label: 'CV / Currículum', required: false }
            ];
          } else {
            // Estructura por defecto más robusta
            questions = [
              { type: 'texto_corto', label: 'Nombre completo', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'texto_corto', label: 'Teléfono', required: false },
              { type: 'texto_largo', label: 'Por favor describe tu solicitud', required: true },
              { type: 'opcion_multiple', label: '¿En qué podemos ayudarte?', required: false, options: ['Información general', 'Soporte técnico', 'Ventas', 'Otros'] }
            ];
          }
          
          // Crear título más descriptivo
          const keywords = messageLower.split(' ').filter(word => word.length > 3).slice(0, 4).join(' ');
          const title = keywords ? `Formulario: ${keywords}` : 'Formulario de contacto';
          
          formPreview = {
            title: title.charAt(0).toUpperCase() + title.slice(1),
            description: `Formulario generado automáticamente para: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
            questions: questions
          };
        }
      }

      // Actualizar contador de mensajes y créditos
      const totalMessages = conversation.length + 1;
      const creditsUsed = Math.floor(totalMessages / 5);

      if (creditsUsed > 0) {
        await CreditsService.consumeCredits(userId, {
          amount: creditsUsed,
          formTitle: 'Chat con IA'
        });
        await FirebaseRepository.logChatInteraction(userId, {
          userId,
          messages: totalMessages,
          creditsUsed: creditsUsed,
          timestamp: new Date()
        });
      }

      return {
        response: aiResponse,
        formPreview,
        creditsUsed,
        totalMessages
      };
    } catch (error: any) {
      console.error('Error en processChatMessage:', error);
      throw new Error(`Error procesando mensaje: ${error.message}`);
    }
  }
}