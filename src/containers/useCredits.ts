'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from './useAuth';
import { CreditsService } from '@/infrastructure/firebase/credits-service';
import { UserCredits, CreditUsage } from '@/types/credits';

export interface UseCreditsReturn {
  // Estado
  credits: UserCredits | null;
  loading: boolean;
  error: string | null;
  
  // Estadísticas
  currentCredits: number;
  totalPurchased: number;
  totalUsed: number;
  usagePercentage: number;
  
  // Acciones
  consumeCredits: (usage: CreditUsage) => Promise<boolean>;
  hasEnoughCredits: (requiredAmount?: number) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
  
  // Utilidades
  clearError: () => void;
}

export const useCredits = (): UseCreditsReturn => {
  const { user, isAuthenticated } = useAuthContext();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  // Calcular estadísticas
  const currentCredits = credits?.balance || 0;
  const totalPurchased = credits?.history
    .filter(t => t.type === 'purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalUsed = credits?.history
    .filter(t => t.type === 'use' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const usagePercentage = totalPurchased > 0 ? Math.round((totalUsed / totalPurchased) * 100) : 0;

  // Cargar créditos del usuario
  const loadUserCredits = useCallback(async (userId: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredits = await CreditsService.getUserCredits(userId);
      
      if (!userCredits) {
        // Inicializar créditos si el usuario no tiene
        const newCredits = await CreditsService.initializeUserCredits(userId);
        setCredits(newCredits);
      } else {
        setCredits(userCredits);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar créditos';
      setError(errorMessage);
      console.error('Error loading credits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para inicializar créditos si no existen
  const initializeCreditsIfNeeded = useCallback(async (userId: string) => {
    try {
      const userCredits = await CreditsService.getUserCredits(userId);
      
      if (!userCredits) {
        console.log(`🆕 Inicializando créditos para usuario: ${userId}`);
        // Inicializar créditos si el usuario no tiene
        const newCredits = await CreditsService.initializeUserCredits(userId);
        setCredits(newCredits);
      }
    } catch (err) {
      console.error('Error initializing credits:', err);
    }
  }, []);

  // Efecto principal para suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCredits(null);
      setLoading(false);
      userIdRef.current = null;
      return;
    }

    // Solo suscribirse si el usuario cambió
    if (userIdRef.current !== user.id) {
      userIdRef.current = user.id;
      console.log(`✅ Suscribiendo a créditos en tiempo real para usuario: ${user.id}`);
      setLoading(true);
      
      let unsubscribe: (() => void) | null = null;
      
      // Inicializar créditos si no existen y luego suscribirse
      initializeCreditsIfNeeded(user.id).then(() => {
        // Luego suscribirse a cambios en tiempo real
        unsubscribe = CreditsService.subscribeToUserCredits(user.id, (userCredits) => {
          console.log(`📥 Créditos actualizados en tiempo real:`, userCredits);
          setCredits(userCredits);
          setLoading(false);
        });
      });
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [isAuthenticated, user?.id, initializeCreditsIfNeeded]);

  // Consumir créditos
  const consumeCredits = useCallback(async (usage: CreditUsage): Promise<boolean> => {
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      setError(null);
      const success = await CreditsService.consumeCredits(user.id, usage);
      
      if (success) {
        console.log('✅ Créditos consumidos exitosamente');
        // Recargar créditos después de consumir
      await loadUserCredits(user.id);
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al consumir créditos';
      setError(errorMessage);
      console.error('Error consuming credits:', err);
      throw err;
    }
  }, [user]); // Removido loadUserCredits para evitar loops

  // Verificar si tiene créditos suficientes
  const hasEnoughCredits = useCallback(async (requiredAmount: number = 1): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await CreditsService.hasEnoughCredits(user.id, requiredAmount);
    } catch (err) {
      console.error('Error checking credits availability:', err);
      return false;
    }
  }, [user]);

  // Refrescar créditos
  const refreshCredits = useCallback(async () => {
    if (!user) return;
    
    try {
      await loadUserCredits(user.id);
    } catch (err) {
      console.error('Error refreshing credits:', err);
    }
  }, [user]); // Removido stableLoadUserCredits para evitar loops

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    credits,
    loading,
    error,
    
    // Estadísticas
    currentCredits,
    totalPurchased,
    totalUsed,
    usagePercentage,
    
    // Acciones
    consumeCredits,
    hasEnoughCredits,
    refreshCredits,
    
    // Utilidades
    clearError
  };
};