import OpenAI from 'openai';
import { z } from 'zod';
import { CreditsService } from '../firebase/credits-service';
import { GoogleFormsService } from '@/infrastructure/firebase/GoogleFormsService';
import { FirebaseRepository } from '@/infrastructure/firebase/FirebaseRepository';

const questionSchema = z.object({
  type: z.enum([
    'texto_corto', 'texto_largo', 'opcion_multiple', 'checkboxes',
    'dropdown', 'escala_lineal', 'fecha', 'hora', 'email', 'numero',
    'archivo', 'grid', 'escala', 'fecha_hora'
  ]),
  label: z.string().min(1),
  options: z.array(z.string()).optional(),
  range: z.tuple([z.number(), z.number()]).optional()
});

const formSchema = z.object({
  title: z.string().min(1),
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
      
      // Construir mensajes para OpenAI
      const messages = [
        { role: 'system', content: agentContext },
        ...conversation.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      // Usar el mensaje del usuario directamente sin interpretación forzada
      const interpretedMessage = message;

      // Actualizar el último mensaje del usuario con el mensaje interpretado
      messages[messages.length - 1] = { role: 'user', content: interpretedMessage };

      const prompt = `Crea un formulario de Google Forms basado en esta solicitud: "${interpretedMessage}".

        RESPONDE ÚNICAMENTE con este formato JSON:
        
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

        TIPOS DE PREGUNTAS: texto_corto, texto_largo, opcion_multiple, checkboxes, dropdown, escala_lineal, fecha, hora, email, numero, archivo`

      const enhancedMessages = [...messages];
      enhancedMessages[enhancedMessages.length - 1] = {
        role: 'user',
        content: prompt
      };

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: enhancedMessages,
        temperature: 1,
        max_completion_tokens: 1000
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
          formPreview = validatedForm;
        } else {
          // If no JSON found, create a basic form structure from the AI's text response
          console.log('No se encontró JSON válido, creando estructura básica');
          formPreview = {
            title: `Formulario generado`,
            description: `Formulario basado en tu solicitud: ${message}`,
            questions: [
              {
                type: 'texto_largo',
                label: 'Cuéntanos más sobre tu solicitud',
                required: true
              }
            ]
          };
        }
      } catch (error) {
        console.log('Error parsing JSON, creando estructura básica');
        formPreview = {
          title: `Formulario generado`,
          description: `Formulario basado en: ${message}`,
          questions: [
            {
              type: 'texto_largo',
              label: 'Respuesta principal',
              required: true
            }
          ]
        };
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
      console.error('Error en OpenAIFormService:', error);
      
      if (error?.status === 404) {
        throw new Error('Modelo de IA no disponible. Por favor, contacta al soporte.');
      } else if (error?.status === 401) {
        throw new Error('❌ Error de autenticación: La clave API de OpenAI no está configurada o es inválida. Por favor, configura OPENAI_API_KEY en tu archivo .env.local');
      } else if (error?.status === 429) {
        throw new Error('Demasiadas solicitudes. Por favor, espera un momento y vuelve a intentarlo.');
      } else if (error?.code === 'invalid_api_key') {
        throw new Error('❌ La clave API de OpenAI no está configurada. Crea un archivo .env.local con: OPENAI_API_KEY=sk-tu-clave-aqui');
      } else if (error?.message?.includes('API key')) {
        throw new Error('❌ Configura tu clave API de OpenAI. Crea .env.local con OPENAI_API_KEY=sk-tu-clave-aqui');
      } else if (error?.message?.includes('JSON')) {
        throw new Error('💡 Para mejores resultados, sé más específico. Ejemplo: "Crear formulario de feedback para usuarios que compraron [producto específico] en los últimos 30 días"');
      } else {
        throw new Error(`💡 Estructura tu mensaje así: "Crear [tipo de formulario] para [público objetivo] sobre [tema específico]". Ejemplo: "Crear formulario de feedback de producto para clientes que usaron nuestra app móvil"`);
      }
    }
  }

  async publishFormFromChat(userId: string, formData: any): Promise<{
    formId: string;
    googleFormUrl: string;
    creditsUsed: number;
  }> {
    try {
      // Verificar créditos para publicación
      const userCredits = await CreditsService.getUserCredits(userId);
      if (!userCredits || userCredits.balance < 2) {
        throw new Error('Créditos insuficientes para publicar el formulario');
      }

      // Crear formulario en Google Forms
      const validatedForm = formSchema.parse(formData);
      const googleFormId = await GoogleFormsService.createForm(validatedForm);
        
        // Consumir créditos
        await CreditsService.consumeCredits(userId, {
          amount: 2,
          formTitle: validatedForm.title || 'Formulario sin título'
        });

        // Guardar en Firebase
        await FirebaseRepository.saveForm(userId, {
          title: validatedForm.title,
          questions: validatedForm.questions,
          googleFormId: googleFormId,
          googleFormUrl: `https://forms.google.com/${googleFormId}`,
          createdVia: 'ai-chat',
          creditsUsed: 2,
          timestamp: new Date(),
          userId
        });

      return {
        formId: googleFormId,
        googleFormUrl: `https://forms.google.com/${googleFormId}`,
        creditsUsed: 2
      };
    } catch (error) {
      console.error('Error al publicar formulario:', error);
      throw error;
    }
  }

  private async getAgentContext(): Promise<string> {
    return JSON.stringify({
      specialization: "Creación de formularios de Google Forms para encuestas y evaluaciones",
      supported_question_types: [
        "texto_corto", "texto_largo", "opcion_multiple", "checkboxes",
        "dropdown", "escala_lineal", "fecha", "hora", "email", "numero",
        "archivo", "grid", "escala", "fecha_hora"
      ],
      examples: {
        product_feedback: {
          title: "Formulario de Feedback de Producto",
          description: "Recopilar opiniones sobre un producto específico",
          questions: [
            "¿Qué producto has utilizado?",
            "¿Cuál es tu nivel de satisfacción? (1-10)",
            "¿Qué características te gustaron más?",
            "¿Qué mejorarías?",
            "¿Recomendarías este producto? (Sí/No/Quizás)"
          ]
        },
        customer_satisfaction: {
          title: "Encuesta de Satisfacción del Cliente",
          description: "Medir la satisfacción general del cliente",
          questions: [
            "¿Cómo calificarías nuestro servicio?",
            "¿Qué tan probable es que nos recomiendes? (0-10)",
            "¿Qué podemos mejorar?"
          ]
        },
        argentine_movies: {
          title: "Encuesta de Películas Argentinas",
          description: "Calificar y evaluar las mejores películas del cine argentino",
          questions: [
            "Califica 'El secreto de sus ojos' (1-10)",
            "Califica 'Relatos salvajes' (1-10)",
            "Califica 'Nueve reinas' (1-10)",
            "Califica 'El hijo de la novia' (1-10)",
            "Califica 'Kamchatka' (1-10)",
            "¿Cuál es tu película argentina favorita?",
            "¿Por qué es tu favorita?",
            "¿Qué género de cine argentino prefieres? (Drama/Comedia/Suspenso/Documental)",
            "¿Qué época del cine argentino te gusta más? (Clásica 1930-1980/Moderna 1980-2000/Contemporánea 2000+)",
            "¿Recomendarías cine argentino a otros? (Sí/No/Quizás)"
          ]
        }
      },
      message_structure: {
        required: ["tipo de formulario", "objetivo", "audiencia"],
        good_examples: [
          "Crear formulario de feedback para clientes que compraron nuestro software en los últimos 30 días",
          "Generar encuesta de satisfacción para usuarios de nuestra app móvil, enfocada en la experiencia de usuario",
          "Formulario de evaluación de producto para testers de nuestra nueva funcionalidad de pago"
        ],
        bad_examples: [
          "-",
          "-",
          "-"
        ]
      },
      intelligent_interpretation: {
        description: "Traducción automática de lenguaje natural a solicitudes estructuradas",
        examples: [
          {
            user_input: "quiero un formulario de feedback",
            interpreted_as: "Crear formulario de feedback de producto para clientes actuales sobre su experiencia de uso, incluyendo satisfacción general, características más valiosas, problemas encontrados y sugerencias de mejora"
          },
          {
            user_input: "encuesta para mi equipo",
            interpreted_as: "Crear formulario de evaluación de clima laboral para el equipo de trabajo actual, incluyendo satisfacción con el ambiente, comunicación, liderazgo y oportunidades de crecimiento"
          },
          {
            user_input: "formulario de registro",
            interpreted_as: "Crear formulario de registro de nuevos usuarios para capturar información básica incluyendo nombre, email, teléfono, empresa y motivo de interés"
          }
        ],
        rules: [
          "Identifica automáticamente: [tipo de formulario] + [público objetivo implícito] + [contexto específico]",
          "Agrega detalles estándar relevantes según el tipo de formulario",
          "Usa lenguaje claro y específico",
          "No requieras que el usuario siga un formato específico",
          "Si el mensaje es muy ambiguo, crea el formulario más común y útil para ese contexto"
        ]
      },
      credit_rules: {
        chat: "Cada 5 mensajes = 1 crédito",
        publish: "2 créditos para publicar vía IA"
      },
      output_format: {
        type: "json",
        structure: {
          title: "string - título específico del formulario",
          questions: [{
            type: "string - tipo de pregunta válido",
            label: "string - pregunta clara y específica",
            options: ["string array - solo si aplica"],
            range: ["number min", "number max"]
          }]
        }
      },
      instructions: "Para mensajes simples como 'Formulario de feedback de producto', expande automáticamente incluyendo: 1) Producto específico, 2) Público objetivo, 3) Objetivo de la encuesta, 4) Preguntas clave estándar. Para encuestas de películas argentinas con puntuación: DEBES crear título 'Encuesta de Películas Argentinas - Sistema de Calificación', incluir estas películas específicas: 'El secreto de sus ojos', 'Relatos salvajes', 'Nueve reinas', 'El hijo de la novia', 'Kamchatka', 'Tesis sobre un homicidio', 'El clan', 'Wild Tales', 'The Official Story', 'Nine Queens', cada una con pregunta tipo 'escala_lineal' y rango 1-10, agregar preguntas sobre género favorito, época preferida, película favorita no listada y razones de preferencia.",
      restrictions: "Si el mensaje es muy genérico, asume un formulario estándar pero específico en lugar de pedir más detalles"
    }, null, 2);
  }
}