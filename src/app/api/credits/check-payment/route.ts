import { NextRequest, NextResponse } from 'next/server';
import { CreditsService } from '@/infrastructure/firebase/credits-service';

/**
 * Endpoint para verificar si un pago ya fue procesado
 * Solo verifica, no agrega créditos
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const userId = searchParams.get('userId');

    if (!paymentId || !userId) {
      return NextResponse.json(
        { error: 'paymentId y userId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el pago ya fue procesado en el historial del usuario
    const userCredits = await CreditsService.getUserCredits(userId);
    
    if (!userCredits || !userCredits.history) {
      return NextResponse.json({ processed: false });
    }

    const alreadyProcessed = userCredits.history.some(
      (transaction: any) => transaction.paymentId === paymentId
    );

    return NextResponse.json({ 
      processed: alreadyProcessed,
      paymentId,
      userId
    });

  } catch (error) {
    console.error('❌ Error al verificar pago:', error);
    return NextResponse.json(
      { 
        error: 'Error al verificar pago',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
