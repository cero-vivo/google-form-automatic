import { QuestionEntity } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { OPENAI_CONFIG } from '@/lib/config';

interface FormStructure {
  title: string;
  description: string;
  questions: QuestionEntity[];
}

interface AIQuestion {
  questionText?: string;
  questionType?: string;
  type?: string;
  title?: string;
  required?: boolean;
  options?: string[];
}

export class OpenAIFormService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateFormFromPrompt(prompt: string): Promise<FormStructure | null> {
    if (!this.apiKey) {
      // Mock response for development
      return this.getMockFormStructure(prompt);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: OPENAI_CONFIG.systemPrompt
            },
            {
              role: 'user',
              content: `${prompt}

${OPENAI_CONFIG.userPromptSuffix}`
            }
          ],
          max_completion_tokens: OPENAI_CONFIG.maxCompletionTokens,
          temperature: OPENAI_CONFIG.temperature,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        const aiResponse = JSON.parse(content);
        
        // Convert AI response format to domain Question format
        const questions = aiResponse.questions.map((aiQuestion: AIQuestion, index: number) => {
          const questionType = this.mapAIQuestionTypeToDomain(
            aiQuestion.questionType || aiQuestion.type || 'short_text'
          );
          const questionText = aiQuestion.questionText || aiQuestion.title || 'Pregunta sin título';
          
          const question = new QuestionEntity(
            `q${index + 1}`,
            questionType,
            questionText,
            aiQuestion.required || false,
            index
          );
          
          if (aiQuestion.options && aiQuestion.options.length > 0) {
            question.multipleChoiceConfig = {
              options: aiQuestion.options
            };
          }
          
          return question;
        });

        return {
          title: aiResponse.title,
          description: aiResponse.description,
          questions: questions
        };
      }

      return null;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return this.getMockFormStructure(prompt);
    }
  }

  private mapAIQuestionTypeToDomain(aiType: string): QuestionType {
    const typeMap: Record<string, QuestionType> = {
      // English mappings
      'short_text': QuestionType.SHORT_TEXT,
      'multiple_choice': QuestionType.MULTIPLE_CHOICE,
      'checkboxes': QuestionType.CHECKBOXES,
      'linear_scale': QuestionType.LINEAR_SCALE,
      'date': QuestionType.DATE,
      'email': QuestionType.EMAIL,
      'number': QuestionType.NUMBER,
      'long_text': QuestionType.LONG_TEXT,
      'dropdown': QuestionType.DROPDOWN,
      'time': QuestionType.TIME,
      'phone': QuestionType.PHONE,
      
      // Spanish mappings
      'texto_corto': QuestionType.SHORT_TEXT,
      'texto_largo': QuestionType.LONG_TEXT,
      'opcion_multiple': QuestionType.MULTIPLE_CHOICE,
      'opciones_multiples': QuestionType.MULTIPLE_CHOICE,
      'casillas': QuestionType.CHECKBOXES,
      'checkbox': QuestionType.CHECKBOXES,
      'escala_lineal': QuestionType.LINEAR_SCALE,
      'fecha': QuestionType.DATE,
      'hora': QuestionType.TIME,
      'correo': QuestionType.EMAIL,
      'numero': QuestionType.NUMBER,
      'desplegable': QuestionType.DROPDOWN,
      'telefono': QuestionType.PHONE,
      'teléfono': QuestionType.PHONE
    };
    
    return typeMap[aiType.toLowerCase()] || QuestionType.SHORT_TEXT;
  }

  private getMockFormStructure(prompt: string): FormStructure {
    // Generate mock form based on prompt keywords
    const mockForms: Record<string, FormStructure> = {
      'restaurante': {
        title: 'Encuesta de Satisfacción - Restaurante',
        description: 'Ayúdanos a mejorar nuestro servicio compartiendo tu experiencia',
          questions: [
            new QuestionEntity('q1', QuestionType.SHORT_TEXT, '¿Cuál es tu nombre completo?', false, 0),
            new QuestionEntity('q2', QuestionType.DATE, '¿Qué día visitaste nuestro restaurante?', false, 1),
            new QuestionEntity('q3', QuestionType.LINEAR_SCALE, '¿Cómo calificarías la calidad de la comida?', false, 2),
            new QuestionEntity('q4', QuestionType.SHORT_TEXT, '¿Qué plato ordenaste?', false, 3),
            (() => {
              const q5 = new QuestionEntity('q5', QuestionType.MULTIPLE_CHOICE, '¿Cómo fue la atención del personal?', false, 4);
              q5.multipleChoiceConfig = { options: ['Excelente', 'Buena', 'Regular', 'Mala'] };
              return q5;
            })(),
            (() => {
              const q6 = new QuestionEntity('q6', QuestionType.MULTIPLE_CHOICE, '¿Recomendarías nuestro restaurante?', false, 5);
              q6.multipleChoiceConfig = { options: ['Sí definitivamente', 'Probablemente', 'No estoy seguro', 'No'] };
              return q6;
            })(),
            new QuestionEntity('q7', QuestionType.LONG_TEXT, '¿Algún comentario adicional?', false, 6)
          ]
      },
      'evento': {
        title: 'Registro de Evento Corporativo',
        description: 'Formulario de inscripción para nuestro evento empresarial',
        questions: [
          new QuestionEntity('q1', QuestionType.SHORT_TEXT, 'Nombre completo', false, 0),
          new QuestionEntity('q2', QuestionType.EMAIL, 'Correo electrónico corporativo', false, 1),
          new QuestionEntity('q3', QuestionType.SHORT_TEXT, 'Empresa', false, 2),
          new QuestionEntity('q4', QuestionType.SHORT_TEXT, 'Cargo', false, 3),
          (() => {
            const q5 = new QuestionEntity('q5', QuestionType.MULTIPLE_CHOICE, '¿Asistirás al evento?', false, 4);
            q5.multipleChoiceConfig = { options: ['Sí, confirmo asistencia', 'No podré asistir', 'Tal vez'] };
            return q5;
          })(),
          new QuestionEntity('q6', QuestionType.SHORT_TEXT, '¿Tienes alguna restricción alimentaria?', false, 5)
        ]
      },
      'evaluacion': {
        title: 'Evaluación de Desempeño',
        description: 'Evaluación trimestral del desempeño laboral',
        questions: [
          new QuestionEntity('q1', QuestionType.SHORT_TEXT, 'Nombre del empleado', false, 0),
          (() => {
            const q2 = new QuestionEntity('q2', QuestionType.MULTIPLE_CHOICE, 'Departamento', false, 1);
            q2.multipleChoiceConfig = { options: ['Ventas', 'Marketing', 'IT', 'Recursos Humanos', 'Finanzas'] };
            return q2;
          })(),
          new QuestionEntity('q3', QuestionType.LINEAR_SCALE, 'Calificación de cumplimiento de objetivos', false, 2),
          new QuestionEntity('q4', QuestionType.LINEAR_SCALE, 'Calificación de habilidades técnicas', false, 3),
          new QuestionEntity('q5', QuestionType.LINEAR_SCALE, 'Calificación de trabajo en equipo', false, 4),
          new QuestionEntity('q6', QuestionType.LONG_TEXT, 'Comentarios adicionales', false, 5)
        ]
      }
    };

    // Determine which mock form to use based on prompt
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('restaurante') || promptLower.includes('comida')) {
      return mockForms.restaurante;
    } else if (promptLower.includes('evento') || promptLower.includes('registro')) {
      return mockForms.evento;
    } else if (promptLower.includes('evaluacion') || promptLower.includes('desempeño')) {
      return mockForms.evaluacion;
    }

    // Default form
    return {
      title: 'Formulario Personalizado',
      description: 'Formulario creado según tu solicitud',
      questions: [
        new QuestionEntity('q1', QuestionType.SHORT_TEXT, 'Nombre completo', false, 0),
        new QuestionEntity('q2', QuestionType.EMAIL, 'Correo electrónico', false, 1),
        new QuestionEntity('q3', QuestionType.SHORT_TEXT, 'Empresa/Organización', false, 2),
        (() => {
          const q4 = new QuestionEntity('q4', QuestionType.MULTIPLE_CHOICE, '¿Cómo nos encontraste?', false, 3);
          q4.multipleChoiceConfig = { options: ['Google', 'Redes sociales', 'Recomendación', 'Otro'] };
          return q4;
        })(),
        new QuestionEntity('q5', QuestionType.LONG_TEXT, '¿Qué te gustaría compartir?', false, 4)
      ]
    };
  }
}