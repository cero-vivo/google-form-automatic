import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

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
    const { quantity, unitPrice, totalPrice, packSize, discountPercent } = body;

    console.log('📝 Creando preferencia con datos:', { quantity, unitPrice, totalPrice, packSize, discountPercent });

    // Validar datos requeridos
    if (!quantity || !unitPrice || !totalPrice) {
      return NextResponse.json(
        { 
          error: 'Datos requeridos faltantes',
          received: { quantity, unitPrice, totalPrice }
        },
        { status: 400 }
      );
    }

    // Crear preferencia de Mercado Pago
    const preference = new Preference(client);
    
    const preferenceData = {
      items: [
        {
          id: `form_credits_${quantity}`,
          title: `FastForm – ${quantity} crédito${quantity !== 1 ? 's' : ''} de formulario${quantity !== 1 ? 's' : ''}`,
          quantity: 1,
          unit_price: totalPrice,
          currency_id: 'ARS',
          description: `Pack de ${quantity} formularios${packSize ? ` (Pack ${packSize} con ${discountPercent}% descuento)` : ''}`,
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },
      // Solo habilitar auto_return en producción
      auto_return: process.env.NODE_ENV === 'production' ? 'approved' : undefined,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhooks`,
      external_reference: `form_credits_${Date.now()}_${quantity}`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      statement_descriptor: 'FastForm',
      binary_mode: true, // Solo pagos aprobados o rechazados
      // Configuración para desarrollo y producción
      ...(process.env.NODE_ENV === 'development' && { 
        // En desarrollo, usar URLs públicas o deshabilitar webhooks
        notification_url: undefined,
        auto_return: undefined
      })
    };

    console.log('🔄 Enviando preferencia a Mercado Pago...');
    console.log('📋 Datos de preferencia:', JSON.stringify(preferenceData, null, 2));

    const response = await preference.create({ body: preferenceData });

    console.log('✅ Preferencia creada exitosamente:', response.id);

    return NextResponse.json({
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });

  } catch (error) {
    console.error('❌ Error al crear preferencia de Mercado Pago:', error);
    
    // Si es un error de Mercado Pago, devolver más detalles
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Error al crear preferencia de Mercado Pago',
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