import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://fastform.pro';
  const currentDate = new Date().toISOString();
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FastForm - Crea Google Forms en Segundos</title>
    <link>${baseUrl}</link>
    <description>Noticias y actualizaciones sobre FastForm, la plataforma #1 de inteligencia artificial para crear Google Forms ultrarrápidos.</description>
    <language>es-ES</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/icons/logo.svg</url>
      <title>FastForm</title>
      <link>${baseUrl}</link>
    </image>
    
    <item>
      <title>FastForm - Crea Google Forms con IA en Segundos | Plataforma Inteligente</title>
      <link>${baseUrl}</link>
      <description>Descubre cómo FastForm revoluciona la creación de Google Forms con inteligencia artificial ultrarrápida. Genera formularios en segundos, no horas.</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${baseUrl}#main</guid>
    </item>
    
    <item>
      <title>Guía Completa: Cómo Convertir CSV a Google Forms</title>
      <link>${baseUrl}/blog/csv-a-google-forms-guia</link>
      <description>Aprende paso a paso cómo convertir archivos CSV a Google Forms de manera automática. Guía completa con ejemplos y mejores prácticas.</description>
      <pubDate>2025-09-29T00:00:00.000Z</pubDate>
      <guid>${baseUrl}/blog/csv-a-google-forms-guia</guid>
    </item>
    
    <item>
      <title>Crear Formularios con IA: El Futuro de Google Forms</title>
      <link>${baseUrl}/blog/crear-formularios-ia</link>
      <description>Descubre cómo la inteligencia artificial está revolucionando la creación de formularios. Crea Google Forms inteligentes en segundos.</description>
      <pubDate>2025-09-29T00:00:00.000Z</pubDate>
      <guid>${baseUrl}/blog/crear-formularios-ia</guid>
    </item>
    
    <item>
      <title>3 Métodos para Crear Google Forms: Manual, CSV y con IA</title>
      <link>${baseUrl}/blog/3-metodos-crear-google-forms</link>
      <description>Compara los 3 métodos principales para crear Google Forms: manual, desde CSV y con inteligencia artificial. ¿Cuál es mejor?</description>
      <pubDate>2025-09-29T00:00:00.000Z</pubDate>
      <guid>${baseUrl}/blog/3-metodos-crear-google-forms</guid>
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