/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fastform.pro',
  generateRobotsTxt: false, // Ya tenemos robots.txt manual optimizado
  generateIndexSitemap: true,
  exclude: [
    '/dashboard*',
    '/api/*',
    '/auth/*',
    '/checkout/*',
    '/_next/*',
    '/admin/*'
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://fastform.pro/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Prioridades personalizadas por ruta
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/create')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.startsWith('/blog')) {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path.startsWith('/pricing') || path.startsWith('/about')) {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path.startsWith('/legals')) {
      priority = 0.3;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `https://fastform.pro/es${path}`,
          hreflang: 'es',
        },
        {
          href: `https://fastform.pro/en${path}`,
          hreflang: 'en',
        },
      ],
    };
  },
};
