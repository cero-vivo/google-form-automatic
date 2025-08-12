import { NextRequest, NextResponse } from 'next/server';
import { mercadopagoService } from '@/infrastructure/mercadopago/mercadopago-service';
import { PlanService } from '@/application/services/plan-service';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Por ahora, asumimos que el token es válido
    // En producción, deberías verificar el token con Firebase Admin SDK
    const userId = token; // Esto es temporal, deberías decodificar el token real

    const { planId, isAnnual = false, metadata } = await request.json();

    // Validar parámetros
    if (!planId) {
      return NextResponse.json(
        { error: 'planId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el plan existe
    const plan = await PlanService.getPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario puede crear la suscripción
    const canCreateForm = await PlanService.canCreateForm(userId);
    if (!canCreateForm) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de formularios para tu plan actual' },
        { status: 403 }
      );
    }

    // Crear sesión de checkout en Mercado Pago
    const checkoutSession = await mercadopagoService.createCheckoutSession({
      customerId: userId,
      planId,
      priceId: plan.stripePriceId, // Reutilizamos este campo para compatibilidad
      isAnnual,
      metadata,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.init_point,
      preferenceId: checkoutSession.id,
      message: 'Sesión de checkout creada exitosamente',
    });

  } catch (error: any) {
    console.error('❌ Error creating subscription:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al crear suscripción',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 