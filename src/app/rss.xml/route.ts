import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://fastform.pro';
  const currentDate = new Date().toISOString();
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FastForm - Convertir CSV y Excel a Google Forms</title>
    <link>${baseUrl}</link>
    <description>Noticias y actualizaciones sobre FastForm, la herramienta #1 para convertir CSV y Excel a Google Forms automáticamente.</description>
    <language>es-ES</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/icons/logo.svg</url>
      <title>FastForm</title>
      <link>${baseUrl}</link>
    </image>
    
    <item>
      <title>FastForm - La mejor herramienta para convertir CSV a Google Forms</title>
      <link>${baseUrl}</link>
      <description>Descubre cómo FastForm revoluciona la forma de crear Google Forms desde archivos CSV y Excel. Gratuito, rápido y con IA.</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}#main</guid>
    </item>
    
    <item>
      <title>Dashboard FastForm - Gestiona todos tus formularios</title>
      <link>${baseUrl}/dashboard</link>
      <description>Accede a tu dashboard personalizado para gestionar, editar y monitorear todos tus Google Forms creados con FastForm.</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}/dashboard#main</guid>
    </item>
    
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
    },
  });
}