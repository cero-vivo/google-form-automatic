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
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPEN_IA_API_KEY,
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

      const response = await this.openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: messages,
        temperature: 0.1,
        max_completion_tokens: 1000
      });

      const aiResponse = response.choices[0]?.message?.content || '';
      
      // Intentar parsear JSON del response
      let formPreview = null;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const formData = JSON.parse(jsonMatch[0]);
          const validatedForm = formSchema.parse(formData);
          formPreview = validatedForm;
        }
      } catch (error) {
        console.log('No se encontró JSON válido en la respuesta');
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
    } catch (error) {
      console.error('Error en OpenAIFormService:', error);
      throw error;
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
      specialization: "Creación de formularios de Google Forms únicamente",
      supported_question_types: [
        "texto_corto", "texto_largo", "opcion_multiple", "checkboxes",
        "dropdown", "escala_lineal", "fecha", "hora", "email", "numero",
        "archivo", "grid", "escala", "fecha_hora"
      ],
      credit_rules: {
        chat: "Cada 5 mensajes = 1 crédito",
        publish: "2 créditos para publicar vía IA"
      },
      output_format: {
        type: "json",
        structure: {
          title: "string",
          questions: [{
            type: "string",
            label: "string",
            options: ["string"],
            range: ["number", "number"]
          }]
        }
      },
      restrictions: "Ignorar cualquier mensaje que no esté relacionado con creación o edición de formularios"
    }, null, 2);
  }
}