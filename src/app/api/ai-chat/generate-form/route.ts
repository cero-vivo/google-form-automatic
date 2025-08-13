import { NextRequest, NextResponse } from 'next/server';
import { OpenAIFormService } from '@/infrastructure/ai/OpenAIFormService';
import { CreditsService } from '@/infrastructure/firebase/credits-service';

const openAIFormService = new OpenAIFormService();

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

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
    const result = await openAIFormService.processChatMessage(userId, message, []);
    const formStructure = result.formPreview;

    if (!formStructure) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se pudo generar el formulario. El sistema ahora interpreta automáticamente tu mensaje. Intenta con descripciones simples como "feedback del producto", "encuesta de satisfacción", "registro de clientes", etc.' 
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      form: {
        title: formStructure.title,
        description: formStructure.description || 'Formulario generado con IA',
        questions: formStructure.questions
      }
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