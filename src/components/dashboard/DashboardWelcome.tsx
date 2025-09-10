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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ¡Bienvenido a FastForm!
        </h2>
        <p className="text-xl text-muted-foreground mb-6 max-w-6xl mx-auto">
          La forma más inteligente y rápida de crear formularios profesionales con Google Forms. 
          Ahorra horas de trabajo con nuestra herramienta de creación de formularios, IA avanzada y herramientas de productividad.
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