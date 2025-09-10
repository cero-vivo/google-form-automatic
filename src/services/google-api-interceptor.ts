import { useGoogleAuthContext } from '@/providers/GoogleAuthProvider';
import { useState, useCallback } from 'react';

export interface APIError {
  code: number;
  message: string;
  details?: any;
}

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
};

/**
 * Hook para interceptar y manejar errores de Google API
 */
export const useGoogleAPIInterceptor = () => {
  const { 
    checkGoogleAuthStatus, 
    renewGoogleAuth,
    googleAuthStatus,
    isGoogleAuthenticated 
  } = useGoogleAuthContext();

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Determina si un error es de autenticación/autorización
   */
  const isAuthError = useCallback((error: any): boolean => {
    if (!error) return false;

    const errorCode = error.code || error.status || error.response?.status;
    const errorMessage = error.message || error.response?.data?.message || '';

    // Códigos de error de autenticación
    const authErrorCodes = [401, 403];
    
    // Mensajes de error específicos de Google
    const authErrorMessages = [
      'invalid_grant',
      'insufficient_scope',
      'Token de acceso inválido',
      'Token de acceso expirado',
      'Permisos insuficientes',
      'authentication required',
      'authorization required'
    ];

    return (
      authErrorCodes.includes(errorCode) ||
      authErrorMessages.some(msg => errorMessage.toLowerCase().includes(msg.toLowerCase()))
    );
  }, []);

  /**
   * Ejecuta una función con manejo automático de errores de autenticación
   */
  const executeWithAuthRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> => {
    const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: any;

    for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
      try {
        // Verificar autenticación antes de cada intento
        const isAuthenticated = await checkGoogleAuthStatus(true);
        
        if (!isAuthenticated) {
          console.warn('⚠️ Google auth expired, attempting renewal...');
          
          const renewed = await renewGoogleAuth();
          if (!renewed) {
            throw new Error('No se pudo renovar la autenticación con Google');
          }
          
          // Esperar a que se actualice el estado
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Ejecutar la operación
        const result = await operation();
        setRetryCount(0);
        return result;

      } catch (error) {
        lastError = error;

        // Si es un error de autenticación y no es el último intento
        if (isAuthError(error) && attempt < retryOptions.maxRetries) {
          console.log(`🔄 Retry attempt ${attempt + 1}/${retryOptions.maxRetries}`);
          
          const delay = retryOptions.exponentialBackoff 
            ? retryOptions.retryDelay * Math.pow(2, attempt)
            : retryOptions.retryDelay;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Si no es un error de autenticación o es el último intento
        throw error;
      }
    }

    throw lastError;
  }, [checkGoogleAuthStatus, renewGoogleAuth, isAuthError]);

  /**
   * Interceptor para fetch con manejo automático de errores
   */
  const fetchWithAuth = useCallback(async (
    url: string,
    options?: RequestInit,
    retryOptions?: Partial<RetryOptions>
  ): Promise<Response> => {
    return executeWithAuthRetry(async () => {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).response = response;
        throw error;
      }
      
      return response;
    }, retryOptions);
  }, [executeWithAuthRetry]);

  /**
   * Maneja errores de operaciones de Google Forms
   */
  const handleGoogleFormsError = useCallback(async (error: any): Promise<boolean> => {
    if (!isAuthError(error)) {
      return false; // No es un error de autenticación
    }

    console.warn('🔄 Handling Google Forms auth error...');
    
    try {
      setIsRetrying(true);
      
      // Intentar renovar la autenticación
      const renewed = await renewGoogleAuth();
      
      if (renewed) {
        console.log('✅ Google auth renewed successfully');
        return true;
      }
      
      console.error('❌ Failed to renew Google auth');
      return false;

    } catch (renewError) {
      console.error('❌ Error renewing Google auth:', renewError);
      return false;
    } finally {
      setIsRetrying(false);
    }
  }, [isAuthError, renewGoogleAuth]);

  /**
   * Verifica si puede proceder con operaciones de Google
   */
  const canProceedWithGoogleOps = useCallback(async (): Promise<boolean> => {
    if (isGoogleAuthenticated) {
      return true;
    }

    console.log('🔍 Checking Google auth status...');
    const isValid = await checkGoogleAuthStatus();
    
    if (!isValid) {
      console.log('🔄 Attempting to renew Google auth...');
      return await renewGoogleAuth();
    }

    return true;
  }, [isGoogleAuthenticated, checkGoogleAuthStatus, renewGoogleAuth]);

  return {
    // Estado
    isRetrying,
    retryCount,
    googleAuthStatus,
    
    // Funciones
    isAuthError,
    executeWithAuthRetry,
    fetchWithAuth,
    handleGoogleFormsError,
    canProceedWithGoogleOps,
  };
};

/**
 * Utilidad para crear headers con autenticación
 */
export const createAuthHeaders = (accessToken?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

/**
 * Utilidad para manejar errores de forma centralizada
 */
export const handleAPIError = (error: any): APIError => {
  const errorCode = error.code || error.status || error.response?.status || 500;
  const errorMessage = error.message || error.response?.data?.message || 'Error desconocido';
  
  return {
    code: errorCode,
    message: errorMessage,
    details: error.response?.data,
  };
};