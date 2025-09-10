import { google, forms_v1, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Question, QuestionEntity } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';

export interface GoogleFormSettings {
  collectEmails?: boolean;
}

export interface GoogleFormData {
  title: string;
  description?: string;
  questions: Question[];
  settings?: GoogleFormSettings;
}

export interface CreatedFormResult {
  formId: string;
  formUrl: string;
  editUrl: string;
  title: string;
  questionCount: number;
}

export interface UserForm {
  id: string;
  title: string;
  description?: string;
  googleFormUrl: string;
  editUrl: string;
  responseCount?: number;
  createdAt: Date;
  modifiedAt: Date;
}

export interface GoogleFormsService {
  createForm(formData: GoogleFormData, accessToken: string): Promise<CreatedFormResult>;
  updateForm(formId: string, formData: GoogleFormData, accessToken: string): Promise<void>;
  deleteForm(formId: string, accessToken: string): Promise<void>;
  getFormResponses(formId: string, accessToken: string): Promise<any[]>;
  shareForm(formId: string, emails: string[], accessToken: string): Promise<void>;
  getUserForms(accessToken: string): Promise<UserForm[]>;
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
      console.log('📋 Datos del formulario recibidos:', JSON.stringify(formData, null, 2));
      console.log('⚙️ Configuraciones recibidas:', formData.settings);

      // 1. Crear el formulario básico (título y documentTitle)
      const createResponse = await this.formsAPI.forms.create({
        auth,
        requestBody: {
          info: {
            title: formData.title,
            documentTitle: formData.title
            // NO incluir description aquí - solo title y documentTitle están permitidos en create
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
        console.log('📋 Procesando preguntas:', JSON.stringify(formData.questions, null, 2));
        await this.addQuestionsToForm(form.formId, formData.questions, accessToken);
      }

      // 4. Aplicar configuraciones del formulario si están especificadas
      if (formData.settings) {
        console.log('⚙️ Aplicando configuraciones del formulario...');
        await this.applyFormSettings(form.formId, formData.settings, accessToken);
      }

      // 5. Obtener URLs del formulario
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
                  // NOTA: documentTitle no se puede modificar con batchUpdate, solo en create
                  // Para cambiar documentTitle después de crear, usar Google Drive API
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
        console.log(`📋 Procesando pregunta ${index + 1}: ${question.title} (${question.type})`);
        
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

    // Configurar tipo de pregunta según QuestionType
    // Mapeo de tipos españoles a tipos de Google Forms
    const typeMapping: Record<string, string> = {
      'short_text': QuestionType.SHORT_TEXT,
      'long_text': QuestionType.LONG_TEXT,
      'multiple_choice': QuestionType.MULTIPLE_CHOICE,
      'checkboxes': QuestionType.CHECKBOXES,
      'dropdown': QuestionType.DROPDOWN,
      'linear_scale': QuestionType.LINEAR_SCALE,
      'date': QuestionType.DATE,
      'time': QuestionType.TIME,
      'email': QuestionType.EMAIL,
      'number': QuestionType.NUMBER,
      'phone': QuestionType.PHONE,
      'rating': 'rating',
      // Mapeo de tipos españoles
      'texto_corto': QuestionType.SHORT_TEXT,
      'texto_largo': QuestionType.LONG_TEXT,
      'opcion_multiple': QuestionType.MULTIPLE_CHOICE,
      'casillas': QuestionType.CHECKBOXES,
      'lista_desplegable': QuestionType.DROPDOWN,
      'escala_lineal': QuestionType.LINEAR_SCALE,
      'fecha': QuestionType.DATE,
      'hora': QuestionType.TIME,
      'correo': QuestionType.EMAIL,
      'numero': QuestionType.NUMBER,
      'telefono': QuestionType.PHONE,
      'calificacion': 'rating',
      'casillas_de_verificacion': QuestionType.CHECKBOXES,
      'opción_múltiple': QuestionType.MULTIPLE_CHOICE
    };

    const normalizedType = typeMapping[question.type] || question.type;
    
    let questionConfig: any = {
      required: question.required
    };

    switch (normalizedType) {
      case QuestionType.SHORT_TEXT:
      case 'short_text':
        questionConfig.textQuestion = {
          paragraph: false
        };
        break;

      case QuestionType.LONG_TEXT:
      case 'long_text':
        questionConfig.textQuestion = {
          paragraph: true
        };
        break;

      case QuestionType.MULTIPLE_CHOICE:
      case 'multiple_choice':
        const multipleOptions = question.multipleChoiceConfig?.options || question.options || [];
        if (multipleOptions.length === 0) {
          throw new Error(`La pregunta "${question.title}" es de tipo opción múltiple pero no tiene opciones. Por favor, proporciona al menos una opción.`);
        }
        questionConfig.choiceQuestion = {
          type: 'RADIO',
          options: multipleOptions.map((option: string) => ({
            value: option
          }))
        };
        break;

      case QuestionType.CHECKBOXES:
      case 'checkboxes':
        const checkboxOptions = question.multipleChoiceConfig?.options || question.options || [];
        if (checkboxOptions.length === 0) {
          throw new Error(`La pregunta "${question.title}" es de tipo casillas de verificación pero no tiene opciones. Por favor, proporciona al menos una opción.`);
        }
        questionConfig.choiceQuestion = {
          type: 'CHECKBOX',
          options: checkboxOptions.map((option: string) => ({
            value: option
          }))
        };
        break;

      case QuestionType.DROPDOWN:
      case 'dropdown':
        const dropdownOptions = question.multipleChoiceConfig?.options || question.options || [];
        if (dropdownOptions.length === 0) {
          throw new Error(`La pregunta "${question.title}" es de tipo lista desplegable pero no tiene opciones. Por favor, proporciona al menos una opción.`);
        }
        questionConfig.choiceQuestion = {
          type: 'DROP_DOWN',
          options: dropdownOptions.map((option: string) => ({
            value: option
          }))
        };
        break;

      case QuestionType.LINEAR_SCALE:
      case 'linear_scale':
        const scaleConfig = question.linearScaleConfig;
        questionConfig.scaleQuestion = {
          low: scaleConfig?.min || 1,
          high: scaleConfig?.max || 5,
          lowLabel: scaleConfig?.minLabel || '',
          highLabel: scaleConfig?.maxLabel || ''
        };
        break;

      case QuestionType.DATE:
      case 'date':
        questionConfig.dateQuestion = {
          includeTime: false,
          includeYear: true
        };
        break;

      case QuestionType.TIME:
      case 'time':
        questionConfig.timeQuestion = {
          duration: false
        };
        break;

      case QuestionType.EMAIL:
      case 'email':
        questionConfig.textQuestion = {
          paragraph: false
        };
        break;

      case QuestionType.NUMBER:
      case 'number':
        questionConfig.textQuestion = {
          paragraph: false
        };
        break;

      case QuestionType.PHONE:
      case 'phone':
        questionConfig.textQuestion = {
          paragraph: false
        };
        break;



      case 'rating':
        // Mapear rating a linear scale
        const ratingConfig = { min: 1, max: 5 };
        const ratingOptions = question.options?.[0]?.split('-') || ['1', '5'];
        if (ratingOptions.length === 2) {
          ratingConfig.min = parseInt(ratingOptions[0]) || 1;
          ratingConfig.max = parseInt(ratingOptions[1]) || 5;
        }
        questionConfig.scaleQuestion = {
          low: ratingConfig.min,
          high: ratingConfig.max,
          lowLabel: '',
          highLabel: ''
        };
        break;

      default:
        console.warn(`Tipo de pregunta no reconocido: ${question.type}, usando texto corto por defecto`);
        questionConfig.textQuestion = {
          paragraph: false
        };
    }

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

  private async applyFormSettings(formId: string, settings: GoogleFormSettings, accessToken: string): Promise<void> {
    const auth = this.getAuthClient(accessToken);
    
    try {
      console.log('🔧 Aplicando configuraciones:', settings);
      const requests: any[] = [];

      const settingsUpdates: any = {};
      
      // Aplicar configuraciones de la colección de emails
      if (settings.collectEmails !== undefined) {
        const emailCollectionType = settings.collectEmails ? 'RESPONDER_INPUT' : 'DO_NOT_COLLECT';
        settingsUpdates.emailCollectionType = emailCollectionType;
        console.log('📧 Configurando recolección de emails:', emailCollectionType);
      }

      // Solo enviar updateSettings si hay configuraciones que aplicar
      if (Object.keys(settingsUpdates).length > 0) {
        const updateMask = [];
        if (settingsUpdates.emailCollectionType) updateMask.push('emailCollectionType');
        
        console.log('🔐 Aplicando configuraciones de settings:', settingsUpdates);
        requests.push({
          updateSettings: {
            settings: settingsUpdates,
            updateMask: updateMask.join(',')
          }
        });
      }

      // Ejecutar todas las actualizaciones si hay requests
      if (requests.length > 0) {
        console.log('📤 Enviando requests:', JSON.stringify(requests, null, 2));
        
        await this.formsAPI.forms.batchUpdate({
          auth,
          formId,
          requestBody: {
            requests
          }
        });

        console.log('✅ Configuraciones disponibles del formulario aplicadas exitosamente');
      } else {
        console.log('ℹ️ No hay configuraciones disponibles para aplicar');
      }

    } catch (error) {
      console.error('❌ Error aplicando configuraciones del formulario:', error);
      // No lanzar error para no interrumpir la creación del formulario
      console.warn('⚠️ Algunas configuraciones no pudieron aplicarse, pero el formulario se creó correctamente');
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

  async getUserForms(accessToken: string): Promise<UserForm[]> {
    try {
      const auth = this.getAuthClient(accessToken);
      
      console.log('📋 Obteniendo formularios del usuario...');

      // Buscar archivos de tipo Google Forms en Google Drive
      const driveResponse = await this.driveAPI.files.list({
        auth,
        q: "mimeType='application/vnd.google-apps.form' and trashed=false",
        fields: 'files(id,name,description,createdTime,modifiedTime,webViewLink)',
        orderBy: 'modifiedTime desc'
      });

      const files = driveResponse.data.files || [];
      console.log(`✅ ${files.length} formularios encontrados`);

      const userForms: UserForm[] = files.map((file) => ({
        id: file.id || '',
        title: file.name || '',
        description: file.description || undefined,
        googleFormUrl: file.webViewLink || '',
        editUrl: file.webViewLink || '',
        responseCount: 0,
        createdAt: file.createdTime ? new Date(file.createdTime) : new Date(),
        modifiedAt: file.modifiedTime ? new Date(file.modifiedTime) : new Date()
      }));

      console.log(`✅ ${userForms.length} formularios procesados exitosamente`);
      return userForms;

    } catch (error: any) {
      console.error('❌ Error obteniendo formularios del usuario:', error);
      throw this.handleGoogleAPIError(error);
    }
  }

  private async getFormResponseCount(formId: string, accessToken: string): Promise<number> {
    try {
      const responses = await this.getFormResponses(formId, accessToken);
      return responses.length;
    } catch (error) {
      console.warn(`⚠️ Error obteniendo conteo de respuestas para ${formId}:`, error);
      return 0;
    }
  }
}

// Singleton instance
export const googleFormsService = new GoogleFormsServiceImpl();