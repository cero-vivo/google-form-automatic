#!/usr/bin/env node

/**
 * Script para verificar la configuración SEO de FastForm
 * Ejecutar con: node scripts/seo-check.js
 */

const https = require('https');
const fs = require('fs');

const baseUrl = 'https://fastform.pro';
const endpoints = [
  '/',
  '/sitemap.xml',
  '/robots.txt',
  '/rss.xml',
  '/dashboard',
  '/pricing'
];

console.log('🔍 Verificando configuración SEO de FastForm...\n');

async function checkEndpoint(url) {
  return new Promise((resolve) => {
    const fullUrl = `${baseUrl}${url}`;
    
    https.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        const contentType = res.headers['content-type'];
        
        console.log(`✅ ${fullUrl}`);
        console.log(`   Status: ${status}`);
        console.log(`   Content-Type: ${contentType}`);
        
        // Verificaciones específicas
        if (url === '/sitemap.xml') {
          const urlCount = (data.match(/<url>/g) || []).length;
          console.log(`   URLs en sitemap: ${urlCount}`);
        }
        
        if (url === '/robots.txt') {
          const hasSitemap = data.includes('Sitemap:');
          console.log(`   Sitemap declarado: ${hasSitemap ? '✅' : '❌'}`);
        }
        
        if (url === '/') {
          const hasGoogleVerification = data.includes('google-site-verification');
          const hasStructuredData = data.includes('application/ld+json');
          const hasOpenGraph = data.includes('og:title');
          
          console.log(`   Google Verification: ${hasGoogleVerification ? '✅' : '❌'}`);
          console.log(`   Structured Data: ${hasStructuredData ? '✅' : '❌'}`);
          console.log(`   Open Graph: ${hasOpenGraph ? '✅' : '❌'}`);
        }
        
        console.log('');
        resolve();
      });
      
    }).on('error', (err) => {
      console.log(`❌ ${fullUrl} - Error: ${err.message}\n`);
      resolve();
    });
  });
}

async function runChecks() {
  console.log('📋 Verificando endpoints...\n');
  
  for (const endpoint of endpoints) {
    await checkEndpoint(endpoint);
  }
  
  console.log('✨ Verificación completada!\n');
  
  console.log('📝 Próximos pasos:');
  console.log('1. Reemplaza REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE en layout.tsx');
  console.log('2. Ve a Google Search Console y verifica tu sitio');
  console.log('3. Envía el sitemap: https://fastform.pro/sitemap.xml');
  console.log('4. Monitorea la indexación y corrige errores');
  console.log('5. Considera configurar Google Analytics 4');
}

runChecks().catch(console.error);