import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { GoogleAuthProvider } from "@/providers/GoogleAuthProvider";
import { Footer } from "@/components/ui/footer";
import { FloatingFeedbackButton } from "@/components/FloatingFeedbackButton";
import { AppToaster } from "@/components/ui/app-toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FastForm (Fast Form) | Crea Google Forms en Segundos - Plataforma #1",
  description: "FastForm (fast form): Crea Google Forms con inteligencia artificial en segundos. Plataforma ultrarrápida y gratuita que automatiza formularios desde CSV, Excel o con IA. Sin código, máxima velocidad.",
  keywords: [
    // Marca y variantes
    "fastform",
    "fast form",
    "fastform app",
    "fast form app",
    "fastform ia",
    "fast form ia",
    "fastform gratis",
    "fast form gratis",
    // Google Forms IA
    "crear google forms con ia",
    "google forms inteligencia artificial",
    "generador formularios ia",
    "crear formularios rapido",
    "automatizar google forms",
    "google forms en segundos",
    "formularios con ai",
    "crear forms automatico",
    // Conversión archivos
    "csv a google forms",
    "excel a google forms",
    "convertir excel a formulario",
    "convertir csv a formulario",
    // Herramientas
    "generador google forms",
    "herramienta google forms",
    "formularios sin codigo",
    "google forms velocidad",
    "formularios inteligentes",
    "creador de formularios online",
    "plataforma formularios ia"
  ],
  authors: [{ name: "FastForm Team", url: "https://fastform.pro" }],
  creator: "FastForm Team",
  publisher: "FastForm",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        rel: 'android-chrome',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  openGraph: {
    title: "FastForm (Fast Form) - Crea Google Forms con IA en Segundos | #1 Plataforma Inteligente",
    description: "🤖 FastForm (fast form): Crea Google Forms con IA ultrarrápida. ⚡ En segundos, no minutos ✅ Gratuito ✅ Sin código ✅ Desde CSV/Excel o con inteligencia artificial. +10,000 formularios creados.",
    url: "https://fastform.pro",
    siteName: "FastForm - Fast Form",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://fastform.pro/images/heroimage1.png",
        width: 1200,
        height: 630,
        alt: "FastForm - Convertir CSV y Excel a Google Forms automáticamente",
        type: "image/png"
      },
      {
        url: "https://fastform.pro/images/heroimage2.png", 
        width: 1200,
        height: 630,
        alt: "FastForm Dashboard - Crear formularios con IA",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "🤖 FastForm (Fast Form) - Google Forms con IA en Segundos | Velocidad Extrema",
    description: "FastForm (fast form): Crea Google Forms con inteligencia artificial ultrarrápida. ⚡ Segundos, no horas ✅ Gratuito ✅ Sin código ✅ IA + CSV/Excel. ¡Pruébalo!",
    images: ["https://fastform.pro/images/heroimage1.png"],
    creator: "@fastform_app",
    site: "@fastform_app"
  },
  alternates: {
    canonical: "https://fastform.pro",
    languages: {
      'es': 'https://fastform.pro/es',
      'en': 'https://fastform.pro/en'
    },
    types: {
      'application/rss+xml': 'https://fastform.pro/rss.xml'
    }
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FastForm - Plataforma Inteligente para Google Forms"
  },
  other: {
    "google-site-verification": "REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE",
    "copyright": "©2025 FastForm. Todos los derechos reservados.",
    "revised": new Date().toISOString(),
    "subject": "Conversión de CSV y Excel a Google Forms",
    "language": "es",
    "rating": "general",
    "reply-to": "hola@fastform.pro",
    "msvalidate.01": "REPLACE_WITH_BING_VERIFICATION_CODE"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`min-h-screen bg-background antialiased ${poppins.variable} font-poppins flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              // Organización
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "FastForm",
                "alternateName": ["Fast Form", "FastForm App", "Fast Form App"],
                "url": "https://fastform.pro",
                "logo": "https://fastform.pro/icons/logo.svg",
                "sameAs": [
                  "https://twitter.com/fastform_app"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "hola@fastform.pro",
                  "contactType": "customer service",
                  "availableLanguage": ["Spanish", "English"]
                },
                "slogan": "Fast Form - Crea formularios en segundos con IA",
                "description": "FastForm (fast form) es la plataforma líder para crear Google Forms con inteligencia artificial en segundos. Convierte CSV y Excel a formularios automáticamente."
              },
              // Aplicación Web
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "FastForm - Crea Google Forms con IA en Segundos",
                "alternateName": ["Fast Form", "FastForm IA", "Fast Form IA", "Fast Form App"],
                "description": "FastForm (fast form): Crea Google Forms con inteligencia artificial ultrarrápida. Plataforma gratuita que automatiza formularios en segundos desde CSV, Excel o con IA generativa.",
                "url": "https://fastform.pro",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser", 
                "browserRequirements": "Requires JavaScript",
                "softwareVersion": "2.0",
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Plan Gratuito",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "description": "Acceso gratuito a funciones básicas"
                  },
                  {
                    "@type": "Offer",
                    "name": "Plan Premium", 
                    "price": "9.99",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "description": "Acceso completo con funciones avanzadas"
                  }
                ],
                "creator": {
                  "@type": "Organization",
                  "name": "FastForm Team",
                  "url": "https://fastform.pro"
                },
                "keywords": "fastform, fast form, fastform ia, fast form ia, crear google forms con ia, google forms inteligencia artificial, formularios con ai, generador formularios ia, crear formularios rapido, automatizar google forms, csv a google forms, excel a google forms",
                "featureList": [
                  "Inteligencia Artificial para formularios",
                  "Creación en segundos, no minutos",
                  "Generación automática con IA",
                  "Velocidad ultrarrápida",
                  "Soporte CSV y Excel",
                  "Sin registro requerido",
                  "Interfaz súper intuitiva", 
                  "Compatible con Google Workspace",
                  "Vista previa en tiempo real",
                  "Múltiples tipos de preguntas IA",
                  "Optimización automática",
                  "Exportación directa instantánea"
                ],
                "screenshot": "https://fastform.pro/images/heroimage1.png"
              },
              // Website
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "FastForm",
                "alternateName": "Fast Form",
                "url": "https://fastform.pro",
                "description": "FastForm (fast form) - Plataforma para crear Google Forms con inteligencia artificial en segundos",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://fastform.pro/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                },
                "inLanguage": "es-ES",
                "author": {
                  "@type": "Organization",
                  "name": "FastForm Team"
                }
              },
              // BreadcrumbList para mejor navegación
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "FastForm",
                    "item": "https://fastform.pro"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Fast Form IA",
                    "item": "https://fastform.pro/create/ai"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Fast Form CSV/Excel",
                    "item": "https://fastform.pro/create/file"
                  }
                ]
              }
            ])
          }}
        />
        <AuthProvider>
          <GoogleAuthProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <AppToaster />
            {/* <FloatingFeedbackButton position="bottom-left" /> */}
          </GoogleAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
