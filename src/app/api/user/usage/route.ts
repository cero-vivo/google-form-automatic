import { NextRequest, NextResponse } from 'next/server';
import { PlanService } from '@/application/services/plan-service';

export async function GET(request: NextRequest) {
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

    // Obtener estadísticas de uso
    const usageStats = await PlanService.getUserUsageStats(userId);

    // Verificar si necesita upgrade
    const upgradeInfo = await PlanService.needsUpgrade(userId);

    return NextResponse.json({
      success: true,
      usage: usageStats,
      upgrade: upgradeInfo,
      message: 'Estadísticas de uso obtenidas exitosamente',
    });

  } catch (error: any) {
    console.error('❌ Error getting user usage:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener estadísticas de uso',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 