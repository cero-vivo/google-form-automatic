'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthWithGoogle, UseAuthWithGoogleReturn } from '@/hooks/useAuthWithGoogle';

// Contexto para compartir el estado de autenticación de Google
const GoogleAuthContext = createContext<UseAuthWithGoogleReturn | null>(null);

interface GoogleAuthProviderProps {
  children: React.ReactNode;
  autoCheck?: boolean;
}

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ 
  children, 
  autoCheck = true 
}) => {
  const googleAuth = useAuthWithGoogle();

  useEffect(() => {
    if (autoCheck) {
      // Verificación inicial cuando el provider se monta
      googleAuth.checkGoogleAuthStatus(true);
    }
  }, [autoCheck, googleAuth.checkGoogleAuthStatus]);

  return (
    <GoogleAuthContext.Provider value={googleAuth}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useGoogleAuthContext = (): UseAuthWithGoogleReturn => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuthContext debe ser usado dentro de GoogleAuthProvider');
  }
  return context;
};

// Hook de conveniencia para verificar autenticación de Google
export const useRequireGoogleAuth = () => {
  const googleAuth = useGoogleAuthContext();
  
  return {
    ...googleAuth,
    isReady: !googleAuth.isChecking,
    needsReauth: googleAuth.googleAuthStatus === 'expired' || googleAuth.googleAuthStatus === 'error',
  };
};