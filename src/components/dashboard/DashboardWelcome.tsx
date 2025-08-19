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
        <h2 className="text-3xl font-bold mb-4">¡Bienvenido a FastForm!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Elige cómo quieres crear tu formulario
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