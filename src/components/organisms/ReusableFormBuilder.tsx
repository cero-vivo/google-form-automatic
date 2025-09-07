'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, LayoutGrid, Type, List, CheckSquare, Calendar, Mail, Hash, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { FormSuccessView } from './FormSuccessView';

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
  hideSubmitButton = false
}: ReusableFormBuilderProps, ref) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [formDescription, setFormDescription] = useState(initialDescription);
  const [collectEmail, setCollectEmail] = useState(initialCollectEmail);
  const [createdFormData, setCreatedFormData] = useState<any>(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update questions when initialQuestions changes with better type mapping
  React.useEffect(() => {
    const mappedQuestions = initialQuestions.map(q => {
      // Ensure correct type mapping from string to enum
      let mappedType: QuestionType;
      switch (q.type?.toLowerCase()) {
        case 'multiple_choice':
        case 'opcion_multiple':
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
        title: q.title || q.label || 'Nueva pregunta',
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
    setQuestions(newQuestions);
    onQuestionsChange?.(newQuestions);
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
          creationMethod: mode,
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
          className="p-4 border rounded-lg bg-white cursor-pointer hover:border-blue-300 transition-colors"
          onClick={() => setIsEditing(true)}
          tabIndex={0}
          onFocus={handleFocus}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{question.title}</h4>
              {question.description && (
                <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {questionTypes.find(t => t.value === question.type)?.label || question.type}
                </Badge>
                {question.required && <Badge variant="secondary" className="text-xs">Requerido</Badge>}
                {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
                  <Badge variant="outline" className="text-xs bg-blue-50">
                    {question.options?.length || 0} opción{question.options?.length !== 1 ? 'es' : ''}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
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
                className="text-red-600 hover:text-red-700"
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
        className="p-4 border rounded-lg bg-white border-blue-300"
        onBlur={(e) => {
          // Solo guardar si el clic fue fuera del contenedor
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setTimeout(() => {
              handleSave();
            }, 100);
          }
        }}
      >
        <div className="space-y-4">
          <div>
            <Label>Pregunta *</Label>
            <Input
              value={localQuestion.title}
              onChange={(e) => setLocalQuestion({ ...localQuestion, title: e.target.value })}
              placeholder="Escribe tu pregunta aquí"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              autoFocus
            />
          </div>

          <div>
            <Label>Descripción (opcional)</Label>
            <Input
              value={localQuestion.description || ''}
              onChange={(e) => setLocalQuestion({ ...localQuestion, description: e.target.value })}
              placeholder="Proporciona más contexto para esta pregunta"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de pregunta</Label>
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
                className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`required-${question.id}`}
                checked={localQuestion.required}
                onChange={(e) => setLocalQuestion({ ...localQuestion, required: e.target.checked })}
                className="mr-2"
              />
              <Label htmlFor={`required-${question.id}`} className="mb-0">
                Requerido
              </Label>
            </div>
          </div>

          {['multiple_choice', 'checkboxes', 'dropdown'].includes(localQuestion.type) && (
            <div>
              <Label>Opciones</Label>
              <div className="space-y-2">
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
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newOptions = (localQuestion.options || []).filter((_, i) => i !== index);
                        setLocalQuestion({ ...localQuestion, options: newOptions });
                      }}
                      className="text-red-600 hover:text-red-700"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mínimo</Label>
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
                  />
                </div>
                <div>
                  <Label>Máximo</Label>
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
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Etiqueta mínima</Label>
                  <Input
                    value={localQuestion.linearScaleConfig?.minLabel || ''}
                    onChange={(e) => setLocalQuestion({
                      ...localQuestion,
                      linearScaleConfig: {
                        ...localQuestion.linearScaleConfig,
                        minLabel: e.target.value
                      }
                    })}
                    placeholder="Ej: Muy malo"
                  />
                </div>
                <div>
                  <Label>Etiqueta máxima</Label>
                  <Input
                    value={localQuestion.linearScaleConfig?.maxLabel || ''}
                    onChange={(e) => setLocalQuestion({
                      ...localQuestion,
                      linearScaleConfig: {
                        ...localQuestion.linearScaleConfig,
                        maxLabel: e.target.value
                      }
                    })}
                    placeholder="Ej: Excelente"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave}>Guardar</Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>Cancelar</Button>
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg font-medium text-slate-700">Creando formulario...</p>
          <p className="text-sm text-slate-500">Por favor espera, esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg text-slate-800">📋 Información del formulario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="form-title" className="text-sm font-semibold text-slate-700">
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
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Este será el título visible en Google Forms</p>
            </div>
            <div>
              <Label htmlFor="form-description" className="text-sm font-semibold text-slate-700">
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
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Ayuda a los usuarios a entender el objetivo del formulario</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="collect-email"
                type="checkbox"
                checked={collectEmail}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setCollectEmail(newValue);
                  onCollectEmailChange?.(newValue);
                }}
                className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <Label htmlFor="collect-email" className="text-sm font-medium text-slate-700 cursor-pointer">
                Recopilar emails de quienes respondan el formulario
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-800">❓ Preguntas</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {questions.length === 0
                    ? "Comienza agregando tu primera pregunta"
                    : `${questions.length} pregunta${questions.length !== 1 ? 's' : ''} agregada${questions.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <Button
                onClick={addQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar pregunta
              </Button>
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
              <div className="text-center py-8 text-slate-500">
                <LayoutGrid className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm">No hay preguntas aún</p>
                <p className="text-xs mt-1">Haz clic en "Agregar pregunta" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="relative">
                    <div className="absolute -left-6 top-4 flex flex-col space-y-1">
                      <button
                        onClick={() => moveQuestion(index, 'up')}
                        className="p-1 hover:bg-slate-100 rounded"
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-slate-500 text-center font-medium">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => moveQuestion(index, 'down')}
                        className="p-1 hover:bg-slate-100 rounded"
                        disabled={index === questions.length - 1}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <QuestionEditor
                      key={question.id}
                      question={question}
                      onUpdate={updateQuestion}
                      onDelete={deleteQuestion}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {!hideSubmitButton && (
          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-slate-300 text-slate-700"
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isCreating || questions.length === 0 || !formTitle.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isCreating ? 'Creando...' : submitButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

});

const extractOptionsFromDescription = (description: string): Option[] | null => {
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