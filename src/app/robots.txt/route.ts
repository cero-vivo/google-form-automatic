import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://fastform.pro/sitemap.xml

# Allow access to important pages
Allow: /dashboard
Allow: /create
Allow: /docs
Allow: /pricing
Allow: /auth/login

# Disallow admin or private pages (if any)
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# Crawl delay
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 