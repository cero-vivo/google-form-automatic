'use client';

import { useState, useEffect, useRef } from 'react';
import { FormPreview } from '@/components/molecules/FormPreview';
import { CreditDisplay } from '@/components/molecules/CreditDisplay';
import { Send, Bot, User, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/containers/useAuth';
import { useCredits } from '@/containers/useCredits';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FormPreviewData {
  title: string;
  questions: Array<{
    type: string;
    label: string;
    options?: string[];
    range?: [number, number];
  }>;
}

export function AIChatFormCreator({ onFormCreated }: { onFormCreated?: (formData: FormPreviewData) => void }) {
  const { user } = useAuth();
  const { credits: userCredits, refreshCredits } = useCredits();
  const credits = typeof userCredits === 'number' ? userCredits : 0;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formPreview, setFormPreview] = useState<FormPreviewData | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversation = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/ai-chat/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userId: user.id,
          conversation
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar el mensaje');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `He creado un formulario llamado "${data.form.title}" con ${data.form.questions.length} preguntas. ¿Deseas publicarlo?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setFormPreview(data.form);
      setCreditsUsed(2); // API consumes 2 credits per form generation
      setTotalMessages(messages.length + 1);

      refreshCredits();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishForm = async () => {
    if (!formPreview || !user) return;

    setShowPublishDialog(true);
    setPublishStatus('publishing');

    try {
      // Use the existing form creation flow through the dashboard
      // This will trigger the onFormCreated callback with the form data
      setPublishStatus('success');
      
      if (onFormCreated && formPreview) {
        onFormCreated(formPreview);
      }
      
      refreshCredits();
    } catch (error) {
      console.error('Error al publicar formulario:', error);
      setPublishStatus('error');
    }
  };

  const getCreditWarning = () => {
    const messagesUntilNextCredit = 5 - (totalMessages % 5);
    const remainingCredits = credits - Math.floor(totalMessages / 5);
    
    if (remainingCredits <= 2) {
      return `⚠️ Te quedan ${remainingCredits} créditos disponibles`;
    }
    return `📊 Próximo descuento en ${messagesUntilNextCredit} mensajes`;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Crear formulario con IA</h1>
          <p className="text-gray-600 mb-4">
            Describe el formulario que necesitas y la IA lo creará automáticamente.
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Créditos disponibles:</span>
              <span className="ml-2 font-bold">{credits || 0}</span>
            </div>
            {credits !== null && credits < 10 && (
              <div className="ml-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Estás quedando con pocos créditos. Considera recargar.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col border rounded-lg bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chat de creación</h2>
          </div>
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 mb-4 overflow-y-auto">
              <div className="space-y-4 min-h-full">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs border px-2 py-1 rounded">
                {getCreditWarning()}
              </span>
              <span className="text-xs border px-2 py-1 rounded">
                Mensajes: {totalMessages} | Créditos usados: {creditsUsed}
              </span>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Describe el formulario que quieres crear..."
                disabled={isLoading || credits <= 0}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim() || credits <= 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {formPreview && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Vista previa del formulario</h2>
            <FormPreview form={formPreview} />
            <button
              onClick={handlePublishForm}
              disabled={!user || credits < 2}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Publicar formulario (2 créditos)
            </button>
          </div>
        )}

        {showPublishDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-2">
                {publishStatus === 'success' ? '¡Formulario creado!' : 'Publicando formulario'}
              </h3>
              <p className="text-gray-600 mb-4">
                {publishStatus === 'publishing' && 'Creando tu formulario en Google Forms...'}
                {publishStatus === 'success' && 'Tu formulario ha sido creado exitosamente.'}
                {publishStatus === 'error' && 'Hubo un error al crear el formulario. Por favor, intenta de nuevo.'}
              </p>
              
              {publishStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>Formulario publicado con éxito</span>
                </div>
              )}

              {publishStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <span>No se pudo publicar el formulario. Verifica tu conexión y vuelve a intentarlo.</span>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowPublishDialog(false);
                    if (publishStatus === 'success') {
                      setFormPreview(null);
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  {publishStatus === 'success' ? 'Cerrar' : 'Cancelar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}