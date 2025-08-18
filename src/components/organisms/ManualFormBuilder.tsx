'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Settings, LayoutGrid, Type, List, CheckSquare, Calendar, Mail, Hash, Globe, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { useCredits } from '@/containers/useCredits';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { ReusableFormBuilder } from './ReusableFormBuilder';


interface ManualFormBuilderProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
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

export function ManualFormBuilder({ onFormCreated, currentCredits = 0 }: ManualFormBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [collectEmail, setCollectEmail] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [createdFormData, setCreatedFormData] = useState<any>(null);

  const { consumeCredits } = useCredits();
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
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (editingQuestion === id) {
      setEditingQuestion(null);
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
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
        
        setCreatedFormData(formData);
        setShowSuccessView(true);
        
        onFormCreated?.(formData);
      }
    } catch (error) {
      setError('Error al crear el formulario');
    }
  };



  if (showSuccessView && createdFormData) {
    const { FormSuccessView } = require('./FormSuccessView');
    
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
      />
    </div>
  );
}

interface QuestionEditorProps {
  question: Question;
  onUpdate: (id: string, updates: Partial<Question>) => void;
}

const QuestionEditor = ({ question, onUpdate }: QuestionEditorProps) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(question.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(question.id, { description: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(question.id, { type: e.target.value as QuestionType, options: [] });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(question.id, { required: e.target.checked });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate(question.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index) || [];
    onUpdate(question.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate(question.id, { options: newOptions });
  };

  const questionTypes = [
    { value: 'short_text' as QuestionType, label: 'Texto corto', description: 'Respuesta breve de una línea' },
    { value: 'long_text' as QuestionType, label: 'Texto largo', description: 'Respuesta extensa de varias líneas' },
    { value: 'multiple_choice' as QuestionType, label: 'Opción múltiple', description: 'Seleccionar una opción de varias' },
    { value: 'checkboxes' as QuestionType, label: 'Casillas', description: 'Seleccionar varias opciones' },
    { value: 'dropdown' as QuestionType, label: 'Lista desplegable', description: 'Seleccionar de un menú desplegable' },
    { value: 'number' as QuestionType, label: 'Número', description: 'Solo acepta números' },
    { value: 'email' as QuestionType, label: 'Email', description: 'Valida formato de correo electrónico' },
    { value: 'date' as QuestionType, label: 'Fecha', description: 'Selector de fecha calendario' },
    { value: 'url' as QuestionType, label: 'URL', description: 'Valida formato de sitio web' }
  ];

  return (
    <div className="space-y-4 p-4 border-t bg-slate-50">
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`question-title-${question.id}`} className="text-sm font-semibold text-slate-700">
            Pregunta *
          </Label>
          <Input
            id={`question-title-${question.id}`}
            value={question.title}
            onChange={handleTitleChange}
            placeholder="Ej: ¿Cuál es tu nombre completo?"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={`question-desc-${question.id}`} className="text-sm font-semibold text-slate-700">
            Descripción (opcional)
          </Label>
          <Input
            id={`question-desc-${question.id}`}
            value={question.description}
            onChange={handleDescriptionChange}
            placeholder="Proporciona contexto o instrucciones adicionales"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`question-type-${question.id}`} className="text-sm font-semibold text-slate-700">
              Tipo de respuesta
            </Label>
            <select
              id={`question-type-${question.id}`}
              value={question.type}
              onChange={handleTypeChange}
              className="w-full border rounded-md px-3 py-2 mt-1 bg-white"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              {questionTypes.find(t => t.value === question.type)?.description}
            </p>
          </div>

          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <input
                id={`required-${question.id}`}
                type="checkbox"
                checked={question.required}
                onChange={handleRequiredChange}
                className="rounded border-slate-300"
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm text-slate-700">
                Respuesta obligatoria
              </Label>
            </div>
          </div>
        </div>

        {['multiple_choice', 'checkboxes', 'dropdown'].includes(question.type) && (
          <div>
            <Label className="text-sm font-semibold text-slate-700">Opciones de respuesta</Label>
            <div className="space-y-2 mt-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Opción ${index + 1} (ej: Sí)`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full border-dashed border-slate-300 text-slate-600 hover:text-slate-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar nueva opción
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}