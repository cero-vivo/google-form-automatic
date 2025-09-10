import { OpenAIFormService } from '@/application/services/OpenAIFormService';
import { CreditService } from '@/infrastructure/services/CreditService';
import { GoogleFormsService } from '@/infrastructure/services/GoogleFormsService';
import { FirebaseRepository } from '@/infrastructure/repositories/FirebaseRepository';
import { OpenAI } from 'openai';

// Mock dependencies
jest.mock('openai');
jest.mock('@/infrastructure/services/CreditService');
jest.mock('@/infrastructure/services/GoogleFormsService');
jest.mock('@/infrastructure/repositories/FirebaseRepository');

describe('OpenAIFormService', () => {
  let service: OpenAIFormService;
  let mockCreditService: jest.Mocked<CreditService>;
  let mockGoogleFormsService: jest.Mocked<GoogleFormsService>;
  let mockFirebaseRepository: jest.Mocked<FirebaseRepository>;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockCreditService = new CreditService() as jest.Mocked<CreditService>;
    mockGoogleFormsService = new GoogleFormsService() as jest.Mocked<GoogleFormsService>;
    mockFirebaseRepository = new FirebaseRepository() as jest.Mocked<FirebaseRepository>;
    mockOpenAI = new OpenAI() as jest.Mocked<OpenAI>;

    service = new OpenAIFormService(
      mockCreditService,
      mockGoogleFormsService,
      mockFirebaseRepository
    );

    // Setup mocks
    mockCreditService.getUserCredits = jest.fn().mockResolvedValue(10);
    mockCreditService.deductCredits = jest.fn().mockResolvedValue(true);
    mockCreditService.logChatInteraction = jest.fn().mockResolvedValue(true);
    mockOpenAI.chat = {
      completions: {
        create: jest.fn()
      }
    } as any;
  });

  describe('processChatMessage', () => {
    it('should process valid chat message and return form structure', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Formulario de prueba',
              questions: [
                { type: 'texto_corto', label: 'Nombre', required: true }
              ]
            })
          }
        }]
      };

      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.processChatMessage('user123', 'Crea un formulario con nombre');

      expect(result.form).toBeDefined();
      expect(result.form.title).toBe('Formulario de prueba');
      expect(mockCreditService.logChatInteraction).toHaveBeenCalled();
    });

    it('should handle insufficient credits', async () => {
      mockCreditService.getUserCredits = jest.fn().mockResolvedValue(0);

      await expect(
        service.processChatMessage('user123', 'Crea un formulario')
      ).rejects.toThrow('Créditos insuficientes');
    });

    it('should validate JSON structure', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Formulario inválido',
              // Missing questions array
            })
          }
        }]
      };

      (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        service.processChatMessage('user123', 'Crea un formulario')
      ).rejects.toThrow('Estructura del formulario inválida');
    });
  });

  describe('publishFormFromChat', () => {
    it('should publish form and deduct credits', async () => {
      const mockForm = {
        title: 'Formulario de prueba',
        questions: [
          { type: 'texto_corto', label: 'Nombre', required: true }
        ]
      };

      mockGoogleFormsService.createForm = jest.fn().mockResolvedValue({
        formId: 'form123',
        editUrl: 'https://forms.google.com/edit/form123',
        publishedUrl: 'https://forms.google.com/form123'
      });

      const result = await service.publishFormFromChat('user123', mockForm);

      expect(result.formId).toBe('form123');
      expect(mockCreditService.deductCredits).toHaveBeenCalledWith('user123', 2, 'publish');
      expect(mockFirebaseRepository.saveForm).toHaveBeenCalled();
    });

    it('should handle publish errors gracefully', async () => {
      const mockForm = {
        title: 'Formulario de prueba',
        questions: []
      };

      mockGoogleFormsService.createForm = jest.fn().mockRejectedValue(new Error('API Error'));

      await expect(
        service.publishFormFromChat('user123', mockForm)
      ).rejects.toThrow('Error al publicar el formulario');
    });
  });

  describe('getAgentContext', () => {
    it('should return correct agent context', () => {
      const context = service.getAgentContext();
      
      expect(context).toContain('Eres un especialista en creación de formularios');
      expect(context).toContain('texto_corto');
      expect(context).toContain('opcion_multiple');
      expect(context).toContain('escala_lineal');
    });
  });
});