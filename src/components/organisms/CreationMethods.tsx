'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileText, LayoutGrid } from 'lucide-react';


interface CreationMethodsProps {
  onQuestionsLoaded?: (questions: any[]) => void;
  currentCredits?: number;
  className?: string;
}

export function CreationMethods({ onQuestionsLoaded, currentCredits = 0, className }: CreationMethodsProps) {

  const creationMethods = [
    {
      id: 'ai',
      name: 'Asistente IA',
      icon: Sparkles,
      description: 'Crea formularios conversando con nuestra IA. Describe lo que necesitas y generaremos el formulario perfecto.',
      cost: 2,
      colorClass: 'text-forms',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBgColor: 'hover:bg-purple-100',
      features: [
        'Conversación natural',
        'Detección inteligente de tipos de preguntas',
        'Sugerencias de validación',
        'Edición visual en tiempo real',
        'Optimización automática'
      ]
    },
    {
      id: 'file',
      name: 'Importar Archivo',
      icon: FileText,
      description: 'Sube un archivo Excel, CSV o Google Sheets y conviértelo automáticamente en un formulario.',
      cost: 1,
      colorClass: 'text-excel',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBgColor: 'hover:bg-green-100',
      features: [
        'Soporte Excel, CSV, Google Sheets',
        'Mapeo automático de columnas',
        'Validación de datos',
        'Vista previa antes de crear',
        'Detección de tipos de preguntas'
      ]
    },
    {
      id: 'manual',
      name: 'Constructor Manual',
      icon: LayoutGrid,
      description: 'Crea tu formulario paso a paso con nuestro editor visual intuitivo y plantillas predefinidas.',
      cost: 1,
      colorClass: 'text-velocity',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBgColor: 'hover:bg-orange-100',
      features: [
        'Editor drag & drop',
        'Plantillas profesionales',
        'Personalización completa',
        'Validación en tiempo real',
        'Vista previa instantánea'
      ]
    }
  ];



  const canCreateMethod = (methodCost: number) => {
    return currentCredits >= methodCost;
  };

  const handleMethodSelect = (methodId: string) => {
    const routes = {
      'ai': '/create/ai',
      'file': '/create/file',
      'manual': '/create/manual'
    };

    const route = routes[methodId as keyof typeof routes];
    if (route) {
      window.location.href = route;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {creationMethods.map((method) => (
          <div
            key={method.id}
            className={`group relative overflow-hidden rounded-xl border ${method.borderColor} ${method.bgColor} shadow-sm transition-all duration-200 hover:shadow-lg hover:border-slate-300 min-h-[auto] lg:min-h-[480px]`}
          >
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl ${method.hoverBgColor} flex items-center justify-center transition-colors duration-200">
                  <method.icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${method.colorClass} transition-colors duration-200`} />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold ${method.colorClass}`}>
                    {method.name}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">
                    {method.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Costo</span>
                  <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg ${method.bgColor} ${method.colorClass} text-sm sm:text-base font-medium transition-colors duration-200`}>
                    {method.cost} crédito{method.cost > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base font-medium text-slate-700">Características</h4>
                  <ul className="space-y-1.5">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className={`text-sm sm:text-base mt-0.5 ${method.colorClass} transition-colors duration-200`}>•</span>
                        <span className="text-sm sm:text-base text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => handleMethodSelect(method.id)}
                disabled={!canCreateMethod(method.cost)}
                className={`w-full mt-4 sm:mt-6 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 ${
                  canCreateMethod(method.cost)
                    ? `bg-white ${method.colorClass} border ${method.borderColor} hover:${method.hoverBgColor} hover:text-white hover:shadow-md`
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canCreateMethod(method.cost) ? (
                  <span className="flex items-center justify-center">
                    Comenzar
                    <method.icon className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  `Necesitas ${method.cost} créditos`
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}