'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFormPreview?: boolean;
  formData?: {
    title: string;
    description: string;
    questions: any[];
  };
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();
  const { credits: userCredits, loading: creditsLoading } = useCredits();
  const credits = typeof userCredits === 'number' ? userCredits : 0;
  const router = useRouter();

  useEffect(() => {
    if (!creditsLoading) {
      setCurrentCredits(credits);
    }
  }, [credits, creditsLoading]);

  useEffect(() => {
    // Add welcome message
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
    
    if (currentCredits < 2) {
      setError('No tienes suficientes créditos para crear un formulario. Por favor, adquiere más créditos.');
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
        const assistantMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: `¡Perfecto! He creado un formulario basado en tu solicitud. Aquí tienes una vista previa:`,
          timestamp: new Date(),
          isFormPreview: true,
          formData: data.form
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentCredits(prev => prev - 2);
      } else {
        setError(data.error || 'Error al generar el formulario');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForm = async (formData: any) => {
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
          questions: formData.questions,
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
              Créditos: {currentCredits}
            </div>
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
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat con IA</CardTitle>
              <CardDescription>
                Describe el formulario que necesitas y la IA lo creará automáticamente
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 pr-4 overflow-y-auto" ref={scrollAreaRef}>
                <div className="space-y-4">
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
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        
                        <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : ''}`}>
                          <div className={`rounded-lg px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
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
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
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
              <div className="mt-4 flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe el formulario que necesitas..."
                  disabled={isLoading || isCreatingForm}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || isCreatingForm || currentCredits < 2}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Examples */}
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
                  disabled={currentCredits < 2}
                  className="text-left justify-start h-auto py-2 px-3 text-sm"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}