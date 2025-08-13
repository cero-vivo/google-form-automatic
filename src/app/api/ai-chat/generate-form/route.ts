import { NextRequest, NextResponse } from 'next/server';
import { OpenAIFormService } from '@/infrastructure/services/OpenAIFormService';
import { CreditService } from '@/infrastructure/services/CreditService';

const openAIFormService = new OpenAIFormService();
const creditService = new CreditService();

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Por favor proporciona una descripción más detallada del formulario' },
        { status: 400 }
      );
    }

    // Check credits
    const userCredits = await creditService.getUserCredits(userId);
    if (userCredits < 2) {
      return NextResponse.json(
        { success: false, error: 'Créditos insuficientes. Necesitas al menos 2 créditos.' },
        { status: 402 }
      );
    }

    // Generate form structure with AI
    const formStructure = await openAIFormService.generateFormFromPrompt(message);

    if (!formStructure) {
      return NextResponse.json(
        { success: false, error: 'No se pudo generar el formulario. Intenta con una descripción más clara.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      form: {
        title: formStructure.title,
        description: formStructure.description,
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