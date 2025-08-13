import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { CreditsService } from '@/infrastructure/firebase/credits-service';

// Configurar Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const client = new MercadoPagoConfig({ 
  accessToken: accessToken || 'test_token',
  options: { timeout: 5000 }
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar que sea una notificación de Mercado Pago
    if (body.type !== 'payment') {
      console.log('⏭️ Webhook ignorado - tipo no es payment:', body.type);
      return NextResponse.json({ status: 'ignored' });
    }

    const paymentId = body.data.id;
    
    console.log('🔄 Webhook recibido de Mercado Pago:', {
      type: body.type,
      paymentId: paymentId,
      timestamp: new Date().toISOString()
    });

    // Obtener información del pago desde Mercado Pago
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    console.log('📊 Estado del pago desde webhook:', {
      status: paymentData.status,
      externalReference: paymentData.external_reference,
      amount: paymentData.transaction_amount
    });

    // Validar datos del pago
    if (!paymentData.transaction_amount) {
      console.error('❌ Monto del pago no disponible');
      return NextResponse.json(
        { error: 'Monto del pago no disponible' },
        { status: 400 }
      );
    }

    // Solo procesar si el pago está aprobado
    if (paymentData.status === 'approved') {
      // Extraer información del external_reference
      const externalReference = paymentData.external_reference;
      
      if (!externalReference) {
        console.error('❌ No se encontró external_reference en el pago');
        return NextResponse.json(
          { error: 'external_reference faltante' },
          { status: 400 }
        );
      }

      // El external_reference contiene userId y purchaseInfo
      const [userId, packSize, quantity] = externalReference.split('_');
      
      if (!userId || !quantity) {
        console.error('❌ Formato inválido en external_reference');
        return NextResponse.json(
          { error: 'Formato inválido en external_reference' },
          { status: 400 }
        );
      }

      // Validar y crear objeto de compra
       const validatedQuantity = parseInt(quantity);
       const validatedPackSize = parseInt(packSize || '50'); // Valor por defecto 50
       const validatedTotalPrice = paymentData.transaction_amount || 0;
       
       const purchase = {
         quantity: validatedQuantity,
         packSize: validatedPackSize,
         unitPrice: Math.round(validatedTotalPrice / validatedQuantity),
         totalPrice: validatedTotalPrice,
         discountPercent: 0
       };

      // Verificar si ya fue procesado
      const userCredits = await CreditsService.getUserCredits(userId);
      const alreadyProcessed = userCredits?.history?.some(
        (transaction: any) => transaction.paymentId === paymentId
      );

      if (alreadyProcessed) {
        console.log('⚠️ Pago ya procesado previamente');
        return NextResponse.json({ 
          status: 'success',
          message: 'Pago ya procesado'
        });
      }

      // Agregar créditos al usuario
      
      await CreditsService.addCreditsAfterPurchase(userId, {
        ...purchase,
        packSize: purchase.packSize.toString()
      }, paymentId);

      console.log(`✅ Créditos agregados exitosamente para usuario ${userId}: ${purchase.quantity} créditos`);
      
      return NextResponse.json({ 
        status: 'success',
        message: 'Créditos agregados exitosamente',
        userId: userId,
        creditsAdded: purchase.quantity
      });

    } else {
      console.log(`⚠️ Pago no aprobado. Estado: ${paymentData.status}`);
      return NextResponse.json({ 
        status: 'ignored',
        message: `Pago no aprobado - estado: ${paymentData.status}`
      });
    }

  } catch (error) {
    console.error('❌ Error procesando webhook de Mercado Pago:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}