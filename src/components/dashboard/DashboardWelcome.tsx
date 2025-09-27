'use client';

import React from 'react';
import { Question } from '@/domain/entities/question';
import { CreationMethods } from '@/components/organisms/CreationMethods';

interface DashboardWelcomeProps {
  onQuestionsLoaded: (questions: Question[]) => void;
  currentCredits: number;
}

export function DashboardWelcome({ onQuestionsLoaded, currentCredits }: DashboardWelcomeProps) {
  return (
    <>
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-velocity-600 tracking-tight">
          Bienvenido a FastForm
        </h2>
        <p className="text-lg text-slate-700 mb-2 max-w-4xl mx-auto leading-relaxed font-light">
          La herramienta más <span className="text-forms-500 font-medium">inteligente</span> para crear formularios profesionales
        </p>
        <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
          Ahorra tiempo con nuestra IA avanzada y herramientas de productividad
        </p>
      </div>

      {/* Creation Methods */}
      <CreationMethods 
        onQuestionsLoaded={onQuestionsLoaded}
        currentCredits={currentCredits}
        className="mb-8"
      />
    </>
  );
}