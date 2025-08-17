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
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';


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
    return (
      <div className="space-y-8 max-w-5xl mx-auto px-4">
        {/* Hero Success Section */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-excel/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-excel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-forms">
              ¡Formulario creado con éxito!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tu formulario <span className="font-semibold text-forms">"{createdFormData.title}"</span> está listo en Google Forms
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4">
            <div className="bg-excel/10 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-excel">{createdFormData.questions.length}</div>
              <div className="text-sm text-muted-foreground">Preguntas</div>
            </div>
            <div className="bg-forms/10 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-forms">✓</div>
              <div className="text-sm text-muted-foreground">Google Forms</div>
            </div>
            <div className="bg-velocity/10 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-velocity">∞</div>
              <div className="text-sm text-muted-foreground">Respuestas</div>
            </div>
          </div>
        </div>

        {/* Form Preview Card */}
        <Card className="border-border">
          <div className="bg-excel/5 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-forms/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-forms" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-forms">{createdFormData.title}</h3>
                {createdFormData.description && (
                  <p className="text-muted-foreground text-sm mt-1">{createdFormData.description}</p>
                )}
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            {/* Questions Preview */}
            <div className="space-y-4">
              <h4 className="font-medium text-forms flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Vista previa de preguntas
              </h4>
              <div className="grid gap-3">
                {createdFormData.questions.slice(0, 4).map((q: any, index: number) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg border-l-4 border-l-excel">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-foreground flex-1">{q.title}</span>
                      <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">{q.type}</span>
                    </div>
                  </div>
                ))}
                {createdFormData.questions.length > 4 && (
                  <div className="text-center py-3">
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      +{createdFormData.questions.length - 4} preguntas más
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
              {/* Share Link */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-excel/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-excel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-forms">Compartir formulario</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={createdFormData.formUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-excel/50"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(createdFormData.formUrl);
                      alert('¡Enlace copiado al portapapeles!');
                    }}
                    className="bg-excel hover:bg-excel/90 text-white shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
                <a
                  href={createdFormData.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-excel text-white rounded-lg hover:bg-excel/90 transition-colors text-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver formulario
                </a>
              </div>

              {/* Edit Link */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-forms/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-forms" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-forms">Editar formulario</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={createdFormData.editUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forms/50"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(createdFormData.editUrl);
                      alert('¡Enlace copiado al portapapeles!');
                    }}
                    className="bg-forms hover:bg-forms/90 text-white shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
                <a
                  href={createdFormData.editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-forms text-white rounded-lg hover:bg-forms/90 transition-colors text-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar en Google
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={handleCreateNewForm}
            className="w-full bg-excel hover:bg-excel/90 text-white h-14 rounded-xl text-lg font-medium transition-colors"
            size="lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Crear nuevo formulario</span>
            </div>
          </Button>
          
          <Button
            onClick={handleDuplicateForm}
            className="w-full bg-forms hover:bg-forms/90 text-white h-14 rounded-xl text-lg font-medium transition-colors"
            size="lg"
            variant="outline"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Crear copia del formulario</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }

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

        {(error || googleError) && (
          <Alert variant="destructive" className="border-red-200">
            <AlertDescription className="text-red-800 font-medium">{error || googleError}</AlertDescription>
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
            disabled={questions.length === 0 || !formTitle.trim() || currentCredits < 1 || isCreating}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            size="lg"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creando formulario...
              </>
            ) : (
              questions.length === 0 ? 'Agrega preguntas primero' : 
              !formTitle.trim() ? 'Agrega un título al formulario' :
              currentCredits < 1 ? 'No tienes créditos suficientes' :
              `Crear formulario en Google Forms`
            )}
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