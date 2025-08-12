import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quantity, unitPrice, totalPrice, packSize, discountPercent } = body;

    // Validar datos requeridos
    if (!quantity || !unitPrice || !totalPrice) {
      return NextResponse.json(
        { error: 'Datos requeridos faltantes' },
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
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mercadopago/webhooks`,
      external_reference: `form_credits_${Date.now()}`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      statement_descriptor: 'FastForm',
      binary_mode: true, // Solo pagos aprobados o rechazados
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });

  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 