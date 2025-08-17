'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileText, LayoutGrid } from 'lucide-react';
import { AIChatFormCreator } from './AIChatFormCreator';
import { FileImportFormCreator } from './FileImportFormCreator';
import { ManualFormBuilder } from './ManualFormBuilder';

interface CreationMethodsProps {
  onQuestionsLoaded?: (questions: any[]) => void;
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
  className?: string;
}

export function CreationMethods({ onQuestionsLoaded, onFormCreated, currentCredits = 0, className }: CreationMethodsProps) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  const creationMethods = [
    {
      id: 'ai',
      name: 'Crear con IA',
      icon: Sparkles,
      description: 'Genera formularios mediante chat inteligente',
      cost: 2,
      features: ['Procesamiento de lenguaje natural', 'Sugerencias inteligentes', 'Optimización automática']
    },
    {
      id: 'file',
      name: 'Importar CSV/Excel',
      icon: FileText,
      description: 'Convierte archivos existentes en formularios',
      cost: 1,
      features: ['Soporte Excel/CSV', 'Detección automática', 'Validación inteligente']
    },
    {
      id: 'manual',
      name: 'Constructor Manual',
      icon: LayoutGrid,
      description: 'Crea formularios desde cero con interfaz visual',
      cost: 1,
      features: ['Interfaz interactiva', 'Tipos de pregunta completos', 'Personalización total']
    }
  ];

  const handleFormCreated = (formData: any) => {
    setActiveMethod(null);
    onFormCreated?.(formData);
  };

  const canCreateMethod = (methodCost: number) => {
    return currentCredits >= methodCost;
  };

  if (activeMethod) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setActiveMethod(null)}
        >
          ← Volver a métodos
        </Button>

        {activeMethod === 'ai' && (
          <AIChatFormCreator 
            onFormCreated={handleFormCreated}

          />
        )}
        {activeMethod === 'file' && (
          <FileImportFormCreator 
            onFormCreated={handleFormCreated}
            currentCredits={currentCredits}
          />
        )}
        {activeMethod === 'manual' && (
          <ManualFormBuilder 
            onFormCreated={handleFormCreated}
            currentCredits={currentCredits}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid md:grid-cols-3 gap-6">
        {creationMethods.map((method) => (
          <Card key={method.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <method.icon className="h-5 w-5 mr-2" />
                {method.name}
              </CardTitle>
              <CardDescription>{method.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Costo: {method.cost} crédito{method.cost > 1 ? 's' : ''}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {method.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setActiveMethod(method.id)}
                  disabled={!canCreateMethod(method.cost)}
                  className="w-full mt-4"
                  variant={canCreateMethod(method.cost) ? "default" : "outline"}
                >
                  {canCreateMethod(method.cost) ? 'Usar este método' : `Necesitas ${method.cost} créditos`}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}