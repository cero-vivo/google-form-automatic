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
    <div className="max-w-5xl mx-auto px-4">
      
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