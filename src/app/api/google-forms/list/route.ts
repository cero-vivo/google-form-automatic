import { NextRequest, NextResponse } from 'next/server';
import { googleFormsService } from '@/infrastructure/google/google-forms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    // Validar datos requeridos
    if (!accessToken) {
      return NextResponse.json(
        { error: 'accessToken es requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Obteniendo formularios del usuario...');

    // Obtener formularios usando el servicio
    const forms = await googleFormsService.getUserForms(accessToken);

    console.log(`✅ ${forms.length} formularios obtenidos exitosamente`);

    return NextResponse.json({
      success: true,
      data: forms
    });

  } catch (error: any) {
    console.error('❌ Error en API de lista de formularios:', error);

    // Manejar errores específicos
    if (error.message.includes('Token de acceso inválido') || error.message.includes('invalid_grant')) {
      return NextResponse.json(
        { error: 'Token de acceso inválido o expirado' },
        { status: 401 }
      );
    }

    if (error.message.includes('Permisos insuficientes') || error.message.includes('insufficient_scope')) {
      return NextResponse.json(
        { error: 'Permisos insuficientes para acceder a Google Forms' },
        { status: 403 }
      );
    }

    if (error.message.includes('límite de API')) {
      return NextResponse.json(
        { error: 'Límite de API alcanzado. Inténtalo más tarde' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido. Usa POST.' },
    { status: 405 }
  );
} 