#!/usr/bin/env node

/**
 * Script para obtener credenciales de sandbox de Mercado Pago
 * 
 * INSTRUCCIONES:
 * 1. Ve a https://www.mercadopago.com.ar/developers/panel
 * 2. Inicia sesión con tu cuenta de Mercado Pago
 * 3. Ve a "Credenciales" > "Sandbox"
 * 4. Copia las credenciales y reemplaza en tu .env.local
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 OBTENER CREDENCIALES DE MERCADO PAGO SANDBOX\n');
console.log('📋 PASOS PARA OBTENER TUS CREDENCIALES REALES:\n');
console.log('1. Abre https://www.mercadopago.com.ar/developers/panel');
console.log('2. Inicia sesión con tu cuenta de Mercado Pago');
console.log('3. Ve a "Credenciales" > "Sandbox"');
console.log('4. Copia las siguientes credenciales:\n');

const envPath = path.join(process.cwd(), '.env.local');

// Verificar si el archivo existe
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Buscar credenciales actuales
  const currentAccessToken = envContent.match(/MERCADOPAGO_ACCESS_TOKEN=(.*)/);
  const currentPublicKey = envContent.match(/MERCADOPAGO_PUBLIC_KEY=(.*)/);
  
  console.log('📄 Credenciales actuales en .env.local:');
  console.log(`Access Token: ${currentAccessToken ? currentAccessToken[1] : 'No encontrado'}`);
  console.log(`Public Key: ${currentPublicKey ? currentPublicKey[1] : 'No encontrado'}\n`);
  
  console.log('⚠️  IMPORTANTE: Reemplaza las credenciales placeholder con las reales de tu panel de desarrollador\n');
} else {
  console.log('❌ No se encontró el archivo .env.local');
}

console.log('📝 EJEMPLO DE CÓDIGO PARA REEMPLAZAR EN .env.local:');
console.log('```');
console.log('# MERCADO PAGO - SANDBOX REALES');
console.log('MERCADOPAGO_ACCESS_TOKEN=TEST-TU_ACCESS_TOKEN_REAL');
console.log('MERCADOPAGO_PUBLIC_KEY=TEST-TU_PUBLIC_KEY_REAL');
console.log('```\n');

console.log('🔍 PARA VERIFICAR LAS CREDENCIALES:');
console.log('1. Después de reemplazar las credenciales, ejecuta:');
console.log('   node debug-mercadopago.js');
console.log('2. Deberías ver "isSandbox: true" en los logs');
console.log('3. Prueba un pago con tarjetas de prueba:\n');

console.log('💳 TARJETAS DE PRUEBA RECOMENDADAS:');
console.log('✅ APRO: 5031 7557 3453 0604');
console.log('❌ OTHE: 5031 7557 3453 0604 (pero cambia el CVV a 123)');
console.log('⏳ PEND: 5031 7557 3453 0604 (pero cambia el CVV a 123)');
console.log('');

console.log('🎯 UNA VEZ CONFIGURADO:');
console.log('1. Reinicia tu servidor de desarrollo');
console.log('2. Intenta crear un pago nuevamente');
console.log('3. Verifica que el token comience con "TEST-" en los logs');