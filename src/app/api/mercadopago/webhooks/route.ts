import { NextRequest, NextResponse } from 'next/server';
import { mercadopagoService } from '@/infrastructure/mercadopago/mercadopago-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mercado Pago envía diferentes tipos de notificaciones
    const { type, data } = body;

    console.log('📨 Mercado Pago webhook received:', { type, data });

    let event;
    
    try {
      // Verificar webhook (Mercado Pago no usa firmas como Stripe)
      event = mercadopagoService.verifyWebhook(body);
    } catch (error: any) {
      console.error('❌ Webhook verification failed:', error);
      return NextResponse.json(
        { error: 'Verificación del webhook falló' },
        { status: 400 }
      );
    }

    // Procesar evento según el tipo
    switch (type) {
      case 'payment':
        await handlePaymentEvent(data);
        break;
      case 'subscription':
        await handleSubscriptionEvent(data);
        break;
      case 'preference':
        await handlePreferenceEvent(data);
        break;
      default:
        console.log('⚠️ Unhandled webhook event type:', type);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook procesado exitosamente',
    });

  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al procesar webhook',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Manejadores de eventos
async function handlePaymentEvent(data: any): Promise<void> {
  try {
    const { id } = data;
    
    if (!id) {
      console.log('⚠️ Payment event without ID');
      return;
    }

    // Obtener información del pago
    const payment = await mercadopagoService.getPayment(id);
    
    if (!payment) {
      console.log('⚠️ Payment not found:', id);
      return;
    }

    console.log('✅ Payment event processed:', {
      id: payment.id,
      status: payment.status,
      amount: payment.transaction_amount,
      externalReference: payment.external_reference,
    });

    // Procesar según el estado del pago
    switch (payment.status) {
      case 'approved':
        await handlePaymentApproved(payment);
        break;
      case 'pending':
        await handlePaymentPending(payment);
        break;
      case 'rejected':
      case 'cancelled':
        await handlePaymentRejected(payment);
        break;
      default:
        console.log('⚠️ Unknown payment status:', payment.status);
    }

  } catch (error) {
    console.error('❌ Error handling payment event:', error);
  }
}

async function handleSubscriptionEvent(data: any): Promise<void> {
  try {
    console.log('✅ Subscription event processed:', data);
    // Implementar lógica para eventos de suscripción
  } catch (error) {
    console.error('❌ Error handling subscription event:', error);
  }
}

async function handlePreferenceEvent(data: any): Promise<void> {
  try {
    console.log('✅ Preference event processed:', data);
    // Implementar lógica para eventos de preferencia
  } catch (error) {
    console.error('❌ Error handling preference event:', error);
  }
}

// Manejadores de estados de pago
async function handlePaymentApproved(payment: any): Promise<void> {
  try {
    console.log('✅ Payment approved:', payment.id);
    
    // Aquí deberías:
    // 1. Actualizar el estado del usuario en tu base de datos
    // 2. Incrementar el límite de formularios
    // 3. Enviar email de confirmación
    // 4. Registrar la transacción
    
    // Por ahora solo log
    console.log('💰 Payment approved for user:', payment.external_reference);
    
  } catch (error) {
    console.error('❌ Error handling approved payment:', error);
  }
}

async function handlePaymentPending(payment: any): Promise<void> {
  try {
    console.log('⏳ Payment pending:', payment.id);
    
    // Pago pendiente (ej: transferencia bancaria)
    // No hacer cambios hasta que se confirme
    
  } catch (error) {
    console.error('❌ Error handling pending payment:', error);
  }
}

async function handlePaymentRejected(payment: any): Promise<void> {
  try {
    console.log('❌ Payment rejected/cancelled:', payment.id);
    
    // Pago rechazado o cancelado
    // No hacer cambios en el usuario
    
  } catch (error) {
    console.error('❌ Error handling rejected payment:', error);
  }
} 