'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileText, LayoutGrid, HelpCircle } from 'lucide-react';


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
      description: 'Crea formularios conversando con nuestra IA',
      cost: 2,
      colorClass: 'text-forms-500',
      bgColor: 'bg-white',
      borderColor: 'border-forms-200',
      buttonBg: 'bg-forms-500',
      docsUrl: '/docs'
    },
    {
      id: 'file',
      name: 'Importar Archivo',
      icon: FileText,
      description: 'Sube archivos Excel, CSV o Google Sheets',
      cost: 1,
      colorClass: 'text-velocity-500',
      bgColor: 'bg-white',
      borderColor: 'border-velocity-200',
      buttonBg: 'bg-velocity-500',
      docsUrl: '/docs'
    },
    {
      id: 'manual',
      name: 'Constructor Manual',
      icon: LayoutGrid,
      description: 'Editor visual con plantillas predefinidas',
      cost: 1,
      colorClass: 'text-accent',
      bgColor: 'bg-white',
      borderColor: 'border-accent/20',
      buttonBg: 'bg-accent',
      docsUrl: '/docs'
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



  const handleDocsClick = (docsUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(docsUrl, '_blank');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creationMethods.map((method) => (
          <Card
            key={method.id}
            className={`relative overflow-hidden border-2 ${method.borderColor} ${method.bgColor} hover:shadow-xl cursor-pointer group min-h-[280px]`}
            onClick={() => handleMethodSelect(method.id)}
          >
            {/* Header con icono grande */}
            <CardHeader className="pb-6 pt-8">
              <div className="flex flex-col items-center text-center space-y-4">

                  <method.icon className={`h-12 w-12 ${method.colorClass}`} />

                <div>
                  <CardTitle className={`text-2xl ${method.colorClass} font-bold mb-2`}>
                    {method.name}
                  </CardTitle>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700`}>
                    {method.cost} crédito{method.cost > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {/* Botón de documentación en esquina */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDocsClick(method.docsUrl, e)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
              >
                <HelpCircle className="h-4 w-4 text-slate-500" />
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0 pb-8 px-6">
              <CardDescription className="text-slate-600 text-center mb-8 text-base leading-relaxed">
                {method.description}
              </CardDescription>
              
              <Button
                disabled={!canCreateMethod(method.cost)}
                size="lg"
                className={`w-full ${
                  canCreateMethod(method.cost)
                    ? `${method.buttonBg} hover:opacity-90 text-white border-0 shadow-md`
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed border-0'
                }`}
              >
                <method.icon className="mr-2 h-5 w-5" />
                {canCreateMethod(method.cost) ? (
                  'Comenzar'
                ) : (
                  `Necesitas ${method.cost} créditos`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}