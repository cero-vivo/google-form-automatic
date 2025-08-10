import { google, forms_v1, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Question, QuestionEntity } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';

export interface GoogleFormData {
  title: string;
  description?: string;
  questions: Question[];
}

export interface CreatedFormResult {
  formId: string;
  formUrl: string;
  editUrl: string;
  title: string;
  questionCount: number;
}

export interface GoogleFormsService {
  createForm(formData: GoogleFormData, accessToken: string): Promise<CreatedFormResult>;
  updateForm(formId: string, formData: GoogleFormData, accessToken: string): Promise<void>;
  deleteForm(formId: string, accessToken: string): Promise<void>;
  getFormResponses(formId: string, accessToken: string): Promise<any[]>;
  shareForm(formId: string, emails: string[], accessToken: string): Promise<void>;
}

class GoogleFormsServiceImpl implements GoogleFormsService {
  private formsAPI: forms_v1.Forms;
  private driveAPI: drive_v3.Drive;

  constructor() {
    // Las instancias se crearán cuando tengamos el token de acceso
    this.formsAPI = google.forms('v1');
    this.driveAPI = google.drive('v3');
  }

  private getAuthClient(accessToken: string): OAuth2Client {
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken
    });
    return oauth2Client;
  }

  async createForm(formData: GoogleFormData, accessToken: string): Promise<CreatedFormResult> {
    try {
      const auth = this.getAuthClient(accessToken);
      
      console.log('🚀 Creando formulario base:', formData.title);

      // 1. Crear el formulario básico (SOLO título según la API)
      const createResponse = await this.formsAPI.forms.create({
        auth,
        requestBody: {
          info: {
            title: formData.title
            // NO incluir description aquí - solo title está permitido
          }
        }
      });

      const form = createResponse.data;
      if (!form.formId) {
        throw new Error('No se pudo crear el formulario');
      }

      console.log('✅ Formulario base creado:', form.formId);

      // 2. Actualizar descripción si existe (usando batchUpdate)
      if (formData.description && formData.description.trim()) {
        console.log('📄 Agregando descripción...');
        await this.updateFormInfo(form.formId, formData.title, formData.description, accessToken);
      }

      // 3. Agregar preguntas si las hay (usando batchUpdate)
      if (formData.questions.length > 0) {
        console.log(`📝 Agregando ${formData.questions.length} preguntas...`);
        await this.addQuestionsToForm(form.formId, formData.questions, accessToken);
      }

      // 4. Obtener URLs del formulario
      const formUrl = `https://docs.google.com/forms/d/${form.formId}/viewform`;
      const editUrl = `https://docs.google.com/forms/d/${form.formId}/edit`;

      const result: CreatedFormResult = {
        formId: form.formId,
        formUrl,
        editUrl,
        title: formData.title,
        questionCount: formData.questions.length
      };

      console.log('✅ Formulario completado:', result);
      return result;

    } catch (error: any) {
      console.error('❌ Error creando formulario:', error);
      throw this.handleGoogleAPIError(error);
    }
  }

  private async updateFormInfo(formId: string, title: string, description: string, accessToken: string): Promise<void> {
    const auth = this.getAuthClient(accessToken);
    
    try {
      await this.formsAPI.forms.batchUpdate({
        auth,
        formId,
        requestBody: {
          requests: [
            {
              updateFormInfo: {
                info: {
                  title: title,
                  description: description
                },
                updateMask: 'title,description'
              }
            }
          ]
        }
      });

      console.log('✅ Información del formulario actualizada');
    } catch (error) {
      console.error('❌ Error actualizando información del formulario:', error);
      throw error;
    }
  }

  private async addQuestionsToForm(formId: string, questions: Question[], accessToken: string): Promise<void> {
    const auth = this.getAuthClient(accessToken);
    
    try {
      const requests = questions.map((question, index) => {
        const request = this.createQuestionRequest(question, index);
        console.log(`🔧 Pregunta ${index + 1}:`, JSON.stringify(request, null, 2));
        return request;
      });

      if (requests.length > 0) {
        console.log('📤 Enviando batch de preguntas:', JSON.stringify({ requests }, null, 2));
        
        await this.formsAPI.forms.batchUpdate({
          auth,
          formId,
          requestBody: {
            requests
          }
        });

        console.log(`✅ ${requests.length} preguntas agregadas al formulario`);
      }
    } catch (error) {
      console.error('❌ Error agregando preguntas:', error);
      throw error;
    }
  }

  private createQuestionRequest(question: Question, index: number): any {
    const location = {
      index: index
    };

    // Estructura correcta según la documentación oficial de Google Forms API
    const questionItem: any = {
      title: question.title,
      description: question.description || ''
    };

    // La pregunta va dentro de 'question' no directamente en el item
    const questionConfig: any = {};

    // Configurar tipo de pregunta según QuestionType
    switch (question.type) {
      case QuestionType.SHORT_TEXT:
        questionConfig.textQuestion = {
          paragraph: false
        };
        break;

      case QuestionType.LONG_TEXT:
        questionConfig.textQuestion = {
          paragraph: true
        };
        break;

      case QuestionType.MULTIPLE_CHOICE:
        if (question.multipleChoiceConfig?.options) {
          questionConfig.choiceQuestion = {
            type: 'RADIO',
            options: question.multipleChoiceConfig.options.map(option => ({
              value: option
            }))
          };
        }
        break;

      case QuestionType.CHECKBOXES:
        if (question.multipleChoiceConfig?.options) {
          questionConfig.choiceQuestion = {
            type: 'CHECKBOX',
            options: question.multipleChoiceConfig.options.map(option => ({
              value: option
            }))
          };
        }
        break;

      case QuestionType.DROPDOWN:
        if (question.multipleChoiceConfig?.options) {
          questionConfig.choiceQuestion = {
            type: 'DROP_DOWN',
            options: question.multipleChoiceConfig.options.map(option => ({
              value: option
            }))
          };
        }
        break;

      case QuestionType.LINEAR_SCALE:
        const scaleConfig = question.linearScaleConfig;
        questionConfig.scaleQuestion = {
          low: scaleConfig?.min || 1,
          high: scaleConfig?.max || 5,
          lowLabel: scaleConfig?.minLabel || '',
          highLabel: scaleConfig?.maxLabel || ''
        };
        break;

      case QuestionType.DATE:
        questionConfig.dateQuestion = {
          includeTime: false,
          includeYear: true
        };
        break;

      case QuestionType.TIME:
        questionConfig.timeQuestion = {
          duration: false
        };
        break;

      case QuestionType.EMAIL:
        questionConfig.textQuestion = {
          paragraph: false
        };
        // TODO: Agregar validación de email si es posible
        break;

      case QuestionType.NUMBER:
        questionConfig.textQuestion = {
          paragraph: false
        };
        // TODO: Agregar validación de número si es posible
        break;

      case QuestionType.PHONE:
        questionConfig.textQuestion = {
          paragraph: false
        };
        // TODO: Agregar validación de teléfono si es posible
        break;

      default:
        // Por defecto, usar texto corto
        questionConfig.textQuestion = {
          paragraph: false
        };
    }

    // Agregar la configuración required al questionConfig
    questionConfig.required = question.required;

    // Estructura final correcta según la API
    return {
      createItem: {
        item: {
          title: question.title,
          description: question.description || '',
          questionItem: {
            question: questionConfig
          }
        },
        location
      }
    };
  }

  async updateForm(formId: string, formData: GoogleFormData, accessToken: string): Promise<void> {
    try {
      const auth = this.getAuthClient(accessToken);

      console.log('🔄 Actualizando formulario:', formId);

      // Actualizar información básica del formulario
      await this.formsAPI.forms.batchUpdate({
        auth,
        formId,
        requestBody: {
          requests: [
            {
              updateFormInfo: {
                info: {
                  title: formData.title,
                  description: formData.description || ''
                },
                updateMask: 'title,description'
              }
            }
          ]
        }
      });

      console.log('✅ Formulario actualizado');

    } catch (error: any) {
      console.error('❌ Error actualizando formulario:', error);
      throw this.handleGoogleAPIError(error);
    }
  }

  async deleteForm(formId: string, accessToken: string): Promise<void> {
    try {
      const auth = this.getAuthClient(accessToken);

      console.log('🗑️ Eliminando formulario:', formId);

      // Mover a la papelera en Google Drive
      await this.driveAPI.files.update({
        auth,
        fileId: formId,
        requestBody: {
          trashed: true
        }
      });

      console.log('✅ Formulario eliminado');

    } catch (error: any) {
      console.error('❌ Error eliminando formulario:', error);
      throw this.handleGoogleAPIError(error);
    }
  }

  async getFormResponses(formId: string, accessToken: string): Promise<any[]> {
    try {
      const auth = this.getAuthClient(accessToken);

      console.log('📊 Obteniendo respuestas del formulario:', formId);

      const response = await this.formsAPI.forms.responses.list({
        auth,
        formId
      });

      const responses = response.data.responses || [];
      console.log(`✅ ${responses.length} respuestas obtenidas`);
      
      return responses;

    } catch (error: any) {
      console.error('❌ Error obteniendo respuestas:', error);
      throw this.handleGoogleAPIError(error);
    }
  }

  async shareForm(formId: string, emails: string[], accessToken: string): Promise<void> {
    try {
      const auth = this.getAuthClient(accessToken);

      console.log('🔗 Compartiendo formulario con:', emails);

      // Compartir usando Google Drive API
      for (const email of emails) {
        await this.driveAPI.permissions.create({
          auth,
          fileId: formId,
          requestBody: {
            role: 'reader',
            type: 'user',
            emailAddress: email
          }
        });
      }

      console.log('✅ Formulario compartido');

    } catch (error: any) {
      console.error('❌ Error compartiendo formulario:', error);
      throw this.handleGoogleAPIError(error);
    }
  }

  private handleGoogleAPIError(error: any): Error {
    if (error.code) {
      switch (error.code) {
        case 401:
          return new Error('Token de acceso inválido o expirado. Por favor, vuelve a iniciar sesión con Google.');
        case 403:
          if (error.message && error.message.includes('insufficient authentication scopes')) {
            return new Error('Permisos insuficientes. Necesitas autorizar el acceso a Google Forms.');
          }
          return new Error('Permisos insuficientes para crear formularios');
        case 404:
          return new Error('Formulario no encontrado');
        case 429:
          return new Error('Límite de API alcanzado. Inténtalo más tarde');
        default:
          return new Error(`Error de Google API: ${error.message}`);
      }
    }

    // Manejar errores específicos de autenticación
    if (error.message && error.message.includes('invalid_grant')) {
      return new Error('Token de acceso expirado. Por favor, vuelve a iniciar sesión con Google.');
    }

    if (error.message && error.message.includes('insufficient_scope')) {
      return new Error('Permisos insuficientes. Necesitas autorizar el acceso a Google Forms.');
    }

    return new Error(error.message || 'Error desconocido de Google API');
  }
}

// Singleton instance
export const googleFormsService = new GoogleFormsServiceImpl(); 