#!/usr/bin/env node

/**
 * Script de diagnóstico SEO para FastForm
 * Ejecutar con: node scripts/seo-diagnostico.js
 */

const https = require('https');

const baseUrl = 'https://fastform.pro';
const tests = [
  { url: '/', name: 'Homepage', critical: true },
  { url: '/sitemap.xml', name: 'Sitemap', critical: true },
  { url: '/robots.txt', name: 'Robots.txt', critical: true },
  { url: '/dashboard', name: 'Dashboard', critical: true },
  { url: '/pricing', name: 'Pricing', critical: true },
  { url: '/blog', name: 'Blog Index', critical: false },
  { url: '/blog/csv-a-google-forms-guia', name: 'Blog: CSV a Google Forms', critical: false },
  { url: '/rss.xml', name: 'RSS Feed', critical: false }
];

console.log('🔍 DIAGNÓSTICO SEO DE FASTFORM');
console.log('================================\n');

function checkUrl(url, name, critical = false) {
  return new Promise((resolve) => {
    const fullUrl = `${baseUrl}${url}`;
    
    https.get(fullUrl, (res) => {
      const status = res.statusCode;
      const emoji = status === 200 ? '✅' : '❌';
      const priority = critical ? '🔥 CRÍTICO' : 'ℹ️  OPCIONAL';
      
      console.log(`${emoji} ${name} (${status})`);
      console.log(`   URL: ${fullUrl}`);
      console.log(`   Prioridad: ${priority}`);
      
      if (status !== 200 && critical) {
        console.log(`   ⚠️  ACCIÓN REQUERIDA: Este endpoint es crítico para SEO`);
      }
      
      // Análisis específico por tipo
      if (url === '/sitemap.xml' && status === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const urlCount = (data.match(/<url>/g) || []).length;
          console.log(`   📊 URLs en sitemap: ${urlCount || 0}`);
          if (urlCount === 0) {
            console.log(`   ⚠️  PROBLEMA: El sitemap está vacío o mal formado`);
          }
        });
      }
      
      console.log('');
      resolve({ url, status, critical, name });
    }).on('error', (err) => {
      console.log(`❌ ${name} - ERROR: ${err.message}`);
      console.log(`   Prioridad: ${critical ? '🔥 CRÍTICO' : 'ℹ️  OPCIONAL'}`);
      console.log('');
      resolve({ url, status: 'ERROR', critical, name, error: err.message });
    });
  });
}

async function runDiagnostic() {
  const results = [];
  
  for (const test of tests) {
    const result = await checkUrl(test.url, test.name, test.critical);
    results.push(result);
  }
  
  // Resumen
  console.log('📋 RESUMEN DEL DIAGNÓSTICO');
  console.log('===========================\n');
  
  const criticalErrors = results.filter(r => r.critical && (r.status !== 200));
  const optionalErrors = results.filter(r => !r.critical && (r.status !== 200));
  const working = results.filter(r => r.status === 200);
  
  console.log(`✅ Funcionando correctamente: ${working.length}/${results.length}`);
  console.log(`🔥 Errores críticos: ${criticalErrors.length}`);
  console.log(`ℹ️  Errores opcionales: ${optionalErrors.length}\n`);
  
  if (criticalErrors.length > 0) {
    console.log('🚨 ERRORES CRÍTICOS QUE DEBES ARREGLAR:');
    criticalErrors.forEach(error => {
      console.log(`   - ${error.name}: ${error.url} (${error.status})`);
    });
    console.log('');
  }
  
  // Próximos pasos
  console.log('🎯 PRÓXIMOS PASOS EN GOOGLE SEARCH CONSOLE:');
  console.log('1. Ve a https://search.google.com/search-console');
  console.log('2. Selecciona tu propiedad: https://fastform.pro');
  console.log('3. Envía el sitemap: sitemap.xml');
  console.log('4. Solicita indexación de páginas principales');
  console.log('5. Revisa errores en la sección "Páginas"');
  
  if (criticalErrors.length === 0) {
    console.log('\n🎉 ¡Tu configuración SEO básica está funcionando correctamente!');
  } else {
    console.log('\n⚠️  Arregla los errores críticos antes de continuar.');
  }
}

runDiagnostic().catch(console.error);