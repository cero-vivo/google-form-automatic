import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';

export type GoogleAuthStatus = 'valid' | 'expired' | 'renewing' | 'error' | 'checking';

export interface UseAuthWithGoogleReturn {
  // Estado de autenticación
  googleAuthStatus: GoogleAuthStatus;
  isGoogleAuthenticated: boolean;
  lastCheckTime: Date | null;
  
  // Acciones
  checkGoogleAuthStatus: (silent?: boolean) => Promise<boolean>;
  renewGoogleAuth: () => Promise<boolean>;
  
  // Utilidades
  isTokenExpired: (expiryDate?: Date) => boolean;
  getTimeUntilExpiry: (expiryDate?: Date) => number;
  
  // Estado de carga
  isChecking: boolean;
  isRenewing: boolean;
  error: string | null;
}

import { getGoogleAuthConfig } from '@/config/google-auth.config';

// Usar configuración centralizada
const config = getGoogleAuthConfig();
const { autoCheck: CHECK_INTERVAL, expiryThreshold: EXPIRY_THRESHOLD, retryDelay, maxRenewTimeout } = config.intervals;
const { maxRetries, maxRenewRetries } = config.limits;

export const useAuthWithGoogle = (): UseAuthWithGoogleReturn => {
  const { userEntity, signInWithGoogle } = useAuth();
  const { hasGooglePermissions } = useGoogleFormsIntegration();
  
  const [googleAuthStatus, setGoogleAuthStatus] = useState<GoogleAuthStatus>('checking');
  const [isChecking, setIsChecking] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  /**
   * Verifica si un token está expirado
   */
  const isTokenExpired = useCallback((expiryDate?: Date): boolean => {
    if (!expiryDate) return true;
    return new Date() >= expiryDate;
  }, []);

  /**
   * Obtiene el tiempo restante hasta la expiración en milisegundos
   */
  const getTimeUntilExpiry = useCallback((expiryDate?: Date): number => {
    if (!expiryDate) return 0;
    return Math.max(0, expiryDate.getTime() - new Date().getTime());
  }, []);

  /**
   * Verifica el estado de autenticación con Google
   */
  const checkGoogleAuthStatus = useCallback(async (silent = false): Promise<boolean> => {
    if (!silent) {
      setIsChecking(true);
    }
    
    try {
      setError(null);
      
      // Verificar si hay usuario autenticado
      if (!userEntity) {
        setGoogleAuthStatus('error');
        setError('No hay usuario autenticado');
        return false;
      }

      // Verificar si hay token de Google
      if (!userEntity.googleAccessToken) {
        setGoogleAuthStatus('expired');
        setError('No hay token de acceso de Google');
        return false;
      }

      // Verificar expiración del token
      if (isTokenExpired(userEntity.googleTokenExpiry)) {
        setGoogleAuthStatus('expired');
        setError('El token de acceso de Google ha expirado');
        return false;
      }

      // Verificar permisos adicionales
      const hasPermissions = hasGooglePermissions();
      if (!hasPermissions) {
        setGoogleAuthStatus('expired');
        setError('Los permisos de Google han expirado');
        return false;
      }

      // Si llegamos aquí, todo está válido
      setGoogleAuthStatus('valid');
      setLastCheckTime(new Date());
      retryCountRef.current = 0; // Resetear contador de reintentos
      
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error verificando autenticación';
      setGoogleAuthStatus('error');
      setError(errorMessage);
      
      console.error('❌ Error checking Google auth status:', err);
      return false;
    } finally {
      if (!silent) {
        setIsChecking(false);
      }
    }
  }, [userEntity, hasGooglePermissions, isTokenExpired]);

  /**
   * Renueva la autenticación con Google
   */
  const renewGoogleAuth = useCallback(async (): Promise<boolean> => {
    setIsRenewing(true);
    setError(null);
    
    try {
      setGoogleAuthStatus('renewing');
      
      // Intentar renovar con re-autenticación
      await signInWithGoogle();
      
      // Esperar un momento para que se actualice el estado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar el nuevo estado
      const isValid = await checkGoogleAuthStatus(true);
      
      if (isValid) {
        setGoogleAuthStatus('valid');
        console.log('✅ Google auth renewed successfully');
        return true;
      } else {
        throw new Error('No se pudo renovar la autenticación');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error renovando autenticación';
      setGoogleAuthStatus('error');
      setError(errorMessage);
      
      console.error('❌ Error renewing Google auth:', err);
      return false;
    } finally {
      setIsRenewing(false);
    }
  }, [signInWithGoogle, checkGoogleAuthStatus]);

  /**
   * Configura el intervalo de verificación automática
   */
  useEffect(() => {
    // Limpiar intervalo anterior
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Solo configurar si hay usuario autenticado
    if (userEntity?.googleAccessToken) {
      checkGoogleAuthStatus(true); // Verificación inicial silenciosa
      
      // Configurar verificación periódica
      checkIntervalRef.current = setInterval(() => {
        checkGoogleAuthStatus(true);
      }, CHECK_INTERVAL);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [userEntity?.googleAccessToken, checkGoogleAuthStatus]);

  /**
   * Manejo de reintentos automáticos
   */
  useEffect(() => {
    if (googleAuthStatus === 'error' && retryCountRef.current < maxRetries) {
      const retryTimeout = setTimeout(() => {
        retryCountRef.current += 1;
        checkGoogleAuthStatus(true);
      }, retryDelay * retryCountRef.current);

      return () => clearTimeout(retryTimeout);
    }
  }, [googleAuthStatus, checkGoogleAuthStatus, maxRetries, retryDelay]);

  const isGoogleAuthenticated = googleAuthStatus === 'valid';

  return {
    googleAuthStatus,
    isGoogleAuthenticated,
    lastCheckTime,
    checkGoogleAuthStatus,
    renewGoogleAuth,
    isTokenExpired,
    getTimeUntilExpiry,
    isChecking,
    isRenewing,
    error,
  };
};