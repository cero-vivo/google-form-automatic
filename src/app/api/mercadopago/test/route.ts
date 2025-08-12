import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    return NextResponse.json({
      status: 'ok',
      mercadopagoConfigured: !!accessToken,
      hasAccessToken: accessToken ? 'Sí' : 'No',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      message: accessToken 
        ? 'Mercado Pago está configurado correctamente' 
        : 'Mercado Pago NO está configurado. Crea un archivo .env.local con MERCADOPAGO_ACCESS_TOKEN'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 