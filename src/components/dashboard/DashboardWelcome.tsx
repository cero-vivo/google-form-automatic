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
  const insightPills = [
    {
      icon: Sparkles,
      label: `${currentCredits} crédito${currentCredits === 1 ? '' : 's'} disponibles`,
      accent: 'text-forms',
      background: 'bg-forms/10'
    },
    {
      icon: ShieldCheck,
      label: 'Integración directa con Google Forms',
      accent: 'text-excel',
      background: 'bg-excel/10'
    },
    {
      icon: Zap,
      label: 'Automatiza formularios en minutos',
      accent: 'text-velocity',
      background: 'bg-velocity/10'
    }
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl px-6 py-10 sm:px-10 md:py-12">
      <div className="pointer-events-none absolute -top-28 -left-28 h-64 w-64 rounded-full bg-velocity/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-forms/15 blur-3xl" />

      <div className="relative z-10 space-y-8">
        <div className="text-center md:text-left max-w-4xl mx-auto md:mx-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-forms/30 bg-white/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-forms">
            Plataforma FastForm
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Construye formularios con identidad profesional
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            Elige el flujo que mejor se adapte a tu equipo: desde automatizaciones con IA hasta importaciones precisas. Mantén la coherencia visual y publica en Google Forms en cuestión de minutos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {insightPills.map(({ icon: Icon, label, accent, background }) => (
            <div
              key={label}
              className={`inline-flex items-center gap-2 rounded-full border border-white/60 ${background} px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur`}
            >
              <Icon className={`h-4 w-4 ${accent}`} />
              <span className="whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>

        <CreationMethods
          onQuestionsLoaded={onQuestionsLoaded}
          currentCredits={currentCredits}
          className="mt-6"
        />
      </div>
    </section>
  );
}
