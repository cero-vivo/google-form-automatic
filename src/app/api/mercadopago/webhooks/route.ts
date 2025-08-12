import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar que sea una notificación de Mercado Pago
    if (body.type !== 'payment') {
      return NextResponse.json({ status: 'ignored' });
    }

    const paymentId = body.data.id;
    
    // Aquí deberías hacer una llamada a la API de Mercado Pago para obtener los detalles del pago
    // Por ahora, solo registramos la notificación
    
    console.log('Webhook recibido de Mercado Pago:', {
      type: body.type,
      paymentId: paymentId,
      timestamp: new Date().toISOString()
    });

    // TODO: Implementar lógica para:
    // 1. Obtener detalles del pago desde Mercado Pago
    // 2. Verificar que el pago esté aprobado
    // 3. Actualizar el saldo de créditos del usuario en la base de datos
    // 4. Registrar la transacción

    return NextResponse.json({ 
      status: 'success',
      message: 'Webhook procesado correctamente'
    });

  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 