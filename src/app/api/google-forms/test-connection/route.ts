import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Endpoint para verificar la conexión con Google Forms API
 * Usa credenciales de servicio en lugar de OAuth2
 */
export async function GET(request: NextRequest) {
  try {
    // Configurar cliente de Google con credenciales de servicio
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/forms',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    // Usar Google Drive API para listar formularios
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.form'",
      pageSize: 1,
      fields: 'files(id,name)',
    });

    // Si llegamos aquí, la conexión es válida
    return NextResponse.json({
      valid: true,
      hasForms: response.data.files && response.data.files.length > 0,
      formsCount: response.data.files?.length || 0,
      message: 'Conexión exitosa con Google Forms API'
    });

  } catch (error: any) {
    console.error('Error verificando conexión con Google Forms:', error);

    // Manejar errores específicos de autorización
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json(
        { error: 'invalid_grant', message: 'Los permisos han expirado' },
        { status: 401 }
      );
    }

    if (error.code === 403 || error.message?.includes('insufficient_scope')) {
      return NextResponse.json(
        { error: 'insufficient_scope', message: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    // Otros errores (red, configuración, etc.)
    return NextResponse.json(
      { error: 'connection_error', message: error.message || 'Error de conexión' },
      { status: 500 }
    );
  }
}