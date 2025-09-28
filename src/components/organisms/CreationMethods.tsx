'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, LayoutGrid, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreationMethodsProps {
  onQuestionsLoaded?: (questions: any[]) => void;
  currentCredits?: number;
  className?: string;
}

type MethodAccent = {
  hoverBorder: string;
  icon: string;
  badge: string;
  button: string;
};

const accentStyles: Record<'ai' | 'file' | 'manual', MethodAccent> = {
  ai: {
    hoverBorder: 'hover:border-velocity-300',
    icon: 'text-velocity-600',
    badge: 'bg-velocity-50 text-velocity-600',
    button: 'bg-velocity text-white hover:bg-velocity-600 focus-visible:ring-velocity-300'
  },
  file: {
    hoverBorder: 'hover:border-emerald-300',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-600',
    button: 'bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-300'
  },
  manual: {
    hoverBorder: 'hover:border-purple-300',
    icon: 'text-purple-600',
    badge: 'bg-purple-50 text-purple-600',
    button: 'bg-purple-600 text-white hover:bg-purple-500 focus-visible:ring-purple-300'
  }
};

export function CreationMethods({ onQuestionsLoaded: _onQuestionsLoaded, currentCredits = 0, className }: CreationMethodsProps) {
  const creationMethods = [
    {
      id: 'ai' as const,
      name: 'Asistente IA',
      icon: Sparkles,
      description: 'Genera formularios junto a nuestra IA y publícalos en segundos.',
      cost: 2,
      badge: 'Recomendado',
      docsUrl: '/docs'
    },
    {
      id: 'file' as const,
      name: 'Importar Archivo',
      icon: FileText,
      description: 'Convierte Excel, CSV o Sheets en formularios listos para usar.',
      cost: 1,
      docsUrl: '/docs'
    },
    {
      id: 'manual' as const,
      name: 'Constructor Manual',
      icon: LayoutGrid,
      description: 'Controla cada bloque con el editor visual de FastForm.',
      cost: 1,
      docsUrl: '/docs'
    }
  ];

  const canCreateMethod = (methodCost: number) => currentCredits >= methodCost;

  const handleMethodSelect = (methodId: 'ai' | 'file' | 'manual') => {
    const routes: Record<typeof methodId, string> = {
      ai: '/create/ai',
      file: '/create/file',
      manual: '/create/manual'
    };

    const route = routes[methodId];
    if (route) {
      window.location.href = route;
    }
  };

  const handleDocsClick = (docsUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(docsUrl, '_blank');
  };

  return (
    <div className={cn('space-y-8', className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {creationMethods.map((method) => {
          const accent = accentStyles[method.id];
          const isDisabled = !canCreateMethod(method.cost);

          return (
            <div
              key={method.id}
              onClick={() => {
                if (isDisabled) return;
                handleMethodSelect(method.id);
              }}
              className={cn(
                'flex h-full flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-9 lg:p-10 transition-all duration-300 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)]',
                isDisabled
                  ? 'cursor-not-allowed opacity-60'
                  : cn('cursor-pointer hover:-translate-y-1', accent.hoverBorder)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 ring-2 ring-slate-100">
                    <method.icon className={cn('h-7 w-7', accent.icon)} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-slate-900">
                      <h3 className="text-xl font-semibold leading-tight sm:text-2xl">
                        {method.name}
                      </h3>
                      {method.badge && (
                        <span className="rounded-full border border-white/60 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      {method.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-slate-200 bg-white p-0 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                  onClick={(e) => handleDocsClick(method.docsUrl, e)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]', accent.badge)}>
                  {method.cost} crédito{method.cost > 1 ? 's' : ''}
                </span>
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <Button
                  disabled={isDisabled}
                  className={cn(
                    'w-full justify-center text-base font-medium transition-shadow duration-300',
                    isDisabled
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : accent.button
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDisabled) return;
                    handleMethodSelect(method.id);
                  }}
                >
                  <method.icon className="mr-2 h-5 w-5" />
                  {isDisabled ? `Necesitas ${method.cost} crédito${method.cost > 1 ? 's' : ''}` : 'Crear formulario'}
                </Button>
                {isDisabled && (
                  <p className="text-center text-xs font-medium text-slate-500">
                    Obtén más créditos para desbloquear este método.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
