import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '@/application/services/plan-service';

export async function GET(request: NextRequest) {
  try {
    // Obtener todos los planes activos
    const plans = await PlanService.getActivePlans();

    return NextResponse.json({
      success: true,
      plans: plans.map(plan => plan.toSafeJSON()),
      message: 'Planes obtenidos exitosamente',
    });

  } catch (error: any) {
    console.error('❌ Error getting plans:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener planes',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 