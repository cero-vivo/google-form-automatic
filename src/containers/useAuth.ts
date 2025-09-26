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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Acciones de usuario
  updateProfile: (data: Partial<User>) => Promise<void>;
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
    let isMounted = true;

    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          const authUser = convertFirebaseUser(firebaseUser);
          const entity = await loadUserEntity(firebaseUser.uid);
          
          if (isMounted) {
            setUser(authUser);
            setUserEntity(entity);
          }
        } catch (err) {
          console.error('❌ Error loading user data:', err);
          if (isMounted) {
            setError('Error al cargar datos del usuario');
            setUser(null);
            setUserEntity(null);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setUserEntity(null);
          console.log('✅ User signed out');
        }
      }
      
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [convertFirebaseUser, loadUserEntity]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Agregar timeout de 30 segundos para prevenir loading infinito
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de conexión')), 80000);
      });

      await Promise.race([
        firebaseAuthService.signInWithGoogle(),
        timeoutPromise
      ]);
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
    signInWithGoogle,
    signOut,
    
    // Acciones de usuario
    updateProfile,
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