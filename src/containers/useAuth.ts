'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User, UserEntity } from '@/domain/entities/user';
import { firebaseAuthService } from '@/infrastructure/firebase/auth-service';
import { db, COLLECTIONS } from '@/infrastructure/firebase/config';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
}

export interface UseAuthReturn {
  // Estado
  user: AuthUser | null;
  userEntity: UserEntity | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Acciones de autenticación
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Acciones de usuario
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Context para compartir estado de auth
export const AuthContext = createContext<UseAuthReturn | null>(null);

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userEntity, setUserEntity] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  // Convertir FirebaseUser a AuthUser
  const convertFirebaseUser = useCallback((firebaseUser: FirebaseUser): AuthUser => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous
    };
  }, []);

  // Cargar datos del usuario desde Firestore
  const loadUserEntity = useCallback(async (userId: string): Promise<UserEntity | null> => {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return UserEntity.fromJSON(userData as User);
      }
      return null;
    } catch (error) {
      console.error('Error loading user entity:', error);
      return null;
    }
  }, []);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          const authUser = convertFirebaseUser(firebaseUser);
          const entity = await loadUserEntity(firebaseUser.uid);
          
          setUser(authUser);
          setUserEntity(entity);
          
          console.log('✅ User authenticated:', authUser.email);
        } catch (err) {
          console.error('❌ Error loading user data:', err);
          setError('Error al cargar datos del usuario');
        }
      } else {
        setUser(null);
        setUserEntity(null);
        console.log('✅ User signed out');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [convertFirebaseUser, loadUserEntity]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.signInWithEmail(email, password);
      // El estado se actualiza automáticamente por onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.signUpWithEmail(email, password, displayName);
      // El estado se actualiza automáticamente por onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cuenta';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.signInWithGoogle();
      // El estado se actualiza automáticamente por onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar con Google';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.signOut();
      // El estado se actualiza automáticamente por onAuthStateChanged
    } catch (err) {
      const errorMessage = 'Error al cerrar sesión';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.resetPassword(email);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar email de recuperación';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.updateUserProfile(data.displayName, data.photoURL);
      // El estado se actualiza automáticamente por onAuthStateChanged
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [user]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.updateUserPassword(currentPassword, newPassword);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar contraseña';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      await firebaseAuthService.deleteUserAccount();
      // El estado se actualiza automáticamente por onAuthStateChanged
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar cuenta';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      // TODO: Implementar refresh con Firebase
      console.log('Refresh user data');

      // Simular refresh
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✅ User data refreshed');
    } catch (err) {
      console.error('❌ Refresh user error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    // Estado
    user,
    userEntity,
    loading,
    error,
    isAuthenticated,
    
    // Acciones de autenticación
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    
    // Acciones de usuario
    updateProfile,
    updatePassword,
    deleteAccount,
    
    // Utilidades
    clearError,
    refreshUser
  };
};

// Hook para usar el contexto de auth
export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
}; 