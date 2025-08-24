import { NextRequest, NextResponse } from 'next/server';
import { OpenAIFormService } from '@/infrastructure/ai/OpenAIFormService';
import { CreditsService } from '@/infrastructure/firebase/credits-service';

const openAIFormService = new OpenAIFormService();

export async function POST(request: NextRequest) {
  try {
    const { message, userId, existingForm, preserveTitle, preserveDescription } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Por favor proporciona una descripción para tu formulario' 
        },
        { status: 400 }
      );
    }

    // Check and initialize credits if needed
    let userCredits = await CreditsService.getUserCredits(userId);
    let creditBalance = userCredits?.balance || 0;
    console.log(`User ${userId} has ${creditBalance} credits`);
    
    // Initialize credits if user doesn't exist
    if (!userCredits) {
      console.log(`Initializing credits for user ${userId}`);
      const initializedCredits = await CreditsService.initializeUserCredits(userId);
      creditBalance = initializedCredits.balance;
      console.log(`After initialization, user ${userId} has ${creditBalance} credits`);
    }
    
    if (creditBalance < 2) {
      return NextResponse.json(
        { success: false, error: `Créditos insuficientes. Necesitas al menos 2 créditos. Tienes: ${creditBalance}` },
        { status: 402 }
      );
    }

    // Generate form structure with AI
    let conversation = [];
    if (existingForm) {
      conversation.push({
        role: 'system',
        content: `Tienes un formulario existente con título: "${existingForm.title}" y ${existingForm.questions?.length || 0} preguntas. El usuario quiere agregar más preguntas o mejorar el formulario.`
      });
    }
    
    const result = await openAIFormService.processChatMessage(userId, message, conversation);
    const formStructure = result.formPreview;

    if (!formStructure) {
      // Instead of failing, create a basic structure from the user's message
      const basicForm = {
        title: `Formulario sobre ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
        description: `Formulario generado basado en: ${message}`,
        questions: [
          {
            type: 'texto_largo',
            label: 'Comparte tus pensamientos',
            required: true
          }
        ]
      };
      
      return NextResponse.json({
        success: true,
        form: basicForm,
        note: 'Se ha creado una estructura básica. Puedes editar las preguntas antes de publicar.'
      });
    }

    // Consume credits for form generation (2 credits)
    try {
      await CreditsService.consumeCredits(userId, {
        amount: 2,
        formTitle: formStructure.title || 'Formulario sin título'
      });
      console.log(`✅ Consumidos 2 créditos del usuario ${userId} por generación de formulario`);
    } catch (creditError) {
      console.error('Error consumiendo créditos:', creditError);
      // Continuar aunque falle la deducción, pero loggear el error
    }

    let finalForm;
    if (existingForm && formStructure) {
      // Combinar formulario existente con nuevas preguntas
      const existingQuestions = existingForm.questions || [];
      const newQuestions = formStructure.questions || [];
      
      finalForm = {
        title: preserveTitle || existingForm.title || formStructure.title,
        description: preserveDescription || existingForm.description || formStructure.description || 'Formulario generado con IA',
        questions: [...existingQuestions, ...newQuestions]
      };
    } else {
      finalForm = {
        title: preserveTitle || formStructure.title,
        description: preserveDescription || formStructure.description || 'Formulario generado con IA',
        questions: formStructure.questions
      };
    }

    return NextResponse.json({
      success: true,
      form: finalForm,
      isUpdate: !!existingForm
    });

  } catch (error) {
    console.error('Error generating form with AI:', error);
    
    let errorMessage = 'Error al procesar tu solicitud';
    
    if (error instanceof Error) {
      if (error.message.includes('OpenAI')) {
        errorMessage = 'Error de conexión con el servicio de IA. Intenta nuevamente.';
      } else if (error.message.includes('credits')) {
        errorMessage = 'Error verificando tus créditos';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}