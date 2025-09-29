import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://fastform.pro';
  const currentDate = new Date().toISOString();
  
  // URLs estáticas principales
  const staticUrls = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
    { url: '/dashboard', priority: '0.9', changefreq: 'weekly' },
    { url: '/create/ai', priority: '0.9', changefreq: 'weekly' },
    { url: '/create/file', priority: '0.9', changefreq: 'weekly' },
    { url: '/create/manual', priority: '0.9', changefreq: 'weekly' },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/docs', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog', priority: '0.7', changefreq: 'weekly' },
    // Páginas de autenticación
    { url: '/auth/login', priority: '0.6', changefreq: 'monthly' },
    { url: '/auth/register', priority: '0.6', changefreq: 'monthly' },
    // Páginas legales
    { url: '/legals/pp', priority: '0.4', changefreq: 'yearly' },
    { url: '/legals/ttcc', priority: '0.4', changefreq: 'yearly' },
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Agregar URLs estáticas
  staticUrls.forEach(page => {
    sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  sitemapXml += `
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
