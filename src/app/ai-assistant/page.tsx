'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EditableFormPreview } from '@/components/organisms/EditableFormPreview';

import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/containers/useAuth';
import { useCredits } from '@/containers/useCredits';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableQuestion {
  id: string;
  type: string;
  label: string;
  options?: string[];
  range?: [number, number];
  required?: boolean;
  description?: string;
}

interface EditableFormData {
  title: string;
  description: string;
  questions: EditableQuestion[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFormPreview?: boolean;
  formData?: EditableFormData;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [editableForm, setEditableForm] = useState<EditableFormData | null>(null);
  const [showFormEditor, setShowFormEditor] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();
  const { currentCredits: credits, loading: creditsLoading, refreshCredits } = useCredits();
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 AI Assistant - Credits Debug:', {
      user: user?.id,
      isAuthenticated: !!user,
      creditsLoading,
      actualCredits: credits
    });
  }, [credits, creditsLoading]);

  useEffect(() => {
    // Add welcome messageitos disponibles
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de creación de formularios. Puedo ayudarte a crear formularios de Google Forms usando inteligencia artificial.\n\nPor ejemplo, puedes decir:\n• "Crea un formulario de encuesta de satisfacción para restaurantes"\n• "Necesito un formulario de registro para un evento corporativo"\n• "Hazme un cuestionario de evaluación de desempeño"\n\nCada formulario creado cuesta 2 créditos.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    console.log('=== VALIDATION DEBUG ===');
    console.log('Current credits value:', credits);
    console.log('Credits type:', typeof credits);
    console.log('Credits < 2?', credits < 2);
    
    // Clear any previous error
    setError(null);
    
    if (credits < 2) {
      setError(`No tienes suficientes créditos para crear un formulario. Necesitas al menos 2 créditos. Tienes: ${credits}`);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-chat/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userId: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        const editableQuestions = data.form.questions.map((q: any, index: number) => ({
          id: `q${index}`,
          type: q.type || 'texto_corto',
          label: q.label || q.title || 'Pregunta',
          options: q.options || (q.multipleChoiceConfig?.options),
          range: q.range,
          required: q.required || false,
          description: q.description || ''
        }));

        const editableFormData: EditableFormData = {
          title: data.form.title,
          description: data.form.description || '',
          questions: editableQuestions
        };

        setEditableForm(editableFormData);
        setShowFormEditor(true);
        
        const assistantMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: `¡Perfecto! He creado un formulario basado en tu solicitud. Ahora puedes revisar y editar las preguntas antes de crear el formulario en Google Forms.`,
          timestamp: new Date(),
          isFormPreview: true,
          formData: editableFormData
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(data.error || 'Error al generar el formulario');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForm = async (formData: EditableFormData) => {
    setIsCreatingForm(true);
    setError(null);

    try {
      const response = await fetch('/api/google-forms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          questions: formData.questions.map(q => ({
            title: q.label,
            type: q.type,
            options: q.options,
            range: q.range,
            required: q.required
          })),
          userId: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        const successMessage: Message = {
          id: Date.now().toString() + '-success',
          role: 'assistant',
          content: `¡Formulario creado exitosamente!\n\n🔗 **Enlace para responder:** ${data.formUrl}\n🔗 **Enlace para editar:** ${data.editUrl}\n\nEl formulario ha sido creado en tu cuenta de Google Forms.`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, successMessage]);
        setShowFormEditor(false);
        setEditableForm(null);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(data.error || 'Error al crear el formulario');
      }
    } catch (err) {
      setError('Error al crear el formulario en Google Forms');
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-bold">Asistente de Formularios</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border">
              <Sparkles className="h-3 w-3 mr-1" />
              {creditsLoading ? 'Cargando...' : `Créditos: ${credits}`}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshCredits}
              disabled={creditsLoading}
              className="text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Actualizar
            </Button>
            {credits === 0 && !creditsLoading && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Si tienes créditos, espera un momento o actualiza la página
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Chat Interface */}
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat con IA</CardTitle>
              <CardDescription>
                Describe el formulario que necesitas y la IA lo creará automáticamente
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-2" ref={scrollAreaRef}>
                <div className="space-y-4 pb-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        
                        <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : ''}`}>
                          <div className={`rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            
                            {message.isFormPreview && message.formData && (
                              <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border">
                                <h4 className="font-semibold mb-2">{message.formData.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {message.formData.description}
                                </p>
                                <p className="text-sm mb-3">
                                  <strong>Preguntas:</strong> {message.formData.questions.length}
                                </p>
                                
                                <Button
                                  size="sm"
                                  onClick={() => handleCreateForm(message.formData!)}
                                  disabled={isCreatingForm}
                                  className="w-full"
                                >
                                  {isCreatingForm ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Creando...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Crear en Google Forms
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Input Area */}
              <div className="flex gap-2 border-t pt-4">
                <Input
                  value={inputValue}
                  onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null); // Clear error when user starts typing
                }}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe el formulario que necesitas..."
                  disabled={isLoading || isCreatingForm}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || isCreatingForm || credits < 2}
                  className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Editor */}
          {showFormEditor && editableForm && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Editar Formulario</CardTitle>
                  <CardDescription>
                    Revisa y edita las preguntas antes de crear el formulario en Google Forms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EditableFormPreview
                    form={editableForm}
                    onFormChange={setEditableForm}
                    onCreateForm={handleCreateForm}
                    isCreating={isCreatingForm}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Examples */}
          {!showFormEditor && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Ejemplos rápidos:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Encuesta de satisfacción para restaurante",
                  "Formulario de registro para evento corporativo",
                  "Cuestionario de evaluación de desempeño",
                  "Formulario de feedback de producto"
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(example)}
                    disabled={credits < 2}
                    className="text-left justify-start h-auto py-2 px-3 text-sm"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}