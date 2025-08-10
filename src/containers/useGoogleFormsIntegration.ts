'use client';

import { useState, useCallback } from 'react';
import { Question } from '@/domain/entities/question';
import { 
  GoogleFormData, 
  CreatedFormResult 
} from '@/infrastructure/google/google-forms-service';
import { useAuthContext } from './useAuth';

export interface FormCreationOptions {
  title: string;
  description?: string;
  questions: Question[];
  shareEmails?: string[];
}

export interface UseGoogleFormsIntegrationReturn {
  // Estado
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingResponses: boolean;
  isSharing: boolean;
  error: string | null;
  createdForm: CreatedFormResult | null;
  formResponses: any[];
  
  // Acciones
  createGoogleForm: (options: FormCreationOptions) => Promise<CreatedFormResult | null>;
  updateGoogleForm: (formId: string, options: FormCreationOptions) => Promise<void>;
  deleteGoogleForm: (formId: string) => Promise<void>;
  getFormResponses: (formId: string) => Promise<any[]>;
  shareGoogleForm: (formId: string, emails: string[]) => Promise<void>;
  clearError: () => void;
  clearCreatedForm: () => void;
  
  // OAuth para permisos adicionales
  requestGooglePermissions: () => Promise<string | null>;
  hasGooglePermissions: () => boolean;
}

export const useGoogleFormsIntegration = (): UseGoogleFormsIntegrationReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdForm, setCreatedForm] = useState<CreatedFormResult | null>(null);
  const [formResponses, setFormResponses] = useState<any[]>([]);

  const { user, userEntity } = useAuthContext();

  const getAccessToken = useCallback((): string | null => {
    // Verificar si tenemos token y si está válido
    if (!userEntity?.googleAccessToken) {
      return null;
    }

    // Verificar si el token ha expirado
    if (userEntity.googleTokenExpiry && userEntity.googleTokenExpiry <= new Date()) {
      console.warn('⚠️ Token de Google expirado');
      return null;
    }

    return userEntity.googleAccessToken;
  }, [userEntity]);

  const hasGooglePermissions = useCallback((): boolean => {
    const token = getAccessToken();
    return token !== null;
  }, [getAccessToken]);

  const requestGooglePermissions = useCallback(async (): Promise<string | null> => {
    try {
      // Si ya tenemos un token válido, devolverlo
      const currentToken = getAccessToken();
      if (currentToken) {
        return currentToken;
      }

      // Si no tenemos token o está expirado, necesitamos reautenticar
      // Redirigir al usuario para que vuelva a iniciar sesión con Google
      throw new Error('Token expirado. Por favor, cierra sesión y vuelve a iniciar sesión con Google para renovar los permisos.');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo permisos';
      setError(errorMessage);
      return null;
    }
  }, [getAccessToken]);

  const createGoogleForm = useCallback(async (options: FormCreationOptions): Promise<CreatedFormResult | null> => {
    if (!user) {
      setError('Debes estar autenticado para crear formularios');
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Verificar permisos
      let accessToken = getAccessToken();
      if (!accessToken) {
        accessToken = await requestGooglePermissions();
        if (!accessToken) {
          throw new Error('No se pudieron obtener los permisos necesarios');
        }
      }

      // Preparar datos del formulario
      const formData: GoogleFormData = {
        title: options.title,
        description: options.description,
        questions: options.questions
      };

      console.log('🚀 Iniciando creación de formulario:', formData);

      // Llamar a la API route
      const response = await fetch('/api/google-forms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          accessToken
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear formulario');
      }

      const { data: result } = await response.json();
      
      setCreatedForm(result);

      // Compartir si se especificaron emails
      if (options.shareEmails && options.shareEmails.length > 0) {
        await shareGoogleForm(result.formId, options.shareEmails);
      }

      // TODO: Guardar en Firestore para persistencia
      await saveFormToDatabase(result, options);

      console.log('✅ Formulario creado exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear formulario';
      
      // Manejar errores específicos de autenticación
      if (errorMessage.includes('Token de acceso inválido') || 
          errorMessage.includes('Token expirado') ||
          errorMessage.includes('insufficient authentication scopes')) {
        setError('Tu sesión con Google ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión para renovar los permisos.');
      } else {
        setError(errorMessage);
      }
      
      console.error('❌ Error creando formulario:', err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user, getAccessToken, requestGooglePermissions]);

  const updateGoogleForm = useCallback(async (formId: string, options: FormCreationOptions): Promise<void> => {
    if (!user) {
      setError('Debes estar autenticado para actualizar formularios');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acceso no disponible');
      }

      const formData: GoogleFormData = {
        title: options.title,
        description: options.description,
        questions: options.questions
      };

      // TODO: Implementar API route para updateForm
      throw new Error('Funcionalidad de actualización no disponible aún');
      
      console.log('✅ Formulario actualizado exitosamente');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar formulario';
      setError(errorMessage);
      console.error('❌ Error actualizando formulario:', err);
    } finally {
      setIsUpdating(false);
    }
  }, [user, getAccessToken]);

  const deleteGoogleForm = useCallback(async (formId: string): Promise<void> => {
    if (!user) {
      setError('Debes estar autenticado para eliminar formularios');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acceso no disponible');
      }

      // TODO: Implementar API route para deleteForm
      throw new Error('Funcionalidad de eliminación no disponible aún');
      
      // TODO: Eliminar también de Firestore
      
      console.log('✅ Formulario eliminado exitosamente');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar formulario';
      setError(errorMessage);
      console.error('❌ Error eliminando formulario:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [user, getAccessToken]);

  const getFormResponses = useCallback(async (formId: string): Promise<any[]> => {
    if (!user) {
      setError('Debes estar autenticado para ver respuestas');
      return [];
    }

    setIsLoadingResponses(true);
    setError(null);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acceso no disponible');
      }

      // TODO: Implementar API route para getFormResponses
      const responses: any[] = [];
      setFormResponses(responses);
      
      console.log(`✅ ${responses.length} respuestas obtenidas`);
      return responses;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener respuestas';
      setError(errorMessage);
      console.error('❌ Error obteniendo respuestas:', err);
      return [];
    } finally {
      setIsLoadingResponses(false);
    }
  }, [user, getAccessToken]);

  const shareGoogleForm = useCallback(async (formId: string, emails: string[]): Promise<void> => {
    if (!user) {
      setError('Debes estar autenticado para compartir formularios');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acceso no disponible');
      }

      // TODO: Implementar API route para shareForm
      throw new Error('Funcionalidad de compartir no disponible aún');
      
      console.log('✅ Formulario compartido exitosamente');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al compartir formulario';
      setError(errorMessage);
      console.error('❌ Error compartiendo formulario:', err);
    } finally {
      setIsSharing(false);
    }
  }, [user, getAccessToken]);

  // Helper para guardar en base de datos
  const saveFormToDatabase = useCallback(async (formResult: CreatedFormResult, options: FormCreationOptions): Promise<void> => {
    try {
      // TODO: Implementar guardado en Firestore
      // Aquí guardaríamos el formulario en nuestra base de datos para tracking
      
      console.log('💾 Guardando formulario en base de datos:', {
        formId: formResult.formId,
        userId: user?.id,
        title: options.title,
        questionCount: options.questions.length
      });

      // Simular guardado por ahora
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.warn('⚠️ Error guardando en base de datos:', error);
      // No lanzar error aquí para no interrumpir el flujo principal
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCreatedForm = useCallback(() => {
    setCreatedForm(null);
  }, []);

  return {
    // Estado
    isCreating,
    isUpdating,
    isDeleting,
    isLoadingResponses,
    isSharing,
    error,
    createdForm,
    formResponses,
    
    // Acciones
    createGoogleForm,
    updateGoogleForm,
    deleteGoogleForm,
    getFormResponses,
    shareGoogleForm,
    clearError,
    clearCreatedForm,
    
    // OAuth
    requestGooglePermissions,
    hasGooglePermissions
  };
}; 