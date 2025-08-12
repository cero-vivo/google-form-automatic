'use client';

import { useState, useCallback } from 'react';
import { useAuthContext } from './useAuth';
import { useCredits } from './useCredits';
import { CreditUsage } from '@/types/credits';

export interface UseFormCreationReturn {
  // Estado
  isCreating: boolean;
  error: string | null;
  
  // Acciones
  createForm: (formData: any, formTitle?: string) => Promise<boolean>;
  checkCreditsAvailability: () => Promise<boolean>;
  
  // Utilidades
  clearError: () => void;
}

export const useFormCreation = (): UseFormCreationReturn => {
  const { user, isAuthenticated } = useAuthContext();
  const { consumeCredits, hasEnoughCredits, currentCredits } = useCredits();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar disponibilidad de créditos
  const checkCreditsAvailability = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setError('Debes iniciar sesión para crear formularios');
      return false;
    }

    try {
      const hasCredits = await hasEnoughCredits(1);
      if (!hasCredits) {
        setError(`No tienes créditos suficientes. Necesitas al menos 1 crédito. Créditos disponibles: ${currentCredits}`);
        return false;
      }
      return true;
    } catch (err) {
      setError('Error al verificar créditos');
      return false;
    }
  }, [isAuthenticated, user, hasEnoughCredits, currentCredits]);

  // Crear formulario
  const createForm = useCallback(async (formData: any, formTitle?: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setError('Debes iniciar sesión para crear formularios');
      return false;
    }

    // Verificar créditos antes de crear
    const hasCredits = await checkCreditsAvailability();
    if (!hasCredits) {
      return false;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Aquí iría la lógica real de creación del formulario
      // Por ahora simulamos la creación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Consumir crédito después de crear exitosamente
      const usage: CreditUsage = {
        formId: `form_${Date.now()}`,
        formTitle: formTitle || 'Formulario sin título',
        amount: 1
      };

      await consumeCredits(usage);
      
      console.log('✅ Formulario creado y crédito consumido exitosamente');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el formulario';
      setError(errorMessage);
      console.error('Error creating form:', err);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [isAuthenticated, user, checkCreditsAvailability, consumeCredits]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    isCreating,
    error,
    
    // Acciones
    createForm,
    checkCreditsAvailability,
    
    // Utilidades
    clearError
  };
}; 