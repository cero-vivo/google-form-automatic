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
    window.open(docsUrl);
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
                'group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg',
                isDisabled
                  ? 'cursor-not-allowed opacity-60'
                  : cn('cursor-pointer hover:-translate-y-1 hover:shadow-xl', accent.hoverBorder)
              )}
            >
              {/* Header with Icon and Help */}
              <div className="flex items-start justify-between p-8 pb-5">
                <div className={cn('flex h-16 w-16 items-center justify-center rounded-xl transition-colors', accent.badge)}>
                  <method.icon className={cn('h-8 w-8', accent.icon)} />
                </div>
                <button
                  className="rounded-lg p-2.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                  onClick={(e) => handleDocsClick(method.docsUrl, e)}
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-8">
                {/* Title and Badge */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 leading-tight">
                      {method.name}
                    </h3>
                    {method.badge && (
                      <span className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {method.description}
                  </p>
                </div>

                {/* Cost Badge */}
                <div className="mb-7">
                  <span className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium',
                    accent.badge,
                    'border-current/20'
                  )}>
                    <div className="h-2 w-2 rounded-full bg-current opacity-60" />
                    {method.cost} crédito{method.cost > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-8 pt-0">
                <Button
                  disabled={isDisabled}
                  className={cn(
                    'w-full h-12 text-base font-medium transition-all duration-200',
                    isDisabled
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
                      : cn(accent.button, 'shadow-sm hover:shadow-md')
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDisabled) return;
                    handleMethodSelect(method.id);
                  }}
                >
                  {isDisabled ? (
                    <>
                      <method.icon className="mr-2 h-5 w-5 opacity-50" />
                      Necesitas {method.cost} crédito{method.cost > 1 ? 's' : ''}
                    </>
                  ) : (
                    <>
                      <method.icon className="mr-2 h-5 w-5" />
                      Crear formulario
                    </>
                  )}
                </Button>
                {isDisabled && (
                  <p className="mt-3 text-center text-sm text-slate-500">
                    Obtén más créditos para usar este método
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
