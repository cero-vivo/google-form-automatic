'use client';

import React from 'react';
import { Question } from '@/domain/entities/question';
import { CreationMethods } from '@/components/organisms/CreationMethods';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface DashboardWelcomeProps {
  onQuestionsLoaded: (questions: Question[]) => void;
  currentCredits: number;
}

export function DashboardWelcome({ onQuestionsLoaded, currentCredits }: DashboardWelcomeProps) {
  const highlights = [
    {
      icon: Zap,
      title: `${currentCredits} crédito${currentCredits === 1 ? '' : 's'}`,
      subtitle: 'Listos para usar'
    }
  ];

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/90 px-6 py-10 sm:px-10 md:py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-excel/30 bg-excel/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-excel">
            Panel de creación
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Elige el camino para tu próximo formulario
          </h2>

        </div>

        <CreationMethods
          onQuestionsLoaded={onQuestionsLoaded}
          currentCredits={currentCredits}
          className="mt-2 max-w-5xl mx-auto"
        />
      </div>
    </section>
  );
}
