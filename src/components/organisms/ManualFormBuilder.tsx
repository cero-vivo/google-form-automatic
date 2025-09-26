'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LayoutGrid, AlertCircle } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { ReusableFormBuilder } from './ReusableFormBuilder';

interface ManualFormBuilderProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
  draftId?: string;
}

export function ManualFormBuilder({ onFormCreated, currentCredits = 0, draftId }: ManualFormBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [collectEmail, setCollectEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar el resultado de la creación del formulario desde ReusableFormBuilder
  const handleFormCreated = (formData: any) => {
    // El ReusableFormBuilder ya se encarga de crear el formulario y consumir créditos
    // Solo necesitamos notificar al componente padre
    onFormCreated?.(formData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-forms/10 rounded-full flex items-center justify-center">
          <LayoutGrid className="w-8 h-8 text-forms" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-forms">
            Constructor de Formularios
          </h1>
          <p className="text-lg text-muted-foreground">
            Crea formularios personalizados desde cero
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ReusableFormBuilder
        creationMethod="manual"
        initialQuestions={questions}
        initialTitle={formTitle}
        initialDescription={formDescription}
        initialCollectEmail={collectEmail}
        onQuestionsChange={setQuestions}
        onTitleChange={setFormTitle}
        onDescriptionChange={setFormDescription}
        onCollectEmailChange={setCollectEmail}
        onFormCreated={handleFormCreated}
        mode="create"
        submitButtonText="Crear formulario"
        draftId={draftId}
      />
    </div>
  );
}