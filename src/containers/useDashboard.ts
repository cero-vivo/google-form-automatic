'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './useAuth';
import { useCredits } from './useCredits';
import { CreditsService } from '@/infrastructure/firebase/credits-service';

export interface UseDashboardReturn {
  // Estado de créditos
  currentCredits: number;
  creditsLoading: boolean;
  creditsError: string | null;
  
  // Estado del dashboard
  isCreatingForm: boolean;
  canCreateForm: boolean;
  
  // Acciones
  checkCreditsAvailability: () => Promise<boolean>;
  refreshCredits: () => Promise<void>;
  
  // Utilidades
  clearCreditsError: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user, isAuthenticated } = useAuthContext();
  const { 
    currentCredits, 
    loading: creditsLoading, 
    error: creditsError,
    refreshCredits: refreshCreditsFromHook 
  } = useCredits();
  
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [canCreateForm, setCanCreateForm] = useState(false);

  // Verificar si puede crear formularios en tiempo real
  useEffect(() => {
    console.log(`🔄 Verificando capacidad de crear formularios. Créditos: ${currentCredits}`);
    setCanCreateForm(currentCredits > 0);
  }, [currentCredits]);

  // Verificar disponibilidad de créditos
  const checkCreditsAvailability = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const hasCredits = await CreditsService.hasEnoughCredits(user.id, 1);
      console.log(`🔍 Verificación de créditos: ${hasCredits ? 'SÍ' : 'NO'} tiene suficientes`);
      return hasCredits;
    } catch (err) {
      console.error('Error checking credits availability:', err);
      return false;
    }
  }, [user]);

  // Refrescar créditos
  const refreshCredits = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Refrescando créditos manualmente...');
      await refreshCreditsFromHook();
    } catch (err) {
      console.error('Error refreshing credits:', err);
    }
  }, [user, refreshCreditsFromHook]);

  // Limpiar error de créditos
  const clearCreditsError = useCallback(() => {
    // Esta función se implementará cuando se agregue manejo de errores
  }, []);

  return {
    // Estado de créditos
    currentCredits,
    creditsLoading,
    creditsError,
    
    // Estado del dashboard
    isCreatingForm,
    canCreateForm,
    
    // Acciones
    checkCreditsAvailability,
    refreshCredits,
    
    // Utilidades
    clearCreditsError
  };
}; 