'use client';

import { useState, useCallback } from 'react';
import { Question } from '@/domain/entities/question';
import { 
  GoogleFormData, 
  CreatedFormResult,
  UserForm
} from '@/infrastructure/google/google-forms-service';
import { useAuthContext } from './useAuth';

export interface FormSettings {
  collectEmails?: boolean;
}

export interface FormCreationOptions {
  title: string;
  description?: string;
  questions: Question[];
  shareEmails?: string[];
  settings?: FormSettings;
  creditCost: number;
}

export interface UseGoogleFormsIntegrationReturn {
  // Estado
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingResponses: boolean;
  isSharing: boolean;
  isLoadingForms: boolean;
  error: string | null;
  createdForm: CreatedFormResult | null;
  formResponses: any[];
  userForms: UserForm[];
  
  // Acciones
  createGoogleForm: (options: FormCreationOptions) => Promise<CreatedFormResult | null>;
  updateGoogleForm: (formId: string, options: FormCreationOptions) => Promise<void>;
  deleteGoogleForm: (formId: string) => Promise<void>;
  getFormResponses: (formId: string) => Promise<any[]>;
  shareGoogleForm: (formId: string, emails: string[]) => Promise<void>;
  getUserForms: () => Promise<UserForm[]>;
  clearError: () => void;
  clearCreatedForm: () => void;
  
  // OAuth para permisos adicionales
  requestGooglePermissions: () => Promise<string | null>;
  hasGooglePermissions: () => boolean;
  renewSession: () => Promise<void>;
  
  // Estado de renovación
  needsSessionRenewal: boolean;
}

export const useGoogleFormsIntegration = (): UseGoogleFormsIntegrationReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdForm, setCreatedForm] = useState<CreatedFormResult | null>(null);
  const [formResponses, setFormResponses] = useState<any[]>([]);
  const [userForms, setUserForms] = useState<UserForm[]>([]);
  const [needsSessionRenewal, setNeedsSessionRenewal] = useState(false);

  const { user, userEntity, signInWithGoogle } = useAuthContext();

  // Función simplificada para mostrar error y forzar reauth
  const handleTokenError = useCallback((errorMessage: string) => {
    console.error('❌ Error de token:', errorMessage);
    setError('Tu sesión con Google ha expirado. Haz clic en "Renovar sesión" para continuar.');
    setNeedsSessionRenewal(true);
  }, []);

  const renewSession = useCallback(async () => {
    try {
      setError(null);
      setNeedsSessionRenewal(false);
      console.log('🔄 Renovando sesión con Google...');
      await signInWithGoogle();
      console.log('✅ Sesión renovada exitosamente');
    } catch (err) {
      console.error('❌ Error renovando sesión:', err);
      setError('No se pudo renovar la sesión. Por favor, recarga la página e inicia sesión nuevamente.');
      setNeedsSessionRenewal(true);
    }
  }, [signInWithGoogle]);

  // Función para renovar el token automáticamente
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    console.log('🔄 Token expirado o próximo a expirar, intentando refrescar...');
    
    if (!userEntity?.id) {
      handleTokenError('No hay usuario autenticado.');
      return null;
    }

    try {
      // Intentar refrescar el token usando el endpoint
      const response = await fetch('/api/auth/refresh-google-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userEntity.id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token refrescado exitosamente');
        
        // Recargar la entidad del usuario con el nuevo token
        // Esto se hará automáticamente en el próximo render
        return data.accessToken;
      } else {
        const errorData = await response.json();
        
        if (errorData.requiresReauth) {
          console.warn('⚠️ Requiere re-autenticación');
          handleTokenError('Tu sesión con Google ha expirado. Por favor, vuelve a iniciar sesión.');
        } else {
          handleTokenError('No se pudo refrescar el token. Intenta cerrar sesión y volver a entrar.');
        }
        
        return null;
      }
    } catch (error) {
      console.error('❌ Error refrescando token:', error);
      handleTokenError('Error al refrescar la sesión. Por favor, vuelve a iniciar sesión.');
      return null;
    }
  }, [userEntity, handleTokenError]);

  // Función simplificada para obtener token actual
  const getCurrentToken = useCallback(async (): Promise<string | null> => {
    console.log('🔍 Debug getCurrentToken:', {
      hasUserEntity: !!userEntity,
      hasGoogleAccessToken: !!userEntity?.googleAccessToken,
      googleAccessToken: userEntity?.googleAccessToken ? 'EXISTS' : 'NULL',
      googleTokenExpiry: userEntity?.googleTokenExpiry,
      isExpired: userEntity?.googleTokenExpiry ? userEntity.googleTokenExpiry.getTime() <= new Date().getTime() : 'NO_EXPIRY',
      currentTime: new Date().getTime(),
    });

    if (!userEntity?.googleAccessToken) {
      console.warn('⚠️ No userEntity or googleAccessToken');
      handleTokenError('No hay token de acceso de Google disponible.');
      return null;
    }

    // Verificar si el token ha expirado
    if (userEntity.googleTokenExpiry && userEntity.googleTokenExpiry.getTime() <= new Date().getTime()) {
      console.warn('⚠️ Token expirado');
      await refreshAccessToken(); // Esto mostrará el modal de renovación
      return null;
    }

    console.log('✅ Token válido encontrado');
    return userEntity.googleAccessToken;
  }, [userEntity, refreshAccessToken, handleTokenError]);

  const hasGooglePermissions = useCallback((): boolean => {
    // Verificar sincrónicamente si hay token válido
    if (!userEntity?.googleAccessToken) return false;
    if (userEntity.isGoogleTokenValid) {
      return userEntity.isGoogleTokenValid();
    }
    return true;
  }, [userEntity]);

  const requestGooglePermissions = useCallback(async (): Promise<string | null> => {
    try {
      const currentToken = await getCurrentToken();
      if (currentToken) {
        return currentToken;
      }
      
      // Si no hay token válido, solicitar nueva autenticación
      await renewSession();
      return await getCurrentToken();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo permisos';
      handleTokenError(errorMessage);
      return null;
    }
  }, [getCurrentToken, renewSession, handleTokenError]);

  const createGoogleForm = useCallback(async (options: FormCreationOptions): Promise<CreatedFormResult | null> => {
    console.log("🚀 ~ useGoogleFormsIntegration ~ options:", options)
    if (!user) {
      setError('Debes iniciar sesión con Google para crear formularios. La autenticación con Google es necesaria para acceder a Google Forms.');
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Verificar permisos y obtener token válido
      const accessToken = await getCurrentToken();
      if (!accessToken) {
        handleTokenError('Token no disponible');
        return null;
      }

      // Preparar datos del formulario
      const formData: GoogleFormData = {
        title: options.title,
        description: options.description || '',
        questions: options.questions.map(q => ({
          ...q,
          title: q.title || 'Pregunta sin título',
          description: q.description || '',
          required: q.required || false,
          options: q.options || []
        })),
        settings: {
          collectEmails: options.settings?.collectEmails || false,
          ...options.settings
        }
      };

      // Llamar a la API route
      const requestBody = JSON.stringify({
        formData,
        accessToken
      });
      
      const response = await fetch('/api/google-forms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejar errores específicos de autenticación desde la API
        if (response.status === 401 || response.status === 403) {
          handleTokenError('Tu sesión con Google ha expirado');
          return null;
        }
        
        throw new Error(errorData.error || 'Error al crear formulario');
      }

      const { data: result } = await response.json();
      
      setCreatedForm(result);

      // Consumir crédito después de crear exitosamente
      const usage = {
        formId: result.formId,
        formTitle: options.title || 'Formulario sin título',
        amount: options.creditCost
      };

      // Importar CreditsService y consumir créditos
      const { CreditsService } = await import('@/infrastructure/firebase/credits-service');
      await CreditsService.consumeCredits(user.id, usage);

      // Compartir si se especificaron emails
      if (options.shareEmails && options.shareEmails.length > 0) {
        await shareGoogleForm(result.formId, options.shareEmails);
      }

      // TODO: Guardar en Firestore para persistencia
      await saveFormToDatabase(result, options);

      console.log('✅ Formulario creado y crédito consumido exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear formulario';
      
      // Manejar errores específicos de autenticación
      if (errorMessage.includes('Token de acceso inválido') || 
          errorMessage.includes('Token expirado') ||
          errorMessage.includes('insufficient authentication scopes') ||
          errorMessage.includes('sesión con Google ha expirado')) {
        handleTokenError(errorMessage);
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        setError('No tienes permisos para crear formularios en Google. Asegúrate de haber iniciado sesión con la cuenta correcta.');
      } else {
        setError(errorMessage);
      }
      
      console.error('❌ Error creando formulario:', err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user, getCurrentToken, handleTokenError]);

  const updateGoogleForm = useCallback(async (formId: string, options: FormCreationOptions): Promise<void> => {
    if (!user) {
      setError('Debes estar autenticado para actualizar formularios');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const accessToken = await getCurrentToken();
      if (!accessToken) {
        handleTokenError('Token no disponible');
        return;
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
  }, [user, getCurrentToken, handleTokenError]);

  const deleteGoogleForm = useCallback(async (formId: string): Promise<void> => {
    if (!user) {
      setError('Debes estar autenticado para eliminar formularios');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const accessToken = await getCurrentToken();
      if (!accessToken) {
        handleTokenError('Token no disponible');
        return;
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
  }, [user, getCurrentToken, handleTokenError]);

  const getFormResponses = useCallback(async (formId: string): Promise<any[]> => {
    if (!user) {
      setError('Debes estar autenticado para ver respuestas');
      return [];
    }

    setIsLoadingResponses(true);
    setError(null);

    try {
      const accessToken = await getCurrentToken();
      if (!accessToken) {
        handleTokenError('Token no disponible');
        return [];
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
  }, [user, getCurrentToken, handleTokenError]);

  const shareGoogleForm = useCallback(async (formId: string, emails: string[]): Promise<void> => {
    if (!user) {
      setError('Debes estar autenticado para compartir formularios');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      const accessToken = await getCurrentToken();
      if (!accessToken) {
        handleTokenError('Token no disponible');
        return;
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
  }, [user, getCurrentToken, handleTokenError]);

  const getUserForms = useCallback(async (): Promise<UserForm[]> => {
    console.log('🚀 getUserForms iniciado:', {
      hasUser: !!user,
      userId: user?.id,
      hasUserEntity: !!userEntity,
      userEntityKeys: userEntity ? Object.keys(userEntity) : 'NO_ENTITY'
    });

    if (!user) {
      console.error('❌ No user authenticated');
      setError('Debes estar autenticado para obtener formularios');
      return [];
    }

    setIsLoadingForms(true);
    setError(null);

    try {
      console.log('🔍 Obteniendo formularios del usuario...');
      
      // Verificar si tenemos token válido
      const accessToken = await getCurrentToken();
      console.log('🔑 Token check result:', {
        hasToken: !!accessToken,
        tokenLength: accessToken ? accessToken.length : 0,
        tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'NULL'
      });

      if (!accessToken) {
        console.error('❌ No access token available');
        handleTokenError('Tu sesión con Google ha expirado');
        return [];
      }

      console.log('📡 Enviando request a API...');
      const response = await fetch('/api/google-forms/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken
        })
      });

      console.log('📨 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        
        // Manejar errores específicos de token
        if (response.status === 401 || errorData.error?.includes('Token de acceso inválido') || errorData.error?.includes('expirado')) {
          handleTokenError('Tu sesión con Google ha expirado');
          return [];
        }
        
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      const forms = result.data || [];
      
      console.log('✅ Forms retrieved successfully:', {
        formsCount: forms.length,
        formsPreview: forms.slice(0, 2).map((f: any) => ({ id: f.id, title: f.title }))
      });
      
      setUserForms(forms);
      console.log(`✅ ${forms.length} formularios cargados exitosamente`);
      
      return forms;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener formularios';
      console.error('❌ getUserForms error:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : 'NO_STACK'
      });
      setError(errorMessage);
      return [];
    } finally {
      setIsLoadingForms(false);
    }
  }, [user, userEntity, getCurrentToken, handleTokenError]);

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
    isLoadingForms,
    error,
    createdForm,
    formResponses,
    userForms,
    
    // Acciones
    createGoogleForm,
    updateGoogleForm,
    deleteGoogleForm,
    getFormResponses,
    shareGoogleForm,
    getUserForms,
    clearError,
    clearCreatedForm,
    
    // OAuth
    requestGooglePermissions,
    hasGooglePermissions,
    renewSession,
    
    // Estado de renovación
    needsSessionRenewal
  };
};