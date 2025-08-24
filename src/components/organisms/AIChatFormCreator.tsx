'use client';

import React, { useState, useEffect, useRef } from 'react';
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

interface FormContext {
  type: string;
  objective?: string;
  targetAudience?: string;
  previousQuestions: string[];
  metadata: {
    totalQuestions: number;
    questionTypes: string[];
    lastUpdate: Date;
  };
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

  const [creditsUsed, setCreditsUsed] = useState(0);
  const builderRef = useRef<any>(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [showCostWarning, setShowCostWarning] = useState(false);
  const [formContext, setFormContext] = useState<FormContext>({
    type: 'encuesta',
    objective: undefined,
    targetAudience: undefined,
    previousQuestions: [],
    metadata: {
      totalQuestions: 0,
      questionTypes: [],
      lastUpdate: new Date()
    }
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);



  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Actualizar contexto cuando el formulario cambia
    setFormContext(prev => ({
      ...prev,
      previousQuestions: formPreview.questions.map(q => q.label),
      metadata: {
        totalQuestions: formPreview.questions.length,
        questionTypes: [...new Set(formPreview.questions.map(q => q.type))],
        lastUpdate: new Date()
      }
    }));
  }, [formPreview]);

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
      const lowerInput = inputValue.toLowerCase();
      const hasActiveForm = formPreview.questions.length > 0 && formPreview.title;
      
      // SIEMPRE agregar preguntas si hay un formulario activo, nunca crear nuevo
      const isAddingQuestions = hasActiveForm || (
        formPreview.questions.length > 0 && (
          lowerInput.includes('agregar') || 
          lowerInput.includes('añadir') ||
          lowerInput.includes('más') ||
          lowerInput.includes('mas') ||
          lowerInput.includes('extra') ||
          lowerInput.includes('adicional') ||
          lowerInput.includes('otra') ||
          lowerInput.includes('nueva') ||
          lowerInput.includes('editar') ||
          lowerInput.includes('modificar') ||
          lowerInput.includes('cambiar') ||
          lowerInput.includes('borrar') ||
          lowerInput.includes('eliminar') ||
          /\d+\s*(más|mas|pregunta|preguntas)/.test(lowerInput) ||
          /(agrega|añade|pon|suma|edita|modifica|borra|elimina)\s*\d*/.test(lowerInput)
        )
      );

      // Preservar contexto del formulario - SIEMPRE cuando hay un formulario activo
      const preserveFormContext = hasActiveForm || (formPreview.questions.length > 0 && formPreview.title);

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
            ? getSystemPrompt(formContext) + "\n\nIMPORTANTE: El usuario ya tiene un formulario existente. En lugar de crear uno nuevo, DEBES agregar preguntas adicionales al formulario actual. Mantén las preguntas existentes y agrega las nuevas."
            : getSystemPrompt(formContext),
          existingForm: isAddingQuestions ? formPreview : null,
          formContext: {
            ...formContext,
            objective: extractObjectiveFromMessage(inputValue) || formContext.objective,
            targetAudience: extractTargetAudienceFromMessage(inputValue) || formContext.targetAudience,
            type: determineFormType(inputValue, formContext.type)
          },
          preserveTitle: preserveFormContext ? formPreview.title : null,
          preserveDescription: preserveFormContext ? formPreview.description : null
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar el mensaje');
      }

      let assistantContent = '';
      if (hasActiveForm) {
        const newQuestions = data.form.questions.slice(formPreview.questions.length);
        const originalTitle = formPreview.title || 'tu formulario';
        const action = lowerInput.includes('borrar') || lowerInput.includes('eliminar') ? 'modificado' : 'agregado';
        assistantContent = `He ${action} tu formulario "${originalTitle}". Ahora tiene ${data.form.questions.length} preguntas en total.`;
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

    // Delegar al ReusableFormBuilder para usar su lógica de envío
    if (builderRef.current && builderRef.current.handleSubmit) {
      builderRef.current.handleSubmit();
    }
  };



  const handleBuilderSubmit = async (formData: any) => {
    const generationCost = calculateCost('ai_generation');
    
    try {
      await consumeCredits({
        amount: generationCost,
        formTitle: formData.title || 'Formulario generado por IA',
        formId: 'ai-form-' + Date.now()
      });
      
      if (onFormCreated) {
        onFormCreated(formData);
      }
      
      // Limpiar formulario para permitir nueva creación
      setFormPreview({
        title: '',
        description: '',
        questions: []
      });
      
      refreshCredits();
    } catch (error) {
      console.error('Error al consumir créditos:', error);
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
    const lowerMessage = message.toLowerCase().trim();
    
    // Si hay un formulario activo, cualquier solicitud de agregar más es relevante
    if (formPreview.questions.length > 0) {
      const addMorePatterns = [
        /\d+\s*(más|más|extra|adicional|nueva|nuevas)/,
        /(agregar|añadir|agrega|añade)\s*(\d+)?/,
        /(más|otra|nueva)\s*pregunta/,
        /pregunta\s*(más|adicional|extra)/
      ];
      
      if (addMorePatterns.some(pattern => pattern.test(lowerMessage))) {
        return true;
      }
    }
    
    const fastFormKeywords = [
      'formulario', 'form', 'encuesta', 'pregunta', 'respuesta', 'google forms',
      'fastform', 'fast form', 'crear', 'generar', 'diseñar', 'plantilla',
      'campo', 'opción', 'checkbox', 'dropdown', 'texto', 'número', 'email',
      'fecha', 'archivo', 'upload', 'importar', 'exportar', 'dashboard'
    ];
    
    return fastFormKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const getRedirectMessage = (message: string): string => {
    // Si hay un formulario activo, no mostrar mensaje de redirección
    if (formPreview.questions.length > 0) {
      return ''; // No redirigir, permitir que fluya normalmente
    }
    
    return `Hola! Soy tu asistente de FastForm

Entiendo que mencionaste "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}", pero estoy especializado en ayudarte a crear formularios profesionales con FastForm.

¿En qué puedo ayudarte hoy?
• Crear un formulario desde cero
• Diseñar una encuesta específica
• Sugerir preguntas para tu objetivo
• Explicarte cómo funciona FastForm

Por ejemplo, podrías decirme: "Quiero crear una encuesta de satisfacción para mis clientes" o "Necesito un formulario de registro para un evento"`;
  };

  const getSystemPrompt = (context: FormContext): string => {
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
7. **IMPORTANTE**: Usa el CONTEXTO proporcionado para personalizar tus respuestas

🧠 CONTEXTO A UTILIZAR:
  - Tipo de formulario: ${context.type}
  - Objetivo: ${context.objective || 'Por definir'}
  - Audiencia: ${context.targetAudience || 'General'}
  - Preguntas existentes: ${context.previousQuestions.length}
  - Tipos de preguntas: ${context.metadata.questionTypes.join(', ')}

🚫 EVITA:
- Temas fuera del alcance de FastForm
- Respuestas demasiado técnicas
- Sugerencias genéricas sin contexto

💡 EJEMPLOS DE RESPUESTAS CONTEXTUALES:
  Usuario: "Quiero crear una encuesta"
  Tú: "¡Perfecto! 🎉 Veo que estás trabajando en una encuesta. ¿Podrías decirme el objetivo específico? Por ejemplo: satisfacción del cliente, feedback de un evento, o investigación de mercado."

  Usuario: "Agrega más preguntas"
  Tú: "¡Claro! 📊 Tu formulario actual tiene ${context.previousQuestions.length} preguntas enfocadas en ${context.type}. ¿Qué aspecto adicional te gustaría cubrir?`;
  }

  const extractObjectiveFromMessage = (message: string): string | undefined => {
    const objectives = [
      'satisfacción', 'feedback', 'evaluación', 'registro', 'contacto', 
      'encuesta', 'cuestionario', 'sondeo', 'opinión', 'experiencia',
      'servicio', 'producto', 'evento', 'curso', 'capacitación',
      'suscripción', 'solicitud', 'información', 'consulta'
    ];
    
    const lowerMessage = message.toLowerCase();
    const found = objectives.find(obj => lowerMessage.includes(obj));
    return found;
  };

  const extractTargetAudienceFromMessage = (message: string): string | undefined => {
    const audiences = [
      'clientes', 'empleados', 'estudiantes', 'profesores', 'visitantes',
      'usuarios', 'participantes', 'invitados', 'colaboradores', 'equipo',
      'alumnos', 'docentes', 'gerentes', 'cliente', 'empleado'
    ];
    
    const lowerMessage = message.toLowerCase();
    const found = audiences.find(aud => lowerMessage.includes(aud));
    return found;
  };

  const determineFormType = (message: string, currentType: string): string => {
    const typeKeywords: Record<string, string[]> = {
      'encuesta': ['encuesta', 'satisfacción', 'opinión', 'feedback', 'evaluar'],
      'registro': ['registro', 'inscripción', 'formulario', 'aplicación', 'apuntarse'],
      'contacto': ['contacto', 'información', 'consulta', 'soporte', 'ayuda'],
      'evaluación': ['evaluación', 'examen', 'prueba', 'calificación', 'test'],
      'evento': ['evento', 'reunión', 'conferencia', 'taller', 'seminario']
    };

    const lowerMessage = message.toLowerCase();
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return type;
      }
    }
    return currentType;
  };



  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Chat Panel - Fixed width */}
      <div className="w-96 flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1 flex-shrink-0" />
                <span className="text-xs text-yellow-800">
                  Pocos créditos
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-sm break-words ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
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

          <div className="p-4 border-t border-gray-200 flex-shrink-0">
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
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim() || credits <= 0}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Builder Panel - Always visible */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold">Editor Visual</h2>
              <p className="text-sm text-gray-600">
                Formulario actualizado en tiempo real
              </p>
            </div>
            <button
              onClick={handlePublishForm}
              disabled={!user || !canAfford(calculateCost('ai_generation')) || formPreview.questions.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex-shrink-0 ml-4"
            >
              Publicar formulario ({calculateCost('ai_generation')} créditos)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ReusableFormBuilder
            ref={builderRef}
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
          />
        </div>
      </div>


    </div>
  );
}