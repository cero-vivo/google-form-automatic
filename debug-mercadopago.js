#!/usr/bin/env node

/**
 * Script de diagnóstico para Mercado Pago
 * Ejecutar: node debug-mercadopago.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico de Mercado Pago');
console.log('================================\n');

// 1. Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ No definida');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('VERCEL_URL:', process.env.VERCEL_URL || '❌ No definida');
console.log('MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Definida' : '❌ No definida');

// Validar formato del token
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (accessToken) {
    console.log('\n🔐 Validación del Access Token:');
    console.log('Formato:', accessToken.startsWith('TEST-') ? '⚠️  SANDBOX' : accessToken.startsWith('APP_USR-') ? '✅ PRODUCCIÓN' : '❌ FORMATO INVÁLIDO');
    console.log('Longitud:', accessToken.length > 50 ? '✅ Adecuada' : '❌ Muy corta');
  } else {
    console.log('\n❌ No hay token de acceso definido');
  }
console.log('');

// 2. Verificar archivos .env
const envFiles = ['.env.local', '.env.production', '.env.development'];
envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('NEXT_PUBLIC_BASE_URL')) {
      const match = content.match(/NEXT_PUBLIC_BASE_URL=(.+)/);
      console.log(`   NEXT_PUBLIC_BASE_URL: ${match ? match[1] : '❌ No encontrado'}`);
    }
  } else {
    console.log(`❌ ${file} no existe`);
  }
});
console.log('');

// 3. Verificar URLs de retorno
const baseUrl = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`)
  : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

console.log('🔗 URLs de retorno calculadas:');
console.log('Base URL:', baseUrl);
console.log('Success:', `${baseUrl}/checkout/success`);
console.log('Failure:', `${baseUrl}/checkout/failure`);
console.log('Pending:', `${baseUrl}/checkout/pending`);
console.log('Webhook:', `${baseUrl}/api/mercadopago/webhooks`);
console.log('');

// 4. Verificar rutas en el proyecto
const routes = [
  'src/app/api/mercadopago/create-preference/route.ts',
  'src/app/checkout/success/page.tsx',
  'src/app/checkout/failure/page.tsx',
  'src/app/checkout/pending/page.tsx',
  'src/app/api/mercadopago/webhooks/route.ts'
];

console.log('📁 Rutas del proyecto:');
routes.forEach(route => {
  const filePath = path.join(__dirname, route);
  console.log(`${fs.existsSync(filePath) ? '✅' : '❌'} ${route}`);
});
console.log('');

// 5. Recomendaciones
console.log('💡 Recomendaciones:');
console.log('1. Asegúrate de que NEXT_PUBLIC_BASE_URL esté configurada en Vercel');
console.log('2. Verifica que el dominio esté correctamente registrado en Mercado Pago');
console.log('3. Prueba en desarrollo con ngrok: ngrok http 3002');
console.log('4. Revisa los logs de la función create-preference');
console.log('');

// 6. Comando para probar la API
console.log('🧪 Para probar la API:');
console.log(`curl -X POST ${baseUrl}/api/mercadopago/create-preference \\
  -H "Content-Type: application/json" \\
  -d '{"quantity": 10, "totalPrice": 1000, "packSize": "PRO"}'`);