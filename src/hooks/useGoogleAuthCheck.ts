import { useState, useEffect, useCallback } from 'react';
import { useGoogleAuthContext } from '../providers/GoogleAuthProvider';
import { useGoogleAPIInterceptor } from '../services/google-api-interceptor';

type AuthStatus = 'checking' | 'valid' | 'expired' | 'error';

interface UseGoogleAuthCheckReturn {
  status: AuthStatus;
  error: string | null;
  checkAuth: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook para verificación silenciosa de autenticación con Google
 * Solo determina si los permisos están expirados después de una verificación real
 */
export function useGoogleAuthCheck(): UseGoogleAuthCheckReturn {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isGoogleAuthenticated, checkGoogleAuthStatus, renewGoogleAuth } = useGoogleAuthContext();
  const { canProceedWithGoogleOps, handleGoogleFormsError } = useGoogleAPIInterceptor();

  /**
   * Realiza una verificación silenciosa con Google API
   * Intenta hacer una llamada real para determinar si los permisos son válidos
   */
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Primero verificar el estado general
      const authValid = await checkGoogleAuthStatus(true);
      
      if (!authValid) {
        setStatus('expired');
        setIsLoading(false);
        return;
      }

      // Verificar si podemos proceder con operaciones
      const canProceed = await canProceedWithGoogleOps();
      
      if (!canProceed) {
        setStatus('expired');
        setIsLoading(false);
        return;
      }

      // Hacer una llamada real de prueba a Google API
      try {
        const response = await fetch('/api/google-forms/test-connection', {
          method: 'GET',
          credentials: 'include', // Incluir cookies de sesión
        });

        if (response.ok) {
          setStatus('valid');
        } else if (response.status === 401 || response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          
          // Verificar si es un error de autorización específico
          if (errorData.error === 'invalid_grant' || 
              errorData.error === 'unauthorized_client' ||
              response.status === 401) {
            setStatus('expired');
          } else {
            setStatus('valid'); // Otros errores no son de autorización
          }
        } else {
          setStatus('valid'); // Errores no relacionados con autorización
        }
      } catch (fetchError) {
        // Si hay error de red, asumir que necesitamos verificar
        const handled = await handleGoogleFormsError(fetchError);
        if (handled) {
          setStatus('expired');
        } else {
          setStatus('error');
          setError('Error de conexión al verificar autenticación');
        }
      }

    } catch (error) {
      console.error('Error en verificación de autenticación:', error);
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [checkGoogleAuthStatus, canProceedWithGoogleOps, handleGoogleFormsError]);

  /**
   * Renueva los permisos y actualiza el estado
   */
  const renewPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      await renewGoogleAuth();
      
      // Verificar nuevamente después de renovar
      await checkAuth();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al renovar permisos');
      setStatus('expired');
    } finally {
      setIsLoading(false);
    }
  }, [renewGoogleAuth, checkAuth]);

  // Ejecutar verificación al montar el hook
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    status,
    error,
    checkAuth,
    isLoading,
  };
}