'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {  LayoutGrid, Type, List, CheckSquare, Calendar, Mail, Hash, Globe, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { useCredits } from '@/containers/useCredits';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { ReusableFormBuilder } from './ReusableFormBuilder';
interface ManualFormBuilderProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
  draftId?: string;
}

const questionTypes = [
  { value: 'short_text' as QuestionType, label: 'Texto corto', icon: Type, description: 'Respuesta breve de una línea' },
  { value: 'long_text' as QuestionType, label: 'Texto largo', icon: Type, description: 'Respuesta extensa de varias líneas' },
  { value: 'multiple_choice' as QuestionType, label: 'Opción múltiple', icon: List, description: 'Seleccionar una opción de varias' },
  { value: 'checkboxes' as QuestionType, label: 'Casillas', icon: CheckSquare, description: 'Seleccionar varias opciones' },
  { value: 'dropdown' as QuestionType, label: 'Lista desplegable', icon: List, description: 'Seleccionar de un menú desplegable' },
  { value: 'number' as QuestionType, label: 'Número', icon: Hash, description: 'Solo acepta números' },
  { value: 'email' as QuestionType, label: 'Email', icon: Mail, description: 'Valida formato de correo electrónico' },
  { value: 'date' as QuestionType, label: 'Fecha', icon: Calendar, description: 'Selector de fecha calendario' },
  { value: 'url' as QuestionType, label: 'URL', icon: Globe, description: 'Valida formato de sitio web' }
];

export function ManualFormBuilder({ onFormCreated, currentCredits = 0, draftId }: ManualFormBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [collectEmail, setCollectEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { consumeCredits } = useCredits();
  const { createGoogleForm, isCreating, error: googleError } = useGoogleFormsIntegration();

  const handleCreateForm = async () => {
    if (questions.length === 0) {
      setError('Debes agregar al menos una pregunta');
      return;
    }

    if (!formTitle.trim()) {
      setError('Debes agregar un título al formulario');
      return;
    }

    if (currentCredits < 1) {
      setError('No tienes suficientes créditos para crear un formulario (requiere 1 crédito)');
      return;
    }

    try {
      const result = await createGoogleForm({
        title: formTitle,
        description: formDescription,
        questions: questions,
        settings: {
          collectEmails: collectEmail
        }
      });

      if (result) {
        const formData = {
          title: formTitle,
          description: formDescription,
          questions: questions,
          collectEmail: collectEmail,
          creationMethod: 'manual',
          formId: result.formId,
          formUrl: result.formUrl,
          editUrl: result.editUrl,
          createdAt: new Date()
        };
        
        onFormCreated?.(formData);
      }
    } catch (error) {
      setError('Error al crear el formulario');
    }
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
        onFormCreated={handleCreateForm}
        mode="create"
        submitButtonText="Crear formulario"
        draftId={draftId}
      />
    </div>
  );
}