#!/usr/bin/env node

/**
 * Script de verificación de configuración de Mercado Pago
 * Este script ayuda a diagnosticar problemas comunes con Mercado Pago
 */

const https = require('https');
const http = require('http');

console.log('🔍 Verificando configuración de Mercado Pago...\n');

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ No definido');
console.log('MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Definido' : '❌ No definido');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Verificar URLs de retorno
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const urls = [
  `${baseUrl}/checkout/success`,
  `${baseUrl}/checkout/failure`,
  `${baseUrl}/checkout/pending`,
  `${baseUrl}/api/mercadopago/webhooks`
];

console.log('\n🌐 Verificando URLs de retorno:');

function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      console.log(`${url}: ${res.statusCode === 200 ? '✅' : '⚠️'} Status ${res.statusCode}`);
      resolve();
    }).on('error', (err) => {
      console.log(`${url}: ❌ Error - ${err.message}`);
      resolve();
    });
  });
}

// Verificar todas las URLs
Promise.all(urls.map(checkUrl)).then(() => {
  console.log('\n💡 Recomendaciones:');
  console.log('1. Asegúrate de que NEXT_PUBLIC_BASE_URL use el mismo puerto que tu app');
  console.log('2. En producción, usa HTTPS y tu dominio real');
  console.log('3. Verifica que Mercado Pago tenga acceso a tu webhook');
  console.log('4. Para desarrollo, considera usar ngrok para URLs públicas');
  
  console.log('\n📚 Documentación:');
  console.log('- MERCADOPAGO_SETUP.md: Instrucciones de configuración');
  console.log('- MERCADOPAGO_TROUBLESHOOTING.md: Guía de resolución de problemas');
});