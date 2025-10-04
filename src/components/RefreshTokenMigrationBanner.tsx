'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/containers/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Banner para solicitar re-autenticación a usuarios sin refresh token
 * 
 * Este componente detecta automáticamente si el usuario necesita
 * volver a iniciar sesión para obtener el refresh token.
 */
export function RefreshTokenMigrationBanner() {
  const { userEntity, signInWithGoogle } = useAuth();
  const [needsReauth, setNeedsReauth] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar si el usuario necesita re-autenticación
    if (userEntity) {
      const hasAccessToken = !!userEntity.googleAccessToken;
      const hasRefreshToken = userEntity.hasGoogleRefreshToken?.() || false;
      
      // Necesita re-auth si tiene access token pero NO tiene refresh token
      if (hasAccessToken && !hasRefreshToken) {
        setNeedsReauth(true);
      } else {
        setNeedsReauth(false);
      }
    }
  }, [userEntity]);

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    try {
      await signInWithGoogle();
      setNeedsReauth(false);
      // Mostrar mensaje de éxito
      console.log('✅ Re-autenticación exitosa');
    } catch (error) {
      console.error('❌ Error en re-autenticación:', error);
    } finally {
      setIsReauthenticating(false);
    }
  };

  // No mostrar si fue descartado o no necesita re-auth
  if (dismissed || !needsReauth) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full animate-in slide-in-from-top duration-300">
      <Alert variant="default" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-none">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-200 font-semibold">
          Actualización de seguridad requerida
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <p className="mb-2">
                Hemos mejorado la seguridad y estabilidad de tu sesión. Por favor, vuelve a 
                conectar tu cuenta de Google para continuar sin interrupciones.
              </p>
              <p className="text-sm opacity-90">
                Solo necesitas hacerlo una vez. Después, tu sesión permanecerá activa automáticamente.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDismissed(true)}
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
              >
                Después
              </Button>
              <Button
                size="sm"
                onClick={handleReauthenticate}
                disabled={isReauthenticating}
                className="bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-500 dark:hover:bg-yellow-600"
              >
                {isReauthenticating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reconectar ahora
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Modal para solicitar re-autenticación cuando es crítica
 * (por ejemplo, al intentar crear un formulario)
 */
export function RefreshTokenMigrationModal() {
  const { userEntity, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  useEffect(() => {
    // Verificar si el usuario necesita re-autenticación
    if (userEntity) {
      const hasAccessToken = !!userEntity.googleAccessToken;
      const hasRefreshToken = userEntity.hasGoogleRefreshToken?.() || false;
      const isTokenExpired = !userEntity.isGoogleTokenValid?.() || false;
      
      // Mostrar modal si intenta usar funcionalidades y no puede renovar
      if (hasAccessToken && !hasRefreshToken && isTokenExpired) {
        setIsOpen(true);
      }
    }
  }, [userEntity]);

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    try {
      await signInWithGoogle();
      setIsOpen(false);
      console.log('✅ Re-autenticación exitosa');
    } catch (error) {
      console.error('❌ Error en re-autenticación:', error);
    } finally {
      setIsReauthenticating(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in zoom-in duration-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Sesión de Google expirada
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tu sesión con Google ha expirado y no podemos renovarla automáticamente. 
              Por favor, vuelve a conectar tu cuenta para continuar.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
              Esto solo es necesario una vez. Después, tu sesión se renovará automáticamente.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isReauthenticating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReauthenticate}
                disabled={isReauthenticating}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isReauthenticating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reconectar con Google
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para verificar si el usuario necesita re-autenticación
 */
export function useRefreshTokenMigration() {
  const { userEntity } = useAuth();
  const [needsReauth, setNeedsReauth] = useState(false);

  useEffect(() => {
    if (userEntity) {
      const hasAccessToken = !!userEntity.googleAccessToken;
      const hasRefreshToken = userEntity.hasGoogleRefreshToken?.() || false;
      
      setNeedsReauth(hasAccessToken && !hasRefreshToken);
    } else {
      setNeedsReauth(false);
    }
  }, [userEntity]);

  return {
    needsReauth,
    hasRefreshToken: userEntity?.hasGoogleRefreshToken?.() || false,
    canAutoRenew: userEntity?.canRefreshGoogleToken?.() || false,
  };
}
