import React, { createContext, useContext } from 'react';
import { useGoogleAuthCheck } from '../hooks/useGoogleAuthCheck';

interface GoogleAuthCheckContextType {
  status: 'checking' | 'valid' | 'expired' | 'error';
  error: string | null;
  checkAuth: () => Promise<void>;
  isLoading: boolean;
}

const GoogleAuthCheckContext = createContext<GoogleAuthCheckContextType | undefined>(undefined);

export const useGoogleAuthCheckContext = () => {
  const context = useContext(GoogleAuthCheckContext);
  if (!context) {
    throw new Error('useGoogleAuthCheckContext must be used within GoogleAuthCheckProvider');
  }
  return context;
};

interface GoogleAuthCheckProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que maneja la verificación silenciosa de autenticación
 * Solo muestra el modal cuando los permisos están realmente expirados
 */
export function GoogleAuthCheckProvider({ children }: GoogleAuthCheckProviderProps) {
  const authCheck = useGoogleAuthCheck();

  return (
    <GoogleAuthCheckContext.Provider value={authCheck}>
      {children}
    </GoogleAuthCheckContext.Provider>
  );
}