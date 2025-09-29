import { NextResponse } from 'next/server';

export async function GET() {
  // Este endpoint permite verificación dinámica de Google Search Console
  // Reemplaza GOOGLE_VERIFICATION_CODE con tu código específico
  const verificationCode = process.env.GOOGLE_SITE_VERIFICATION || 'REPLACE_WITH_YOUR_CODE';
  
  const html = `google-site-verification: google${verificationCode}.html`;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}