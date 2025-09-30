'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LayoutGrid, AlertCircle } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { ReusableFormBuilder } from './ReusableFormBuilder';
import { DraftService } from '@/infrastructure/firebase/DraftService';
import { useAuth } from '@/containers/useAuth';

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
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const { user } = useAuth();

  // Load draft automatically when draftId is provided
  useEffect(() => {
    const loadDraftById = async () => {
      if (!draftId || !user) return;
      
      setIsLoadingDraft(true);
      try {
        const draft = await DraftService.getDraftById(user.id, draftId);
        if (draft) {
          setFormTitle(draft.title);
          setFormDescription(draft.description);
          setQuestions(draft.questions);
          setCollectEmail(draft.collectEmail);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        setError('Error al cargar el borrador');
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraftById();
  }, [draftId, user]);

  // Función para manejar el resultado de la creación del formulario desde ReusableFormBuilder
  const handleFormCreated = (formData: any) => {
    // El ReusableFormBuilder ya se encarga de crear el formulario y consumir créditos
    // Solo necesitamos notificar al componente padre
    onFormCreated?.(formData);
  };

  if (isLoadingDraft) {
    return (
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando borrador...</span>
        </div>
      </div>
    );
  }

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