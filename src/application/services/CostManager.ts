import { useState, useEffect } from 'react';
import { useCredits } from '@/containers/useCredits';

export interface CostRule {
  type: 'ai_message' | 'form_creation' | 'ai_generation';
  cost: number;
  description: string;
  limit?: number;
}

export interface CostWarning {
  type: 'approaching_limit' | 'limit_reached' | 'insufficient_credits';
  message: string;
  threshold?: number;
}

export class CostManager {
  private static instance: CostManager;
  private rules: Map<string, CostRule> = new Map();
  private warnings: CostWarning[] = [];

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): CostManager {
    if (!CostManager.instance) {
      CostManager.instance = new CostManager();
    }
    return CostManager.instance;
  }

  private initializeDefaultRules() {
    this.rules.set('ai_message', {
      type: 'ai_message',
      cost: 0,
      description: 'Mensajes iniciales de IA (gratis)',
      limit: 15
    });

    this.rules.set('ai_generation', {
      type: 'ai_generation',
      cost: 2,
      description: 'Generación de formulario con IA (2 créditos)'
    });

    this.rules.set('ai_message_exceeded', {
      type: 'ai_message',
      cost: 2,
      description: 'Mensajes adicionales después del límite (2 créditos)'
    });
  }

  getCostForAction(type: string, context?: any): number {
    const rule = this.rules.get(type);
    if (!rule) return 0;

    // Handle AI message cost calculation
    if (type === 'ai_message' && context?.messageCount > 15) {
      return this.rules.get('ai_message_exceeded')?.cost || 2;
    }

    return rule.cost;
  }

  checkWarnings(currentCount: number, availableCredits: number): CostWarning[] {
    const warnings: CostWarning[] = [];

    // AI message limit warning
    if (currentCount === 14) {
      warnings.push({
        type: 'approaching_limit',
        message: '⚠️ Te queda 1 mensaje gratis antes de cobrar 2 créditos adicionales',
        threshold: 15
      });
    }

    if (currentCount >= 15) {
      warnings.push({
        type: 'limit_reached',
        message: '📊 Has superado el límite de mensajes gratuitos. Cada mensaje adicional cuesta 2 créditos.'
      });
    }

    if (availableCredits < 2) {
      warnings.push({
        type: 'insufficient_credits',
        message: '💳 No tienes suficientes créditos para continuar. Por favor recarga tu cuenta.'
      });
    }

    return warnings;
  }

  getRuleDescription(type: string): string {
    const rule = this.rules.get(type);
    return rule?.description || 'Costo no definido';
  }

  getAllRules(): CostRule[] {
    return Array.from(this.rules.values());
  }
}

// Hook para usar el CostManager en componentes
export function useCostManager() {
  const costManager = CostManager.getInstance();
  const { currentCredits } = useCredits();
  const [warnings, setWarnings] = useState<CostWarning[]>([]);

  const calculateCost = (type: string, context?: any): number => {
    return costManager.getCostForAction(type, context);
  };

  const getWarnings = (currentCount: number): CostWarning[] => {
    return costManager.checkWarnings(currentCount, currentCredits);
  };

  // Actualizar warnings cuando cambian las dependencias
  useEffect(() => {
    // Este useEffect está aquí por si se necesita actualizar warnings globalmente
    // pero no debe ser usado para causar re-renders infinitos
  }, [currentCredits]);

  const canAfford = (cost: number): boolean => {
    return currentCredits >= cost;
  };

  return {
    calculateCost,
    getWarnings,
    canAfford,
    getRuleDescription: costManager.getRuleDescription.bind(costManager),
    availableCredits: currentCredits,
    warnings
  };
}