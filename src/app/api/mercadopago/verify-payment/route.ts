import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { CreditsService } from '@/infrastructure/firebase/credits-service';
import { CreditPurchase } from '@/types/credits';

// Verificar configuración de Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!accessToken) {
  console.error('⚠️ MERCADOPAGO_ACCESS_TOKEN no está configurado');
}

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: accessToken || 'test_token' 
});

export async function POST(request: NextRequest) {
  try {
    /**
     * ⚠️ DEPRECADO - Este endpoint ya no agrega créditos
     * 
     * Los créditos ahora son agregados ÚNICAMENTE por el webhook de MercadoPago
     * (/api/mercadopago/webhooks) para evitar duplicación.
     * 
     * Este endpoint ahora solo verifica el estado del pago sin agregar créditos.
     * El frontend debe usar /api/credits/check-payment para verificar si el webhook
     * ya procesó el pago.
     */
    
    // Verificar si Mercado Pago está configurado
    if (!accessToken) {
      return NextResponse.json(
        { 
          error: 'Mercado Pago no está configurado',
          details: 'La variable de entorno MERCADOPAGO_ACCESS_TOKEN no está configurada'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { paymentId, userId, purchase } = body;

    console.log('🔍 Verificando pago (no agrega créditos):', { paymentId, userId });

    // Validar datos requeridos
    if (!paymentId || !userId || !purchase) {
      return NextResponse.json(
        { 
          error: 'Datos requeridos faltantes',
          received: { paymentId, userId, purchase }
        },
        { status: 400 }
      );
    }

    // Verificar el pago en Mercado Pago
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    console.log('📊 Estado del pago:', paymentData.status);

    // Solo verificar el estado, NO agregar créditos
    if (paymentData.status === 'approved') {
      console.log(`ℹ️ Pago aprobado. Los créditos serán agregados por el webhook.`);

      return NextResponse.json({
        success: true,
        message: 'Pago aprobado - Los créditos serán agregados por el webhook',
        paymentStatus: paymentData.status,
        info: 'Los créditos son agregados por el webhook de MercadoPago'
      });

    } else {
      console.log(`⚠️ Pago no aprobado. Estado: ${paymentData.status}`);
      return NextResponse.json(
        { 
          success: false,
          message: 'Pago no aprobado',
          paymentStatus: paymentData.status,
          reason: 'El pago debe estar aprobado para agregar créditos'
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('❌ Error al verificar pago:', error);
    
    // Si es un error de Mercado Pago, devolver más detalles
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Error al verificar pago en Mercado Pago',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 