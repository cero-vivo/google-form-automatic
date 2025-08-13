import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar que sea una notificación de Mercado Pago
    if (body.type !== 'payment') {
      return NextResponse.json({ status: 'ignored' });
    }

    const paymentId = body.data.id;
    
    console.log('🔄 Webhook recibido de Mercado Pago:', {
      type: body.type,
      paymentId: paymentId,
      timestamp: new Date().toISOString(),
      fullBody: JSON.stringify(body, null, 2)
    });

    // TODO: Implementar lógica completa de webhook
    // Por ahora, solo registramos y retornamos éxito para evitar errores
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Webhook recibido - procesamiento pendiente',
      paymentId: paymentId
    });

  } catch (error) {
    console.error('❌ Error procesando webhook de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}