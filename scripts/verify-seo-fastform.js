#!/usr/bin/env node

/**
 * Script de verificación SEO para FastForm
 * Verifica que todas las optimizaciones estén implementadas correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando optimizaciones SEO de FastForm (Fast Form)...\n');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// 1. Verificar robots.txt
console.log('📄 Verificando robots.txt...');
const robotsPath = path.join(__dirname, '../public/robots.txt');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (robotsContent.includes('fastform') || robotsContent.includes('fast form')) {
    checks.passed.push('✅ robots.txt existe y contiene referencias a FastForm');
  } else {
    checks.warnings.push('⚠️  robots.txt existe pero no contiene referencias explícitas a FastForm');
  }
  if (robotsContent.includes('Sitemap:')) {
    checks.passed.push('✅ robots.txt contiene referencia a sitemap');
  } else {
    checks.failed.push('❌ robots.txt no contiene referencia a sitemap');
  }
} else {
  checks.failed.push('❌ robots.txt no encontrado');
}

// 2. Verificar sitemap
console.log('🗺️  Verificando sitemap...');
const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  checks.passed.push('✅ sitemap.ts existe');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const importantPages = ['/create', '/create/ai', '/create/file', '/blog', '/about'];
  const missingPages = importantPages.filter(page => !sitemapContent.includes(page));
  
  if (missingPages.length === 0) {
    checks.passed.push('✅ Sitemap incluye todas las páginas importantes');
  } else {
    checks.warnings.push(`⚠️  Sitemap no incluye: ${missingPages.join(', ')}`);
  }
} else {
  checks.failed.push('❌ sitemap.ts no encontrado');
}

// 3. Verificar layout.tsx
console.log('📱 Verificando layout.tsx...');
const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  
  // Verificar metadata
  if (layoutContent.includes('FastForm') && layoutContent.includes('Fast Form')) {
    checks.passed.push('✅ layout.tsx contiene ambas variantes de marca');
  } else {
    checks.failed.push('❌ layout.tsx no contiene ambas variantes (FastForm y Fast Form)');
  }
  
  // Verificar alternateName
  if (layoutContent.includes('alternateName')) {
    checks.passed.push('✅ Schema.org incluye alternateName');
  } else {
    checks.failed.push('❌ Schema.org no incluye alternateName');
  }
  
  // Verificar keywords
  const keywordsToCheck = ['fastform', 'fast form', 'fastform ia', 'fast form ia'];
  const hasAllKeywords = keywordsToCheck.every(keyword => 
    layoutContent.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (hasAllKeywords) {
    checks.passed.push('✅ Metadata incluye todas las keywords importantes');
  } else {
    checks.warnings.push('⚠️  Algunas keywords importantes podrían faltar');
  }
  
  // Verificar OpenGraph
  if (layoutContent.includes('openGraph:')) {
    checks.passed.push('✅ OpenGraph metadata presente');
  } else {
    checks.failed.push('❌ OpenGraph metadata no encontrada');
  }
} else {
  checks.failed.push('❌ layout.tsx no encontrado');
}

// 4. Verificar site.webmanifest
console.log('📲 Verificando site.webmanifest...');
const manifestPath = path.join(__dirname, '../public/site.webmanifest');
if (fs.existsSync(manifestPath)) {
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  if (manifestContent.includes('FastForm') && manifestContent.includes('fast form')) {
    checks.passed.push('✅ site.webmanifest optimizado con variantes de marca');
  } else {
    checks.warnings.push('⚠️  site.webmanifest podría mejorar con variantes de marca');
  }
} else {
  checks.warnings.push('⚠️  site.webmanifest no encontrado');
}

// 5. Verificar página about
console.log('ℹ️  Verificando página about...');
const aboutPath = path.join(__dirname, '../src/app/about/page.tsx');
if (fs.existsSync(aboutPath)) {
  const aboutContent = fs.readFileSync(aboutPath, 'utf-8');
  if (aboutContent.includes('FastForm') && aboutContent.includes('fast form')) {
    checks.passed.push('✅ Página about optimizada con variantes de marca');
  } else {
    checks.warnings.push('⚠️  Página about podría mejorar con más variantes');
  }
} else {
  checks.warnings.push('⚠️  Página about no encontrada');
}

// 6. Verificar nueva página de blog "¿Qué es FastForm?"
console.log('📝 Verificando nueva página de blog...');
const blogPath = path.join(__dirname, '../src/app/blog/que-es-fastform/page.tsx');
if (fs.existsSync(blogPath)) {
  checks.passed.push('✅ Nueva página de blog "¿Qué es FastForm?" creada');
} else {
  checks.warnings.push('⚠️  Página de blog "¿Qué es FastForm?" no encontrada');
}

// Imprimir resultados
console.log('\n' + '='.repeat(60));
console.log('📊 RESULTADOS DE LA VERIFICACIÓN SEO');
console.log('='.repeat(60) + '\n');

if (checks.passed.length > 0) {
  console.log('✅ PASADAS (' + checks.passed.length + '):');
  checks.passed.forEach(check => console.log('   ' + check));
  console.log('');
}

if (checks.warnings.length > 0) {
  console.log('⚠️  ADVERTENCIAS (' + checks.warnings.length + '):');
  checks.warnings.forEach(check => console.log('   ' + check));
  console.log('');
}

if (checks.failed.length > 0) {
  console.log('❌ FALLIDAS (' + checks.failed.length + '):');
  checks.failed.forEach(check => console.log('   ' + check));
  console.log('');
}

// Score
const total = checks.passed.length + checks.warnings.length + checks.failed.length;
const score = Math.round((checks.passed.length / total) * 100);

console.log('='.repeat(60));
console.log(`📈 SCORE SEO: ${score}%`);
console.log('='.repeat(60));

if (score >= 90) {
  console.log('\n🎉 ¡Excelente! Tu SEO está muy bien optimizado.');
} else if (score >= 70) {
  console.log('\n👍 Buen trabajo, pero hay espacio para mejorar.');
} else {
  console.log('\n⚠️  Necesitas trabajar más en las optimizaciones SEO.');
}

console.log('\n📚 Siguiente paso: Ejecutar análisis SEO completo con:');
console.log('   npm run seo-check');
console.log('\n💡 Documentación completa en: SEO_STRATEGY.md\n');

// Exit code
process.exit(checks.failed.length > 0 ? 1 : 0);
