import { NextRequest, NextResponse } from 'next/server';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/infrastructure/firebase/config';

/**
 * Endpoint para refrescar el access token de Google usando el refresh token
 * 
 * POST /api/auth/refresh-google-token
 * Body: { userId: string }
 * 
 * Retorna: { accessToken: string, expiresIn: number } | { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    // Obtener refresh token del usuario
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const refreshToken = userData.googleRefreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { 
          error: 'No hay refresh token disponible',
          requiresReauth: true 
        },
        { status: 401 }
      );
    }

    // Refrescar el token usando la API de Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('❌ Error refrescando token:', errorData);
      
      // Si el refresh token es inválido, solicitar re-autenticación
      if (errorData.error === 'invalid_grant') {
        return NextResponse.json(
          { 
            error: 'Refresh token inválido o revocado',
            requiresReauth: true 
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Error al refrescar token' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const newAccessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600; // Por defecto 1 hora
    const newExpiry = new Date(Date.now() + expiresIn * 1000);

    // Actualizar el access token en Firestore
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      googleAccessToken: newAccessToken,
      googleTokenExpiry: newExpiry,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn,
      expiryDate: newExpiry.toISOString(),
    });

  } catch (error) {
    console.error('❌ Error en refresh-google-token:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
