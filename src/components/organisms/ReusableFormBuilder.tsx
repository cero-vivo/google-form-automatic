'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, LayoutGrid, Type, List, CheckSquare, Calendar, Mail, Hash, Globe, ChevronDown, ChevronUp, GripVertical, Save, Loader2, FileText, ClipboardList, HelpCircle, Settings } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Question } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { useAuth } from '@/containers/useAuth';
import { DraftService } from '@/infrastructure/firebase/DraftService';
import { DraftModal } from './DraftModal';
import { FormSuccessView } from './FormSuccessView';
import { CONFIG } from '@/lib/config';
import { useBrandToast } from '@/hooks/useBrandToast';

interface ReusableFormBuilderProps {
  initialQuestions?: Question[];
  initialTitle?: string;
  initialDescription?: string;
  initialCollectEmail?: boolean;
  onQuestionsChange?: (questions: Question[]) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onCollectEmailChange?: (collectEmail: boolean) => void;
  onFormCreated?: (formData: any) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  submitButtonText?: string;
  collectEmail?: boolean;
  hideSubmitButton?: boolean;
  creationMethod: 'ai' | 'manual' | 'excel';
  draftId?: string;
}

const questionTypes = [
  { value: 'short_text' as QuestionType, label: 'Texto corto', icon: Type, description: 'Respuesta breve de una línea' },
  { value: 'long_text' as QuestionType, label: 'Texto largo', icon: Type, description: 'Respuesta extensa de varias líneas' },
  { value: 'multiple_choice' as QuestionType, label: 'Opción múltiple', icon: List, description: 'Seleccionar una opción de varias' },
  { value: 'checkboxes' as QuestionType, label: 'Casillas', icon: CheckSquare, description: 'Seleccionar varias opciones' },
  { value: 'dropdown' as QuestionType, label: 'Lista desplegable', icon: List, description: 'Seleccionar de un menú desplegable' },
  { value: 'linear_scale' as QuestionType, label: 'Escala lineal', icon: LayoutGrid, description: 'Calificación en escala numérica' },
  { value: 'number' as QuestionType, label: 'Número', icon: Hash, description: 'Solo acepta números' },
  { value: 'email' as QuestionType, label: 'Email', icon: Mail, description: 'Valida formato de correo electrónico' },
  { value: 'date' as QuestionType, label: 'Fecha', icon: Calendar, description: 'Selector de fecha calendario' },
  { value: 'url' as QuestionType, label: 'URL', icon: Globe, description: 'Valida formato de sitio web' }
];

const mapQuestionType = (type: string | undefined): QuestionType => {
    if (!type) return QuestionType.SHORT_TEXT;
    
    const typeStr = type.toLowerCase().trim();
    
    switch (typeStr) {
      case 'short_text':
      case 'short':
      case 'texto_corto':
        return QuestionType.SHORT_TEXT;
      case 'long_text':
      case 'long':
      case 'texto_largo':
        return QuestionType.LONG_TEXT;
      case 'multiple_choice':
      case 'multiple choice':
      case 'opción múltiple':
      case 'opcion multiple':
      case 'opcion_multiple':
      case 'choice':
        return QuestionType.MULTIPLE_CHOICE;
      case 'checkboxes':
      case 'checkbox':
      case 'casillas':
        return QuestionType.CHECKBOXES;
      case 'dropdown':
      case 'lista_desplegable':
      case 'list':
        return QuestionType.DROPDOWN;
      case 'linear_scale':
      case 'linear scale':
      case 'escala_lineal':
      case 'scale':
        return QuestionType.LINEAR_SCALE;
      case 'number':
      case 'numero':
        return QuestionType.NUMBER;
      case 'email':
      case 'correo':
        return QuestionType.EMAIL;
      case 'date':
      case 'fecha':
        return QuestionType.DATE;
      case 'url':
      case 'website':
      case 'sitio':
        return QuestionType.URL;
      default:
        return QuestionType.SHORT_TEXT;
    }
  };



export const ReusableFormBuilder = forwardRef(function ReusableFormBuilder({
  initialQuestions = [],
  initialTitle = '',
  initialDescription = '',
  initialCollectEmail = true,
  onQuestionsChange,
  onTitleChange,
  onDescriptionChange,
  onCollectEmailChange,
  onFormCreated,
  onCancel,
  mode = 'create',
  submitButtonText = 'Crear formulario',
  hideSubmitButton = false,
  creationMethod,
  draftId
}: ReusableFormBuilderProps, ref) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [formDescription, setFormDescription] = useState(initialDescription);
  const [collectEmail, setCollectEmail] = useState(initialCollectEmail);
  const [createdFormData, setCreatedFormData] = useState<any>(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useBrandToast();

  // Load draft automatically when draftId is provided
  React.useEffect(() => {
    const loadDraftById = async () => {
      if (!draftId || !user) return;
      
      try {
        const draft = await DraftService.getDraftById(user.id, draftId);
        if (draft) {
          setFormTitle(draft.title);
          setFormDescription(draft.description);
          setQuestions(draft.questions);
          setCollectEmail(draft.collectEmail);
          
          // Notify parent components
          onTitleChange?.(draft.title);
          onDescriptionChange?.(draft.description);
          onQuestionsChange?.(draft.questions);
          onCollectEmailChange?.(draft.collectEmail);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        setError('Error al cargar el borrador');
      }
    };

    loadDraftById();
  }, [draftId, user]);

  // Update questions when initialQuestions changes with better type mapping
  React.useEffect(() => {
    const mappedQuestions = initialQuestions.map(q => {
        // Ensure correct type mapping from string to enum
        let mappedType: QuestionType;
        switch (q.type?.toLowerCase()) {
          case 'multiple_choice':
          case 'opcion_multiple':
          case 'opcion multiple':
          case 'opción múltiple':
          case 'multiple choice':
          case 'choice':
            mappedType = QuestionType.MULTIPLE_CHOICE;
            break;
        case 'checkboxes':
        case 'checkbox':
        case 'casillas':
          mappedType = QuestionType.CHECKBOXES;
          break;
        case 'dropdown':
        case 'lista_desplegable':
        case 'list':
          mappedType = QuestionType.DROPDOWN;
          break;
        case 'short_text':
        case 'texto_corto':
        case 'short':
        case 'text':
          mappedType = QuestionType.SHORT_TEXT;
          break;
        case 'long_text':
        case 'texto_largo':
        case 'long':
        case 'paragraph':
          mappedType = QuestionType.LONG_TEXT;
          break;
        case 'number':
        case 'número':
          mappedType = QuestionType.NUMBER;
          break;
        case 'email':
        case 'correo':
          mappedType = QuestionType.EMAIL;
          break;
        case 'date':
        case 'fecha':
          mappedType = QuestionType.DATE;
          break;
        case 'url':
        case 'website':
        case 'sitio_web':
          mappedType = QuestionType.URL;
          break;
        default:
          mappedType = q.type as QuestionType || QuestionType.SHORT_TEXT;
      }

      // Ensure options for types that need them
      const needsOptions = [QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOXES, QuestionType.DROPDOWN].includes(mappedType);
      let options = q.options || [];
      
      if (needsOptions && (!options || options.length === 0)) {
        // Try to extract options from description or use defaults
        if (q.description && q.description.includes('|')) {
          options = q.description.split('|').map(opt => opt.trim()).filter(opt => opt);
        } else if (q.description && q.description.includes(',')) {
          options = q.description.split(',').map(opt => opt.trim()).filter(opt => opt);
        } else {
          options = ['Opción 1', 'Opción 2'];
        }
      }

      return {
        ...q,
        type: mappedType,
        options: needsOptions ? options : [],
        title: q.title || 'Nueva pregunta',
        required: Boolean(q.required),
        order: q.order !== undefined ? q.order : questions.length,
        createdAt: q.createdAt || new Date(),
        updatedAt: q.updatedAt || new Date()
      };
    });
    
    setQuestions(mappedQuestions);
  }, [initialQuestions]);

  React.useEffect(() => {
    setFormTitle(initialTitle);
  }, [initialTitle]);

  React.useEffect(() => {
    setFormDescription(initialDescription);
  }, [initialDescription]);

  React.useEffect(() => {
    setCollectEmail(initialCollectEmail);
  }, [initialCollectEmail]);

  const updateQuestions = (newQuestions: Question[]) => {
    const normalizedQuestions = newQuestions.map((question, index) => ({
      ...question,
      order: index,
    }));

    setQuestions(normalizedQuestions);
    onQuestionsChange?.(normalizedQuestions);
  };
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { createGoogleForm, isCreating, error: googleError } = useGoogleFormsIntegration();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: QuestionType.SHORT_TEXT,
      title: 'Nueva pregunta',
      description: '',
      required: false,
      order: questions.length,
      options: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    updateQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const validateQuestion = (q: any): Question => {
      const baseQuestion = {
        id: q.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: q.title || q.text || 'Nueva pregunta',
        type: mapQuestionType(q.type),
        required: q.required || false,
        order: q.order || 0,
        createdAt: q.createdAt || new Date(),
        updatedAt: q.updatedAt || new Date()
      };
  
      // Configuración específica para escala lineal
      if (baseQuestion.type === 'linear_scale') {
        return {
          ...baseQuestion,
          linearScaleConfig: {
            min: q.linearScaleConfig?.min || 1,
            max: q.linearScaleConfig?.max || 5,
            minLabel: q.linearScaleConfig?.minLabel || '',
            maxLabel: q.linearScaleConfig?.maxLabel || ''
          }
        };
      }
  
      // Manejo de opciones para otros tipos
      if (['multiple_choice', 'checkboxes', 'dropdown'].includes(baseQuestion.type)) {
        return {
          ...baseQuestion,
          options: Array.isArray(q.options) 
            ? q.options 
            : extractOptionsFromDescription(q.description || q.text || '') || [
                { id: `opt_${Date.now()}_1`, text: 'Opción 1' },
                { id: `opt_${Date.now()}_2`, text: 'Opción 2' }
              ]
        };
      }
  
      return baseQuestion;
    };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const validatedUpdates = validateQuestion({ ...updates, id });
    updateQuestions(questions.map(q => 
      q.id === id ? { ...q, ...validatedUpdates } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    updateQuestions(questions.filter(q => q.id !== id));
    if (editingQuestion === id) {
      setEditingQuestion(null);
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= questions.length) return;

    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    updateQuestions(newQuestions);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (destination.index === source.index) return;

    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, movedQuestion);

    updateQuestions(reorderedQuestions);
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError('Debes agregar al menos una pregunta');
      return;
    }

    if (!formTitle.trim()) {
      setError('Debes agregar un título al formulario');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cost = {
        "ai": CONFIG.CREDITS.PUBLISH_FORM.IA,
        "excel": CONFIG.CREDITS.PUBLISH_FORM.FILE,
        "manual": CONFIG.CREDITS.PUBLISH_FORM.MANUAL
      }
      const result = await createGoogleForm(
        {
          title: formTitle,
          description: formDescription,
          questions: questions,
          creditCost: cost[creationMethod],
          settings: {
            collectEmails: collectEmail
          }
        }
      );

      if (result) {
        const formData = {
          title: formTitle,
          description: formDescription,
          questions: questions,
          collectEmail: collectEmail,
          creationMethod: creationMethod,
          formId: result.formId,
          formUrl: result.formUrl,
          editUrl: result.editUrl,
          createdAt: new Date()
        };

        setCreatedFormData(formData);
        setShowSuccessView(true);
        onFormCreated?.(formData);
      }
    } catch (error) {
      setError('Error al crear el formulario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      setError('Debes iniciar sesión para guardar borradores');
      return;
    }

    if (!formTitle.trim()) {
      setError('Debes agregar un título al formulario antes de guardar');
      return;
    }

    // Validar que no haya campos undefined
    const draftData = {
      title: formTitle || '',
      description: formDescription || '',
      questions: questions || [],
      collectEmail: collectEmail !== undefined ? collectEmail : true,
      creationMethod: creationMethod || 'manual'
    };

    // Validar que todas las preguntas tengan la estructura correcta
    const validatedQuestions = draftData.questions.map(q => ({
      id: q.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: q.title || 'Pregunta sin título',
      type: q.type || 'text',
      description: q.description || '',
      required: q.required !== undefined ? q.required : false,
      options: q.options || []
    }));

    setIsSavingDraft(true);
    setError(null);

    try {
      await DraftService.saveDraft(user.id, {
        ...draftData,
        questions: validatedQuestions as Question[]
      });

      // Show success feedback
      showSuccess('Borrador guardado', 'Puedes retomarlo desde tus borradores en cualquier momento.');
    } catch (error) {
      setError('Error al guardar el borrador');
      console.error('Error saving draft:', error);
      showError('No pudimos guardar el borrador', 'Revisa tu conexión e inténtalo nuevamente.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleLoadDraft = (draft: any) => {
    setFormTitle(draft.title);
    setFormDescription(draft.description);
    setQuestions(draft.questions);
    setCollectEmail(draft.collectEmail);
    
    // Notify parent components
    onTitleChange?.(draft.title);
    onDescriptionChange?.(draft.description);
    onQuestionsChange?.(draft.questions);
    onCollectEmailChange?.(draft.collectEmail);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  const QuestionEditor = ({ question, onUpdate, onDelete }: {
    question: Question;
    onUpdate: (id: string, updates: Partial<Question>) => void;
    onDelete: (id: string) => void;
  }) => {
    const [localQuestion, setLocalQuestion] = useState(question);
    const [isEditing, setIsEditing] = useState(false);

    React.useEffect(() => {
      setLocalQuestion(question);
    }, [question]);

    const handleSave = React.useCallback(() => {
      let questionToSave = { ...localQuestion };

      // Validar y agregar opciones por defecto para tipos que las necesitan
      if ((questionToSave.type === 'multiple_choice' || questionToSave.type === 'checkboxes' || questionToSave.type === 'dropdown') &&
        (!questionToSave.options || questionToSave.options.length === 0)) {
        questionToSave.options = ['Opción 1', 'Opción 2'];
      }

      onUpdate(question.id, questionToSave);
      setIsEditing(false);
    }, [localQuestion, question.id, onUpdate]);

    const handleCancel = () => {
      setLocalQuestion(question);
      setIsEditing(false);
    };

    const handleFocus = () => {
      setTimeout(() => {
        setIsEditing(true);

      }, 300);
    };

    const handleBlur = React.useCallback(() => {
      // Use setTimeout to debounce the blur event and prevent React fiber update issues
      setTimeout(() => {
        handleSave();
      }, 100);
    }, [handleSave]);

    // Auto-edición para preguntas nuevas
    React.useEffect(() => {
      const isNewQuestion = question.title === 'Nueva pregunta' && !question.description;
      if (isNewQuestion) {
        setIsEditing(true);
      }
    }, [question.title, question.description]);

    if (!isEditing) {
    return (
      <div
        className="p-4 sm:p-5 border border-neutral-200 rounded-xl bg-white cursor-pointer hover:border-forms-300 hover:shadow-sm transition-all duration-200 min-w-0"
        onClick={() => setIsEditing(true)}
        tabIndex={0}
        onFocus={handleFocus}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-neutral-800 font-inter">{question.title}</h4>
            {question.description && (
              <p className="text-sm text-neutral-600 mt-1 font-inter">{question.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs font-medium border-forms-200 text-forms-600 bg-forms-50">
                  {questionTypes.find(t => t.value === question.type)?.label || question.type}
                </Badge>
                {question.required && <Badge variant="secondary" className="text-xs bg-excel-100 text-excel-700 border-excel-200">Requerido</Badge>}
                {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
                  <Badge variant="outline" className="text-xs bg-velocity-50 border-velocity-200 text-velocity-700">
                    {question.options?.length || 0} opción{question.options?.length !== 1 ? 'es' : ''}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-inter"
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(question.id);
                }}
                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="p-4 sm:p-5 border-2 border-forms-300 rounded-xl bg-white shadow-sm min-w-0"
        onBlur={(e) => {
          // Solo guardar si el clic fue fuera del contenedor
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setTimeout(() => {
              handleSave();
            }, 100);
          }
        }}
      >
        <div className="space-y-4 min-w-0">
          <div>
            <Label className="text-sm font-medium text-neutral-700 font-inter">Pregunta *</Label>
            <Input
              value={localQuestion.title}
              onChange={(e) => setLocalQuestion({ ...localQuestion, title: e.target.value })}
              placeholder="Escribe tu pregunta aquí"
              className="mt-1 border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              autoFocus
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-neutral-700 font-inter">Descripción (opcional)</Label>
            <Input
              value={localQuestion.description || ''}
              onChange={(e) => setLocalQuestion({ ...localQuestion, description: e.target.value })}
              placeholder="Proporciona más contexto para esta pregunta"
              className="mt-1 border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-neutral-700 font-inter">Tipo de pregunta</Label>
              <select
                value={localQuestion.type}
                onChange={(e) => {
                  const newType = e.target.value as QuestionType;
                  const needsOptions = ['multiple_choice', 'checkboxes', 'dropdown'].includes(newType);
                  const currentOptions = localQuestion.options || [];

                  console.log('Changing question type from', localQuestion.type, 'to', newType);

                  const updatedQuestion = {
                    ...localQuestion,
                    type: newType,
                    options: needsOptions && currentOptions.length === 0 ? ['Opción 1', 'Opción 2'] : currentOptions
                  };

                  setLocalQuestion(updatedQuestion);
                }}
                className="w-full p-3 mt-1 border border-neutral-200 rounded-xl bg-white focus:ring-2 focus:ring-forms-200 focus:border-forms-400 font-inter transition-all duration-200"
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center mt-4 sm:mt-6">
              <input
                type="checkbox"
                id={`required-${question.id}`}
                checked={localQuestion.required}
                onChange={(e) => setLocalQuestion({ ...localQuestion, required: e.target.checked })}
                className="h-4 w-4 text-forms-500 rounded border-neutral-300 focus:ring-forms-200 mr-3"
              />
              <Label htmlFor={`required-${question.id}`} className="mb-0 text-sm font-medium text-neutral-700 cursor-pointer font-inter">
                Requerido
              </Label>
            </div>
          </div>

          {['multiple_choice', 'checkboxes', 'dropdown'].includes(localQuestion.type) && (
            <div>
              <Label className="text-sm font-medium text-neutral-700 font-inter">Opciones</Label>
              <div className="space-y-3 mt-2">
                {(localQuestion.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        setLocalQuestion({ ...localQuestion, options: newOptions });
                      }}
                      placeholder={`Opción ${index + 1}`}
                      className="flex-1 border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newOptions = (localQuestion.options || []).filter((_, i) => i !== index);
                        setLocalQuestion({ ...localQuestion, options: newOptions });
                      }}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newOptions = [...(localQuestion.options || []), `Opción ${(localQuestion.options || []).length + 1}`];
                    setLocalQuestion({ ...localQuestion, options: newOptions });
                  }}
                  className="border-forms-300 text-forms-600 hover:bg-forms-50 font-inter"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Agregar opción
                </Button>
              </div>
            </div>
          )}

          {/* Configuración para escala lineal */}
          {localQuestion.type === 'linear_scale' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-neutral-700 font-inter">Mínimo</Label>
                  <Input
                    type="number"
                    value={localQuestion.linearScaleConfig?.min || 1}
                    onChange={(e) => {
                      const min = parseInt(e.target.value) || 1;
                      const max = localQuestion.linearScaleConfig?.max || 5;
                      setLocalQuestion({
                        ...localQuestion,
                        linearScaleConfig: {
                          ...localQuestion.linearScaleConfig,
                          min: Math.min(min, max - 1),
                          max: max
                        }
                      });
                    }}
                    min={0}
                    max={10}
                    className="border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-neutral-700 font-inter">Máximo</Label>
                  <Input
                    type="number"
                    value={localQuestion.linearScaleConfig?.max || 5}
                    onChange={(e) => {
                      const max = parseInt(e.target.value) || 5;
                      const min = localQuestion.linearScaleConfig?.min || 1;
                      setLocalQuestion({
                        ...localQuestion,
                        linearScaleConfig: {
                          ...localQuestion.linearScaleConfig,
                          min: min,
                          max: Math.max(max, min + 1)
                        }
                      });
                    }}
                    min={2}
                    max={10}
                    className="border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-neutral-700 font-inter">Etiqueta mínima</Label>
                  <Input
                    value={localQuestion.linearScaleConfig?.minLabel || ''}
                    onChange={(e) => setLocalQuestion({
                      ...localQuestion,
                      linearScaleConfig: {
                        min: localQuestion.linearScaleConfig?.min || 1,
                        max: localQuestion.linearScaleConfig?.max || 5,
                        minLabel: e.target.value,
                        maxLabel: localQuestion.linearScaleConfig?.maxLabel || ''
                      }
                    })}
                    placeholder="Ej: Muy malo"
                    className="border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-neutral-700 font-inter">Etiqueta máxima</Label>
                  <Input
                    value={localQuestion.linearScaleConfig?.maxLabel || ''}
                    onChange={(e) => setLocalQuestion({
                      ...localQuestion,
                      linearScaleConfig: {
                        min: localQuestion.linearScaleConfig?.min || 1,
                        max: localQuestion.linearScaleConfig?.max || 5,
                        minLabel: localQuestion.linearScaleConfig?.minLabel || '',
                        maxLabel: e.target.value
                      }
                    })}
                    placeholder="Ej: Excelente"
                    className="border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-forms-500 hover:bg-forms-600 text-white font-medium font-poppins"
            >
              Guardar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-inter"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );

  };

  const handleCreateNewForm = () => {
    setShowSuccessView(false);
    setCreatedFormData(null);
    setFormTitle('');
    setFormDescription('');
    setQuestions([]);
    setCollectEmail(true);
    setError(null);
  };

  const handleDuplicateForm = () => {
    if (createdFormData) {
      setFormTitle(`${createdFormData.title} - Copia`);
      setFormDescription(createdFormData.description);
      setQuestions(createdFormData.questions.map((q: any) => ({
        ...q,
        id: Date.now().toString() + Math.random()
      })));
      setCollectEmail(createdFormData.collectEmail);
      setShowSuccessView(false);
      setCreatedFormData(null);
      setError(null);
    }
  };

  if (showSuccessView && createdFormData) {
    return (
      <FormSuccessView
        formData={{
          title: createdFormData.title,
          description: createdFormData.description,
          questions: createdFormData.questions,
          formUrl: createdFormData.formUrl,
          editUrl: createdFormData.editUrl,
          createdAt: createdFormData.createdAt
        }}
        onCreateNewForm={handleCreateNewForm}
        onDuplicateForm={handleDuplicateForm}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
        <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-4 border border-neutral-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forms-500"></div>
          <p className="text-lg font-medium text-neutral-800 font-poppins">Creando formulario...</p>
          <p className="text-sm text-neutral-600 font-inter">Por favor espera, esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto min-w-0">
      <div className="space-y-6">
        <Card className="border-neutral-200/60 shadow-sm w-full">
          <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
            <CardTitle className="text-lg text-forms-600 flex items-center gap-2 font-poppins">
              <ClipboardList className="h-5 w-5 text-forms-500" />
              Información del formulario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="form-title" className="text-sm font-semibold text-neutral-700 font-inter">
                Título del formulario *
              </Label>
              <Input
                id="form-title"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  onTitleChange?.(e.target.value);
                }}
                placeholder="Ej: Encuesta de satisfacción del cliente"
                className="mt-1 border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
              />
              <p className="text-xs text-neutral-500 mt-1 font-inter">Este será el título visible en Google Forms</p>
            </div>
            <div>
              <Label htmlFor="form-description" className="text-sm font-semibold text-neutral-700 font-inter">
                Descripción (opcional)
              </Label>
              <Input
                id="form-description"
                value={formDescription}
                onChange={(e) => {
                  setFormDescription(e.target.value);
                  onDescriptionChange?.(e.target.value);
                }}
                placeholder="Describe brevemente el propósito de este formulario"
                className="mt-1 border-neutral-200 focus:ring-forms-200 focus:border-forms-400 font-inter"
              />
              <p className="text-xs text-neutral-500 mt-1 font-inter">Ayuda a los usuarios a entender el objetivo del formulario</p>
            </div>
            <div className="flex items-start sm:items-center space-x-2">
              <input
                id="collect-email"
                type="checkbox"
                checked={collectEmail}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setCollectEmail(newValue);
                  onCollectEmailChange?.(newValue);
                }}
                className="h-4 w-4 text-forms-500 rounded border-neutral-300 focus:ring-forms-200"
              />
              <Label htmlFor="collect-email" className="text-sm font-medium text-neutral-700 cursor-pointer font-inter">
                Recopilar emails de quienes respondan el formulario
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 w-full">
          <CardHeader className="bg-slate-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-slate-600" />
                  Preguntas
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {questions.length === 0
                    ? "Comienza agregando tu primera pregunta"
                    : `${questions.length} pregunta${questions.length !== 1 ? 's' : ''} agregada${questions.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {googleError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{googleError}</AlertDescription>
              </Alert>
            )}

            {questions.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
                <p className="text-base font-medium font-inter mb-2">No hay preguntas aún</p>
                <p className="text-sm font-inter mb-6">Comienza agregando tu primera pregunta</p>
                <Button
                  onClick={addQuestion}
                  className="bg-forms-500 hover:bg-forms-600 text-white font-medium"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar primera pregunta
                </Button>
              </div>
            ) : (
              <>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="questions">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-4"
                      >
                        {questions.map((question, index) => (
                          <Draggable key={question.id} draggableId={String(question.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`min-w-0 transition-shadow duration-200 ${snapshot.isDragging ? 'rounded-xl bg-white shadow-lg ring-2 ring-forms-200' : ''}`}
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                                  <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-center sm:justify-start sm:gap-3 sm:w-16 sm:flex-shrink-0">
                                    <button
                                      type="button"
                                      {...provided.dragHandleProps}
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-forms-300"
                                      aria-label={`Arrastrar para reordenar la pregunta ${index + 1}`}
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm font-medium text-neutral-600 font-inter sm:text-xs sm:text-neutral-500">
                                      <span className="sm:hidden">Pregunta </span>
                                      {index + 1}
                                    </span>
                                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                                      <button
                                        onClick={() => moveQuestion(index, 'up')}
                                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        disabled={index === 0}
                                        aria-label="Mover pregunta hacia arriba"
                                      >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => moveQuestion(index, 'down')}
                                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        disabled={index === questions.length - 1}
                                        aria-label="Mover pregunta hacia abajo"
                                      >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <QuestionEditor
                                      question={question}
                                      onUpdate={updateQuestion}
                                      onDelete={deleteQuestion}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* Botón adicional para agregar pregunta al final (mejor UX en móvil) */}
                <div className="pt-4 border-t border-neutral-100">
                  <Button
                    onClick={addQuestion}
                    className="bg-forms-500 hover:bg-forms-700 text-white w-full font-medium"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar otra pregunta
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        {!hideSubmitButton && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <DraftModal 
                onLoadDraft={handleLoadDraft}
                trigger={
                  <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 w-full sm:w-auto justify-center font-inter">
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Ver Borradores</span>
                  </Button>
                }
              />
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 w-full sm:w-auto font-inter"
                >
                  Cancelar
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || !formTitle.trim()}
                className="border-forms-400 text-forms-600 hover:bg-forms-50 focus:bg-forms-50 w-full sm:w-auto justify-center font-medium font-poppins transition-all duration-200"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
                    <span className="truncate">Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Guardar Borrador</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isCreating || questions.length === 0 || !formTitle.trim()}
                className="bg-excel-500 hover:bg-excel-600 focus:bg-excel-600 text-white w-full sm:w-auto justify-center font-medium font-poppins shadow-sm transition-all duration-200"
              >
                <span className="truncate">{isCreating ? 'Creando...' : submitButtonText}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

});

const extractOptionsFromDescription = (description: string): any[] | null => {
    if (!description) return null;
    
    // Buscar opciones separadas por | o ,
    let options: string[] = [];
    
    if (description.includes('|')) {
      options = description.split('|').map(opt => opt.trim()).filter(opt => opt);
    } else if (description.includes(',')) {
      options = description.split(',').map(opt => opt.trim()).filter(opt => opt);
    }
    
    if (options.length > 1) {
      return options.map((opt, index) => ({
        id: `opt_${Date.now()}_${index + 1}`,
        text: opt
      }));
    }
    
    return null;
  };
