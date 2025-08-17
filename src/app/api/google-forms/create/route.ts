import { NextRequest, NextResponse } from 'next/server';
import { googleFormsService } from '@/infrastructure/google/google-forms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, accessToken } = body;

    // Validar datos requeridos
    if (!formData || !accessToken) {
      return NextResponse.json(
        { error: 'formData y accessToken son requeridos' },
        { status: 400 }
      );
    }

    // Validar estructura de formData
    if (!formData.title || !Array.isArray(formData.questions)) {
      return NextResponse.json(
        { error: 'formData debe contener title y questions array' },
        { status: 400 }
      );
    }

    console.log('📋 Datos recibidos:', JSON.stringify(formData, null, 2));
    
    if (formData.questions) {
      formData.questions.forEach((q: any, i: number) => {
        console.log(`📊 Pregunta ${i + 1}:`, {
          type: q.type,
          title: q.title
        });
      });
    }

    // Crear el formulario usando el servicio
    const result = await googleFormsService.createForm(formData, accessToken);

    console.log('✅ Formulario creado exitosamente:', result.formId);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('❌ Error en API de Google Forms:', error);

    // Manejar errores específicos
    if (error.message.includes('Token de acceso inválido')) {
      return NextResponse.json(
        { error: 'Token de acceso inválido o expirado' },
        { status: 401 }
      );
    }

    if (error.message.includes('Permisos insuficientes')) {
      return NextResponse.json(
        { error: 'Permisos insuficientes para crear formularios' },
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
    { message: 'API de Google Forms activa' },
    { status: 200 }
  );
}