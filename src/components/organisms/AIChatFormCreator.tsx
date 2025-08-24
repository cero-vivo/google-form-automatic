'use client';

import { useState, useEffect, useRef } from 'react';
import { FormPreview } from '@/components/molecules/FormPreview';
import { CreditDisplay } from '@/components/molecules/CreditDisplay';
import { ReusableFormBuilder } from './ReusableFormBuilder';
import { Send, Bot, User, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/containers/useAuth';
import { useCredits } from '@/containers/useCredits';
import { useCostManager } from '@/application/services/CostManager';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FormPreviewData {
  title: string;
  description?: string;
  questions: Array<{
    type: string;
    label: string;
    options?: string[];
    range?: [number, number];
  }>;
}

export function AIChatFormCreator({ onFormCreated }: { onFormCreated?: (formData: FormPreviewData) => void }) {
  const { user } = useAuth();
  const { currentCredits, refreshCredits, consumeCredits } = useCredits();
  const credits = currentCredits;
  const { calculateCost, getWarnings, canAfford, getRuleDescription, warnings } = useCostManager();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formPreview, setFormPreview] = useState<FormPreviewData>({ title: '', questions: [] });

  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [showCostWarning, setShowCostWarning] = useState(false);

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
    
    // Check if user is asking about non-FastForm topics
    const isRelevant = isFastFormRelevant(inputValue);
    if (!isRelevant) {
      const redirectMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: getRedirectMessage(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, redirectMessage]);
      setInputValue('');
      return;
    }

    // Calculate cost for this message
    const messageCost = calculateCost('ai_message', { messageCount: totalMessages + 1 });
    if (messageCost > 0 && !canAfford(messageCost)) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'No tienes suficientes créditos para enviar este mensaje. Por favor recarga tu cuenta para continuar.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

    try {
      const conversation = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Consume credits if needed
      const messageCost = calculateCost('ai_message', { messageCount: totalMessages + 1 });
      if (messageCost > 0) {
        await consumeCredits({
          amount: messageCost,
          formTitle: 'Mensaje de chat IA',
          formId: 'ai-chat-' + Date.now()
        });
      }

      // Determinar si es una solicitud para agregar preguntas o crear nuevo
      const isAddingQuestions = formPreview.questions.length > 0 && 
        (inputValue.toLowerCase().includes('agregar') || 
         inputValue.toLowerCase().includes('añadir') ||
         inputValue.toLowerCase().includes('más') ||
         inputValue.toLowerCase().includes('extra') ||
         inputValue.toLowerCase().includes('adicional'));

      const response = await fetch('/api/ai-chat/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userId: user.id,
          conversation,
          systemPrompt: isAddingQuestions 
            ? getSystemPrompt() + "\n\nIMPORTANTE: El usuario ya tiene un formulario existente. En lugar de crear uno nuevo, DEBES agregar preguntas adicionales al formulario actual. Mantén las preguntas existentes y agrega las nuevas."
            : getSystemPrompt(),
          existingForm: isAddingQuestions ? formPreview : null
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar el mensaje');
      }

      let assistantContent = '';
      if (isAddingQuestions) {
        const newQuestions = data.form.questions.slice(formPreview.questions.length);
        assistantContent = `He agregado ${newQuestions.length} nueva${newQuestions.length !== 1 ? 's' : ''} pregunta${newQuestions.length !== 1 ? 's' : ''} a tu formulario. Ahora tiene ${data.form.questions.length} preguntas en total.`;
      } else {
        assistantContent = `He creado un nuevo formulario llamado "${data.form.title}" con ${data.form.questions.length} preguntas.`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
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

    const generationCost = calculateCost('ai_generation');
    if (!canAfford(generationCost)) {
      return;
    }

    setShowPublishDialog(true);
    setPublishStatus('publishing');

    try {
      await consumeCredits({
        amount: generationCost,
        formTitle: formPreview?.title || 'Formulario generado por IA',
        formId: 'ai-form-' + Date.now()
      });
      setPublishStatus('success');
      
      if (onFormCreated && formPreview) {
        onFormCreated(formPreview);
      }
      
      // Limpiar formulario para permitir nueva creación
      setFormPreview({
        title: '',
        description: '',
        questions: []
      });
      
      refreshCredits();
    } catch (error) {
      console.error('Error al publicar formulario:', error);
      setPublishStatus('error');
    }
  };



  const handleBuilderSubmit = async (formData: any) => {
    if (onFormCreated) {
      onFormCreated(formData);
    }
  };

  const convertToBuilderFormat = (preview: FormPreviewData) => {
    return preview.questions.map((q, index) => ({
      id: `ai-question-${index}`,
      title: q.label,
      description: '',
      type: q.type as any,
      required: false,
      options: q.options || [],
      order: index,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  };

  const getCreditWarning = () => {
    const warnings = getWarnings(totalMessages);
    if (warnings.length > 0) {
      return warnings[0].message;
    }

    const remainingFree = Math.max(0, 15 - totalMessages);
    return `Te quedan ${remainingFree} mensaje${remainingFree !== 1 ? 's' : ''} gratis antes de cobrar créditos adicionales`;
  };

  const isFastFormRelevant = (message: string): boolean => {
    const fastFormKeywords = [
      'formulario', 'form', 'encuesta', 'pregunta', 'respuesta', 'google forms',
      'fastform', 'fast form', 'crear', 'generar', 'diseñar', 'plantilla',
      'campo', 'opción', 'checkbox', 'dropdown', 'texto', 'número', 'email',
      'fecha', 'archivo', 'upload', 'importar', 'exportar', 'dashboard'
    ];
    
    const lowerMessage = message.toLowerCase();
    return fastFormKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const getRedirectMessage = (message: string): string => {
    return `Hola! Soy tu asistente de FastForm

Entiendo que mencionaste "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}", pero estoy especializado en ayudarte a crear formularios profesionales con FastForm.

¿En qué puedo ayudarte hoy?
• Crear un formulario desde cero
• Diseñar una encuesta específica
• Sugerir preguntas para tu objetivo
• Explicarte cómo funciona FastForm

Por ejemplo, podrías decirme: "Quiero crear una encuesta de satisfacción para mis clientes" o "Necesito un formulario de registro para un evento"`;
  };

  const getSystemPrompt = (): string => {
    return `Eres el asistente oficial de FastForm, una plataforma inteligente para crear formularios de Google Forms. Tu personalidad es:

🎯 MISION: Ayudar a los usuarios a crear formularios profesionales y efectivos
😊 TONO: Amable, profesional y entusiasta
🚀 ENFOQUE: Práctico y orientado a resultados

📝 INSTRUCCIONES CLAVE:
1. Siempre saluda con calidez y presenta tu rol como asistente de FastForm
2. Guía al usuario paso a paso en la creación de su formulario
3. Sugiere preguntas relevantes según el objetivo del formulario
4. Explica brevemente las ventajas de cada tipo de pregunta
5. Mantén las respuestas concisas pero completas
6. Si el usuario parece perdido, ofrece ejemplos concretos

🚫 EVITA:
- Temas fuera del alcance de FastForm
- Respuestas demasiado técnicas
- Sugerencias genéricas sin contexto

💡 EJEMPLOS DE RESPUESTAS:
Usuario: "Quiero crear una encuesta"
Tú: "¡Perfecto! 🎉 Para crear tu encuesta, necesito saber: ¿Cuál es el objetivo principal? Por ejemplo: satisfacción del cliente, feedback de un evento, o investigación de mercado."

Usuario: "No sé qué preguntas poner"
Tú: "¡Te ayudo! Para un formulario de satisfacción, te sugiero:
1. ¿Cómo calificarías tu experiencia? (escala 1-5)
2. ¿Qué fue lo que más te gustó? (texto corto)
3. ¿Qué mejorarías? (texto largo)
4. ¿Recomendarías nuestro servicio? (sí/no)

¿Te gustaría que prepare un formulario con estas preguntas?"`;
  };



  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat Panel - Fixed width */}
      <div className="w-96 flex flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold mb-1">Asistente IA</h1>
          <p className="text-sm text-gray-600">
            Conversación continua para mejorar tu formulario
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-medium">Créditos:</span>
              <span className="ml-1 font-bold">{credits || 0}</span>
            </div>
            {credits !== null && credits < 10 && (
              <div className="ml-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                <span className="text-xs text-yellow-800">
                  Pocos créditos
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                {getCreditWarning()}
              </span>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Agregar más preguntas o mejorar el formulario..."
                disabled={isLoading || credits <= 0}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim() || credits <= 0}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Builder Panel - Always visible */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Editor Visual</h2>
              <p className="text-sm text-gray-600">
                Formulario actualizado en tiempo real
              </p>
            </div>
            <button
              onClick={handlePublishForm}
              disabled={!user || !canAfford(calculateCost('ai_generation')) || formPreview.questions.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Publicar formulario ({calculateCost('ai_generation')} créditos)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ReusableFormBuilder
            initialTitle={formPreview.title}
            initialDescription={formPreview.description || ''}
            initialQuestions={convertToBuilderFormat(formPreview)}
            onFormCreated={handleBuilderSubmit}
            submitButtonText="Publicar formulario"
            onTitleChange={(title: string) => {
              setFormPreview(prev => ({ ...prev, title }));
            }}
            onDescriptionChange={(description: string) => {
              setFormPreview(prev => ({ ...prev, description }));
            }}
            onQuestionsChange={(questions: any[]) => {
              setFormPreview(prev => ({
                ...prev,
                questions: questions.map(q => ({
                  type: q.type,
                  label: q.title,
                  options: q.options || [],
                  range: q.type === 'escala_lineal' ? [1, 5] : undefined
                }))
              }));
            }}
            hideSubmitButton={true}
          />
        </div>
      </div>

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
                    setFormPreview({ title: '', questions: [] });
                    setMessages([]);
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
  );
}