'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Settings, LayoutGrid, Type, List, CheckSquare, Calendar, Mail, Hash, Globe } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { useCredits } from '@/containers/useCredits';

interface ManualFormBuilderProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
}

const questionTypes = [
  { value: 'short_text' as QuestionType, label: 'Texto corto', icon: Type },
  { value: 'long_text' as QuestionType, label: 'Texto largo', icon: Type },
  { value: 'multiple_choice' as QuestionType, label: 'Opción múltiple', icon: List },
  { value: 'checkboxes' as QuestionType, label: 'Casillas', icon: CheckSquare },
  { value: 'dropdown' as QuestionType, label: 'Lista desplegable', icon: List },
  { value: 'number' as QuestionType, label: 'Número', icon: Hash },
  { value: 'email' as QuestionType, label: 'Email', icon: Mail },
  { value: 'date' as QuestionType, label: 'Fecha', icon: Calendar },
  { value: 'url' as QuestionType, label: 'URL', icon: Globe }
];

export function ManualFormBuilder({ onFormCreated, currentCredits = 0 }: ManualFormBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { consumeCredits } = useCredits();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: QuestionType.SHORT_TEXT,
      title: 'Nueva pregunta',
      description: '',
      required: false,
      options: []
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
      await consumeCredits({
        type: 'form_creation',
        amount: 1,
        description: `Creación de formulario: ${formTitle}`,
        metadata: {
          formTitle,
          questionsCount: questions.length
        }
      });
      
      onFormCreated?.({
        title: formTitle,
        description: formDescription,
        questions: questions,
        creationMethod: 'manual'
      });
    } catch (error) {
      setError('Error al crear el formulario');
    }
  };

  const QuestionEditor = ({ question }: { question: Question }) => (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="grid gap-4">
        <div>
          <Label>Pregunta</Label>
          <Input
            value={question.title}
            onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
            placeholder="Escribe tu pregunta aquí"
          />
        </div>

        <div>
          <Label>Descripción (opcional)</Label>
          <Input
            value={question.description}
            onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
            placeholder="Agrega una descripción o instrucciones"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tipo de pregunta</Label>
            <select
              value={question.type}
              onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType, options: [] })}
              className="w-full border rounded-md px-3 py-2"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                className="rounded"
              />
              <Label>Obligatoria</Label>
            </div>
          </div>
        </div>

        {['multiple_choice', 'checkboxes', 'dropdown'].includes(question.type) && (
          <div>
            <Label>Opciones</Label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    placeholder={`Opción ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = question.options?.filter((_, i) => i !== index) || [];
                      updateQuestion(question.id, { options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(question.options || []), ''];
                  updateQuestion(question.id, { options: newOptions });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar opción
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Constructor manual</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Crea tu formulario desde cero con nuestra interfaz visual
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuración del formulario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título del formulario *</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ej: Encuesta de satisfacción del cliente"
              />
            </div>
            <div>
              <Label>Descripción (opcional)</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe el propósito de este formulario"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Preguntas ({questions.length})</CardTitle>
            <Button onClick={addQuestion} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Agregar pregunta
            </Button>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LayoutGrid className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay preguntas aún. Agrega tu primera pregunta para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-3 bg-muted/50">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Pregunta {index + 1}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(
                            editingQuestion === question.id ? null : question.id
                          )}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <p className="font-medium">{question.title}</p>
                      {question.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{question.type}</Badge>
                        {question.required && <Badge variant="secondary">Obligatoria</Badge>}
                      </div>
                    </div>

                    {editingQuestion === question.id && (
                      <QuestionEditor question={question} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCreateForm}
          disabled={questions.length === 0 || !formTitle.trim() || currentCredits < 1}
          className="w-full"
        >
          Crear formulario en Google Forms (1 crédito)
        </Button>
      </div>
    </div>
  );
}