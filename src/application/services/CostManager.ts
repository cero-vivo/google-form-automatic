import { useState, useEffect } from 'react';
import { useCredits } from '@/containers/useCredits';
import { CONFIG } from '@/lib/config';

export interface CostRule {
  type: 'ai_message' | 'form_creation' | 'ai_generation' | 'ai_questions_pack';
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
      cost: CONFIG.CREDITS.CHAT.COST_PER_MESSAGE,
      description: 'Mensajes iniciales de IA (gratis)',
      limit: CONFIG.CREDITS.CHAT.FREE_MESSAGES
    });

    this.rules.set('ai_generation', {
      type: 'ai_generation',
      cost: CONFIG.CREDITS.CHAT.COST_PER_GENERATION,
      description: `Generación de formulario con IA (${CONFIG.CREDITS.CHAT.COST_PER_GENERATION} créditos)`
    });

    this.rules.set('ai_message_exceeded', {
      type: 'ai_message',
      cost: CONFIG.CREDITS.CHAT.COST_PER_MESSAGE_AFTER_FREE,
      description: `Mensajes adicionales después del límite (${CONFIG.CREDITS.CHAT.COST_PER_MESSAGE_AFTER_FREE} créditos)`
    });

    this.rules.set('ai_questions_pack', {
      type: 'ai_questions_pack',
      cost: CONFIG.CREDITS.CHAT.COST_PER_10_QUESTIONS,
      description: `Paquete de 10 preguntas adicionales (${CONFIG.CREDITS.CHAT.COST_PER_10_QUESTIONS} créditos)`
    });
  }

  getCostForAction(type: string, context?: any): number {
    const rule = this.rules.get(type);
    if (!rule) return 0;

    // Handle AI message cost calculation
    if (type === 'ai_message' && context?.messageCount > CONFIG.CREDITS.CHAT.FREE_MESSAGES) {
      return this.rules.get('ai_message_exceeded')?.cost || CONFIG.CREDITS.CHAT.COST_PER_MESSAGE_AFTER_FREE;
    }

    return rule.cost;
  }

  checkWarnings(currentCount: number, availableCredits: number): CostWarning[] {
    const warnings: CostWarning[] = [];

    // AI message limit warning
    if (currentCount === CONFIG.CREDITS.CHAT.FREE_MESSAGES - 1) {
      warnings.push({
        type: 'approaching_limit',
        message: `⚠️ Te queda 1 mensaje gratis antes de cobrar ${CONFIG.CREDITS.CHAT.COST_PER_MESSAGE_AFTER_FREE} créditos adicionales`,
        threshold: CONFIG.CREDITS.CHAT.FREE_MESSAGES
      });
    }

    if (currentCount >= CONFIG.CREDITS.CHAT.FREE_MESSAGES) {
      warnings.push({
        type: 'limit_reached',
        message: `📊 Has superado el límite de ${CONFIG.CREDITS.CHAT.FREE_MESSAGES} mensajes gratuitos. Cada mensaje adicional cuesta ${CONFIG.CREDITS.CHAT.COST_PER_MESSAGE_AFTER_FREE} créditos.`
      });
    }

    if (availableCredits < CONFIG.CREDITS.CHAT.COST_PER_MESSAGE_AFTER_FREE) {
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