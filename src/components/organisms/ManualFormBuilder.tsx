'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Settings, LayoutGrid, Type, List, CheckSquare, Calendar, Mail, Hash, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { QuestionType } from '@/domain/types';
import { useCredits } from '@/containers/useCredits';

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

  const { consumeCredits } = useCredits();

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
        amount: 1,
        formTitle: formTitle
      });
      
      onFormCreated?.({
        title: formTitle,
        description: formDescription,
        questions: questions,
        collectEmail: collectEmail,
        creationMethod: 'manual'
      });
    } catch (error) {
      setError('Error al crear el formulario');
    }
  };



  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold mb-2 text-slate-800">Constructor Manual</h3>
        <p className="text-slate-600">
          Crea tu formulario paso a paso con nuestra interfaz intuitiva
        </p>
      </div>

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
                onChange={(e) => setFormTitle(e.target.value)}
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
                onChange={(e) => setFormDescription(e.target.value)}
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
                onChange={(e) => setCollectEmail(e.target.checked)}
                className="rounded border-slate-300"
              />
              <Label htmlFor="collect-email" className="text-sm text-slate-700 cursor-pointer">
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
                size="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva pregunta
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                <LayoutGrid className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h4 className="text-lg font-semibold text-slate-700 mb-2">Aún no hay preguntas</h4>
                <p className="text-slate-600 mb-4 max-w-sm mx-auto">
                  Haz clic en "Nueva pregunta" para comenzar a construir tu formulario
                </p>
                <Button 
                  onClick={addQuestion} 
                  size="sm"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primera pregunta
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between p-4 bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {question.title || 'Sin título'}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {questionTypes.find(t => t.value === question.type)?.label || question.type}
                            </Badge>
                            {question.required && (
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                Obligatoria
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="text-slate-500 hover:text-slate-700"
                          title="Mover arriba"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                          className="text-slate-500 hover:text-slate-700"
                          title="Mover abajo"
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(
                            editingQuestion === question.id ? null : question.id
                          )}
                          className={`${editingQuestion === question.id ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                          title={editingQuestion === question.id ? 'Cerrar editor' : 'Editar pregunta'}
                        >
                          {editingQuestion === question.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar pregunta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {question.description && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                          {question.description}
                        </p>
                      </div>
                    )}

                    {editingQuestion === question.id && (
                      <QuestionEditor question={question} onUpdate={updateQuestion} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="border-red-200">
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-slate-800">Resumen del formulario</h4>
              <p className="text-sm text-slate-600">
                {questions.length} pregunta{questions.length !== 1 ? 's' : ''} • {currentCredits} crédito{currentCredits !== 1 ? 's' : ''} disponible{currentCredits !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Costo: 1 crédito</p>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateForm}
            disabled={questions.length === 0 || !formTitle.trim() || currentCredits < 1}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            size="lg"
          >
            {questions.length === 0 ? 'Agrega preguntas primero' : 
             !formTitle.trim() ? 'Agrega un título al formulario' :
             currentCredits < 1 ? 'No tienes créditos suficientes' :
             `Crear formulario en Google Forms`}
          </Button>
        </div>
      </div>
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