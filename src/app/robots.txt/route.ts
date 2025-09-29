import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap location
Sitemap: https://fastform.pro/sitemap.xml

# Allow access to important public pages
Allow: /dashboard
Allow: /docs
Allow: /pricing
Allow: /about
Allow: /faq
Allow: /blog
Allow: /create
Allow: /auth/login
Allow: /auth/register
Allow: /checkout
Allow: /legals/

# Allow static assets
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.svg$
Allow: /*.gif$
Allow: /*.webp$

# Disallow sensitive or internal pages
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /dashboard/*/settings
Disallow: /dashboard/*/private
Disallow: /*.json$
Disallow: /debug-*
Disallow: /test-*

# Specific bot rules
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Crawl delay (seconds between requests)
Crawl-delay: 1

# Host directive
Host: https://fastform.pro`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}