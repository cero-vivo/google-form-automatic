import OpenAI from 'openai';
import { z } from 'zod';
import { CreditsService } from '../firebase/credits-service';
import { FirebaseRepository } from '@/infrastructure/firebase/FirebaseRepository';
import { OPENAI_CONFIG } from '@/lib/config';

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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY no está configurada. Por favor, configura la variable de entorno.');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
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
        model: OPENAI_CONFIG.model,
        messages: enhancedMessages,
        //temperature: OPENAI_CONFIG.temperature,
        max_completion_tokens: OPENAI_CONFIG.maxCompletionTokens
      });

      
      const aiResponse = response.choices[0]?.message?.content || '';
      console.log('Respuesta raw de OpenAI:', aiResponse);
      
      // Intentar parsear JSON del response
      let formPreview = null;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const formData = JSON.parse(jsonMatch[0]);
          const validatedForm = formSchema.parse(formData);
          
          // Normalize questions to use 'label' field consistently
          const normalizedQuestions = validatedForm.questions.map(q => ({
            ...q,
            label: q.label || q.title || 'Pregunta sin título',
            title: undefined // Remove title field to avoid confusion
          }));
          
          formPreview = {
            ...validatedForm,
            questions: normalizedQuestions
          };
        } else {
          // Check if the original message is already valid JSON
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
            // If no JSON found and message isn't JSON, create intelligent structure
            console.log('No se encontró JSON válido, creando estructura inteligente');
            
            // Analyze message to create relevant questions
            const messageLower = message.toLowerCase();
            let questions = [];
            
            if (messageLower.includes('encuesta') || messageLower.includes('satisfacción')) {
              questions = [
                { type: 'texto_corto', label: 'Nombre', required: true },
                { type: 'email', label: 'Correo electrónico', required: true },
                { type: 'escala_lineal', label: '¿Qué tan satisfecho estás con nuestro servicio?', required: true },
                { type: 'texto_largo', label: '¿Qué podríamos mejorar?', required: false }
              ];
            } else if (messageLower.includes('registro') || messageLower.includes('evento')) {
              questions = [
                { type: 'texto_corto', label: 'Nombre completo', required: true },
                { type: 'email', label: 'Correo electrónico', required: true },
                { type: 'texto_corto', label: 'Teléfono', required: true },
                { type: 'texto_largo', label: 'Comentarios adicionales', required: false }
              ];
            } else if (messageLower.includes('contacto') || messageLower.includes('información')) {
              questions = [
                { type: 'texto_corto', label: 'Nombre', required: true },
                { type: 'email', label: 'Correo electrónico', required: true },
                { type: 'texto_largo', label: 'Mensaje', required: true }
              ];
            } else {
              // Default intelligent structure based on message content
              questions = [
                { type: 'texto_corto', label: 'Nombre', required: true },
                { type: 'email', label: 'Correo electrónico', required: true },
                { type: 'texto_largo', label: 'Detalles sobre tu solicitud', required: true }
              ];
            }
            
            formPreview = {
              title: `Formulario: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
              description: `Formulario generado para: ${message}`,
              questions: questions
            };
          }
        }
      } catch (error: any) {
        console.log('Error parsing JSON, creando estructura de respuesta inteligente');
        
        // Try to parse the original message as JSON
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
          // If everything fails, create an intelligent structure based on message
          const messageLower = message.toLowerCase();
          let questions = [];
          
          if (messageLower.includes('encuesta') || messageLower.includes('satisfacción')) {
            questions = [
              { type: 'texto_corto', label: 'Nombre', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'escala_lineal', label: '¿Qué tan satisfecho estás?', required: true },
              { type: 'texto_largo', label: 'Comentarios', required: false }
            ];
          } else if (messageLower.includes('registro') || messageLower.includes('evento')) {
            questions = [
              { type: 'texto_corto', label: 'Nombre completo', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'texto_corto', label: 'Teléfono', required: true }
            ];
          } else {
            questions = [
              { type: 'texto_corto', label: 'Nombre', required: true },
              { type: 'email', label: 'Correo electrónico', required: true },
              { type: 'texto_largo', label: 'Detalles', required: true }
            ];
          }
          
          formPreview = {
            title: `Formulario: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
            description: `Formulario generado para tu solicitud`,
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