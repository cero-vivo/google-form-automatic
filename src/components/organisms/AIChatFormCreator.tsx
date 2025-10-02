'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ReusableFormBuilder } from './ReusableFormBuilder';
import { Send, AlertCircle } from 'lucide-react';
import { useAuth } from '@/containers/useAuth';
import { useCredits } from '@/containers/useCredits';
import { useCostManager } from '@/application/services/CostManager';
import { QuestionType } from '@/domain/types';
import { CONFIG } from '@/lib/config';

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

export function AIChatFormCreator({ onFormCreated, draftId }: { onFormCreated?: (formData: FormPreviewData) => void, draftId?: string }) {
	const { user } = useAuth();
	const { currentCredits, refreshCredits, consumeCredits } = useCredits();
	const credits = currentCredits;
	const { calculateCost, getWarnings, canAfford } = useCostManager();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [formPreview, setFormPreview] = useState<FormPreviewData>({ title: '', questions: [] });

	const builderRef = useRef<any>(null);
	const [totalMessages, setTotalMessages] = useState(0);
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
	const [showMobileBuilder, setShowMobileBuilder] = useState(false);

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

		// Calculate cost for this message - only charge after free messages are used
		const messageCost = calculateCost('ai_message', { messageCount: totalMessages + 1 });
		console.log("🚀 ~ handleSendMessage ~ messageCost:", messageCost)
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
					messages: conversation,
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
					preserveDescription: preserveFormContext ? formPreview.description : null,
					chargeCredits: messageCost
				}),
			});

			const data = await response.json();
			console.log("🚀 ~ handleSendMessage ~ data:", data)

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
			// Los mensajes de chat son gratuitos, no consumen créditos
			setTotalMessages(prev => prev + 1);

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
		try {
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
		return preview.questions.map((q, index) => {
			// Mapear tipos de string a enum válido
			let mappedType: QuestionType;
			switch (q.type?.toLowerCase()) {
				case 'multiple_choice':
				case 'multiple choice':
				case 'opción múltiple':
				case 'opcion multiple':
				case 'opcion_multiple':
					mappedType = QuestionType.MULTIPLE_CHOICE;
					break;
				case 'checkbox':
				case 'checkboxes':
				case 'casillas':
					mappedType = QuestionType.CHECKBOXES;
					break;
				case 'dropdown':
				case 'desplegable':
					mappedType = QuestionType.DROPDOWN;
					break;
				case 'short_text':
				case 'short text':
				case 'texto corto':
				case 'text':
				case 'texto':
					mappedType = QuestionType.SHORT_TEXT;
					break;
				case 'long_text':
				case 'long text':
				case 'texto largo':
					mappedType = QuestionType.LONG_TEXT;
					break;
				case 'date':
				case 'fecha':
					mappedType = QuestionType.DATE;
					break;
				case 'time':
				case 'hora':
					mappedType = QuestionType.TIME;
					break;
				case 'email':
				case 'correo':
				case 'email address':
					mappedType = QuestionType.EMAIL;
					break;
				case 'number':
				case 'número':
				case 'numero':
					mappedType = QuestionType.NUMBER;
					break;
				case 'linear_scale':
				case 'linear scale':
				case 'escala':
				case 'rating':
					mappedType = QuestionType.LINEAR_SCALE;
					break;
				default:
					mappedType = QuestionType.SHORT_TEXT;
			}

			// Asegurar que las opciones estén presentes para tipos que las necesitan
			let options = q.options || [];

			// Si no hay opciones y es un tipo que las necesita, crear opciones por defecto
			if ((mappedType === QuestionType.MULTIPLE_CHOICE ||
				mappedType === QuestionType.CHECKBOXES ||
				mappedType === QuestionType.DROPDOWN) &&
				(!options || options.length === 0)) {
			}

			return {
				id: `ai-question-${index}`,
				title: q.label,
				type: mappedType,
				required: false,
				options: options,
				order: index,
				createdAt: new Date(),
				updatedAt: new Date()
			};
		});
	};

	const getCreditWarning = () => {
		const warnings = getWarnings(totalMessages);
		if (warnings.length > 0) {
			return warnings[0].message;
		}

		const remainingFree = Math.max(0, CONFIG.CREDITS.CHAT.FREE_MESSAGES - totalMessages);
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
		<div className="flex flex-col md:flex-row w-full bg-white overflow-hidden min-h-[calc(100dvh-7rem)] md:min-h-[560px] md:h-[calc(100vh-8rem)] min-w-0">
			{/* Chat Panel - Responsive width */}
			<div className="w-full md:w-96 md:max-w-md flex flex-col bg-white border-neutral-200/60 border-b md:border-b-0 md:border-r flex-1 md:flex-none min-w-0">
				<div className="p-5 sm:p-6 border-b border-neutral-100 flex-shrink-0 bg-white">
					<h1 className="text-xl font-bold mb-2 text-forms-600 font-poppins">Asistente IA</h1>
					<p className="text-sm text-neutral-600 font-inter">
						Conversación continua para mejorar tu formulario
					</p>

					<div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-50/50 rounded-xl border border-neutral-100">
						<div className="text-sm font-inter">
							<span className="font-medium text-neutral-700">Créditos:</span>
							<span className="ml-2 font-bold text-excel-600 text-lg">{credits || 0}</span>
						</div>
						{credits !== null && credits < 10 && (
							<div className="sm:ml-4 w-full sm:w-auto p-3 bg-velocity-50 border border-velocity-200 rounded-xl flex items-center justify-between sm:justify-start">
								<AlertCircle className="h-4 w-4 text-velocity-600 mr-2 flex-shrink-0" />
								<span className="text-sm text-velocity-700 font-medium">
									Pocos créditos
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 flex flex-col min-h-0 min-w-0">
					<div ref={scrollAreaRef} className="flex-1 p-4 sm:p-5 overflow-y-auto bg-white min-w-0">
						<div className="space-y-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm break-words transition-all duration-200 ${message.role === 'user'
											? 'bg-forms-500 hover:bg-forms-600 text-white font-medium shadow-md hover:shadow-lg'
											: 'bg-white hover:bg-neutral-50 border border-neutral-200/80 text-neutral-700 shadow-sm hover:shadow-md'
											}`}
									>
										<p className="break-words leading-relaxed font-inter">{message.content}</p>
										<p className="text-xs opacity-70 mt-2 font-inter">
											{message.timestamp.toLocaleTimeString()}
										</p>
									</div>
								</div>
							))}
							{isLoading && (
								<div className="flex justify-start">
									<div className="bg-white border border-neutral-200/80 px-4 py-3 rounded-2xl shadow-md">
										<div className="flex items-center space-x-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-forms-300 border-t-forms-600"></div>
											<span className="text-sm text-neutral-600 font-inter">Pensando...</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="p-4 sm:p-5 border-t border-neutral-100 flex-shrink-0 bg-white shadow-sm">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
							<span className="text-sm text-neutral-500 font-inter">
								{getCreditWarning()}
							</span>
						</div>

						<div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 items-stretch sm:items-center">
							<textarea
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Agregar más preguntas o mejorar el formulario..."
								disabled={isLoading || credits <= 0}
								rows={5}
								className="w-full flex-1 px-4 py-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forms-200 focus:border-forms-400 min-w-0 resize-none overflow-hidden transition-all duration-200 hover:border-neutral-300 bg-white font-inter placeholder:text-neutral-400 shadow-sm focus:shadow-md"
								style={{ minHeight: '44px', maxHeight: '120px' }}
								onInput={(e) => {
									const target = e.target as HTMLTextAreaElement;
									target.style.height = 'auto';
									target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSendMessage();
									}
								}}
							/>
							<button
								onClick={handleSendMessage}
								disabled={isLoading || !inputValue.trim() || credits <= 0}
								className="px-4 py-3 bg-forms-500 text-white rounded-xl hover:bg-forms-600 focus:bg-forms-600 focus:outline-none focus:ring-2 focus:ring-forms-200 disabled:opacity-50 disabled:hover:bg-forms-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium w-full sm:w-auto"
							>
								<Send className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Builder Panel - Responsive visibility */}
			<div className="hidden md:flex flex-1 flex-col min-h-0 min-w-0">
				<div className="p-6 border-b border-neutral-100 bg-white flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="min-w-0">
							<h2 className="text-xl font-bold text-forms-600 font-poppins">Editor Visual</h2>
							<p className="text-sm text-neutral-600 font-inter mt-1">
								Formulario actualizado en tiempo real
							</p>
						</div>
						<button
							onClick={handlePublishForm}
							disabled={!user || !canAfford(calculateCost('ai_generation')) || formPreview.questions.length === 0}
							className="px-4 sm:px-6 py-3 bg-excel-500 text-white rounded-xl hover:bg-excel-600 focus:bg-excel-600 focus:outline-none focus:ring-2 focus:ring-excel-200 disabled:opacity-50 disabled:hover:bg-excel-500 transition-all duration-200 shadow-sm font-medium font-poppins text-sm sm:text-base text-center leading-snug whitespace-normal md:ml-4 shrink min-w-0"
						>
							Publicar formulario ({calculateCost('ai_generation')} créditos)
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30 min-w-0">
					<ReusableFormBuilder
						ref={builderRef}
						creationMethod="ai"
						initialTitle={formPreview.title}
						initialDescription={formPreview.description || ''}
						initialQuestions={convertToBuilderFormat(formPreview)}
						onFormCreated={handleBuilderSubmit}
						submitButtonText="Publicar formulario"
						draftId={draftId}
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

			{/* Mobile Builder Toggle */}
			<div className="md:hidden fixed bottom-6 right-4 z-50">
				<button
					onClick={() => setShowMobileBuilder(!showMobileBuilder)}
					className="px-5 py-3 bg-forms-500 text-white rounded-full shadow-lg hover:bg-forms-600 focus:bg-forms-600 focus:outline-none focus:ring-2 focus:ring-forms-200 transition-all duration-200 font-medium font-poppins"
				>
					{showMobileBuilder ? 'Chat' : 'Editor'}
				</button>
			</div>

			{/* Mobile Builder Panel */}
			{showMobileBuilder && (
				<div className="md:hidden fixed inset-0 bg-white z-40 flex flex-col">
					<div className="p-6 border-b border-neutral-100 bg-white flex-shrink-0">
						<div className="flex items-center justify-between">
							<div className="min-w-0">
								<h2 className="text-xl font-bold text-forms-600 font-poppins">Editor Visual</h2>
								<p className="text-sm text-neutral-600 font-inter mt-1">
									Formulario actualizado en tiempo real
								</p>
							</div>
							<button
								onClick={() => setShowMobileBuilder(false)}
								className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-none transition-all duration-200 font-medium"
							>
								Cerrar
							</button>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30">
						<ReusableFormBuilder
							ref={builderRef}
							creationMethod="ai"
							initialTitle={formPreview.title}
							initialDescription={formPreview.description || ''}
							initialQuestions={convertToBuilderFormat(formPreview)}
							onFormCreated={handleBuilderSubmit}
							submitButtonText="Publicar formulario"
							draftId={draftId}
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
			)}
		</div>
	)
}
