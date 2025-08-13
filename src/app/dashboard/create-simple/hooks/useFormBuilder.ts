'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/domain/entities/question';
import { AutoSaveState, KeyboardShortcut } from '../types/form-builder';
import { QuestionType } from '@/domain/types';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  title: string;
  description: string;
  collectEmails: boolean;
  limitResponses: boolean;
  maxResponses?: number;
}

interface FormBuilderState {
  formData: FormData;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  selectedTemplate: string | null;
  autoSave: AutoSaveState;
  keyboardShortcuts: KeyboardShortcut[];
}

const defaultTemplates: Record<string, Partial<FormBuilderState>> = {
  empty: {
    formData: {
      title: '',
      description: '',
      collectEmails: false,
      limitResponses: false
    },
    questions: []
  },
  satisfaction: {
    formData: {
      title: 'Encuesta de Satisfacción',
      description: 'Ayúdanos a mejorar tu experiencia',
      collectEmails: true,
      limitResponses: false
    },
    questions: [
      {
        id: uuidv4(),
        title: '¿Qué tan satisfecho estás con nuestro servicio?',
        type: QuestionType.LINEAR_SCALE,
        required: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        linearScaleConfig: { min: 1, max: 5, minLabel: 'Muy insatisfecho', maxLabel: 'Muy satisfecho' }
      },
      {
        id: uuidv4(),
        title: '¿Qué aspectos valoras más?',
        type: QuestionType.MULTIPLE_CHOICE,
        required: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        multipleChoiceConfig: {
          options: ['Calidad del servicio', 'Atención al cliente', 'Precio', 'Rapidez', 'Otros']
        }
      },
      {
        id: uuidv4(),
        title: '¿Tienes algún comentario adicional?',
        type: QuestionType.LONG_TEXT,
        required: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  event: {
    formData: {
      title: 'Registro - Evento 2024',
      description: 'Completa tu registro para el evento',
      collectEmails: true,
      limitResponses: false
    },
    questions: [
      {
        id: uuidv4(),
        title: 'Nombre completo',
        type: QuestionType.SHORT_TEXT,
        required: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Correo electrónico',
        type: QuestionType.EMAIL,
        required: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Empresa/Organización',
        type: QuestionType.SHORT_TEXT,
        required: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Cargo',
        type: QuestionType.SHORT_TEXT,
        required: false,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
};

export function useFormBuilder(template: string | null) {
  const router = useRouter();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<FormBuilderState>(() => {
    const templateData = template && defaultTemplates[template] 
      ? defaultTemplates[template] 
      : defaultTemplates.empty;
    
    return {
      ...templateData,
      isLoading: false,
      error: null,
      selectedTemplate: template,
      autoSave: {
        isSaving: false,
        lastSaved: null,
        hasUnsavedChanges: false,
      },
      keyboardShortcuts: [
        { key: 'Ctrl+S', description: 'Guardar formulario', action: () => saveForm() },
        { key: 'Ctrl+Z', description: 'Deshacer', action: () => handleUndo() },
        { key: 'Ctrl+Y', description: 'Rehacer', action: () => handleRedo() },
        { key: 'Ctrl+N', description: 'Nueva pregunta', action: () => addQuestion(QuestionType.SHORT_TEXT) },
        { key: 'Escape', description: 'Cerrar modal', action: () => handleCloseModal() },
      ],
    } as FormBuilderState;
  });

  const saveForm = useCallback(async () => {
    setState(prev => ({
      ...prev,
      autoSave: { ...prev.autoSave, isSaving: true },
    }));
    
    try {
      // Save to localStorage for persistence
      const dataToSave = {
        formData: state.formData,
        questions: state.questions,
        lastSaved: new Date(),
      };
      localStorage.setItem('fastform-draft', JSON.stringify(dataToSave));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        autoSave: {
          isSaving: false,
          lastSaved: new Date(),
          hasUnsavedChanges: false,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        autoSave: { ...prev.autoSave, isSaving: false },
        error: 'Error al guardar el formulario',
      }));
    }
  }, [state.formData, state.questions]);

  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveForm();
    }, 2000);
  }, [saveForm]);

  const updateFormSettings = useCallback((updates: Partial<FormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
      autoSave: { ...prev.autoSave, hasUnsavedChanges: true }
    }));
    autoSave();
  }, [autoSave]);

  const addQuestion = useCallback((type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      title: getDefaultTitle(type),
      type: type,
      required: false,
      order: state.questions.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...getDefaultConfig(type)
    };

    setState(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      autoSave: { ...prev.autoSave, hasUnsavedChanges: true }
    }));
    autoSave();
  }, [autoSave, state.questions.length]);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates, updatedAt: new Date() } : q
      ),
      autoSave: { ...prev.autoSave, hasUnsavedChanges: true }
    }));
    autoSave();
  }, [autoSave]);

  const deleteQuestion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
      autoSave: { ...prev.autoSave, hasUnsavedChanges: true }
    }));
    autoSave();
  }, [autoSave]);

  const reorderQuestions = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newQuestions = [...prev.questions];
      const [removed] = newQuestions.splice(fromIndex, 1);
      newQuestions.splice(toIndex, 0, removed);
      return { 
        ...prev, 
        questions: newQuestions.map((q, index) => ({ ...q, order: index, updatedAt: new Date() })),
        autoSave: { ...prev.autoSave, hasUnsavedChanges: true }
      };
    });
    autoSave();
  }, [autoSave]);

  const handleUndo = useCallback(() => {
    // TODO: Implement undo functionality
    console.log('Undo');
  }, []);

  const handleRedo = useCallback(() => {
    // TODO: Implement redo functionality
    console.log('Redo');
  }, []);

  const handleCloseModal = useCallback(() => {
    // Close any open modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => modal.remove());
  }, []);

  const navigateBack = () => router.back();
  
  const clearDraft = () => {
    setState(prev => ({
      ...prev,
      formData: defaultTemplates.empty.formData,
      questions: defaultTemplates.empty.questions,
      autoSave: { ...prev.autoSave, hasUnsavedChanges: true }
    }));
    autoSave();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveForm();
            break;
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'n':
            e.preventDefault();
            addQuestion(QuestionType.SHORT_TEXT);
            break;
        }
      }
      
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveForm, handleUndo, handleRedo, addQuestion, handleCloseModal]);

  // Cargar borrador al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('form-builder-draft');
      if (saved && template === 'empty') {
        try {
          const draft = JSON.parse(saved);
          setState(prev => ({
            ...prev,
            formData: { ...prev.formData, ...draft.formData },
            questions: draft.questions || []
          }));
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [template]);

  return {
    formData: state.formData,
    questions: state.questions,
    isLoading: state.isLoading,
    error: state.error,
    autoSave: state.autoSave,
    keyboardShortcuts: state.keyboardShortcuts,
    updateFormSettings,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    saveForm,
    navigateBack,
    clearDraft,
  };
}

function getDefaultTitle(type: QuestionType): string {
  const titles: Record<QuestionType, string> = {
    [QuestionType.SHORT_TEXT]: 'Pregunta de texto corto',
    [QuestionType.LONG_TEXT]: 'Pregunta de texto largo',
    [QuestionType.MULTIPLE_CHOICE]: 'Selecciona una opción',
    [QuestionType.CHECKBOXES]: 'Selecciona todas las que correspondan',
    [QuestionType.DROPDOWN]: 'Selecciona de la lista',
    [QuestionType.LINEAR_SCALE]: 'Califica del 1 al 5',
    [QuestionType.DATE]: 'Selecciona una fecha',
    [QuestionType.TIME]: 'Selecciona una hora',
    [QuestionType.EMAIL]: 'Correo electrónico',
    [QuestionType.NUMBER]: 'Ingresa un número',
    [QuestionType.PHONE]: 'Número de teléfono'
  };
  return titles[type] || 'Nueva pregunta';
}

function getDefaultConfig(type: QuestionType): Partial<Question> {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return {
        multipleChoiceConfig: {
          options: ['Opción 1', 'Opción 2', 'Opción 3']
        }
      };
    case QuestionType.CHECKBOXES:
      return {
        multipleChoiceConfig: {
          options: ['Opción 1', 'Opción 2', 'Opción 3']
        }
      };
    case QuestionType.DROPDOWN:
      return {
        multipleChoiceConfig: {
          options: ['Selecciona una opción', 'Opción 1', 'Opción 2', 'Opción 3']
        }
      };
    case QuestionType.LINEAR_SCALE:
      return {
        linearScaleConfig: {
          min: 1,
          max: 5,
          minLabel: 'Muy malo',
          maxLabel: 'Muy bueno'
        }
      };
    default:
      return {};
  }
}