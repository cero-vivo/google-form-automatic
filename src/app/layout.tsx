import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "FastForm - Convertir CSV a Google Forms | Excel a Google Forms Gratis",
  description: "Convierte archivos CSV y Excel a Google Forms automáticamente. Herramienta gratuita para crear formularios desde CSV, Excel hacia Google Forms en segundos. Sin código requerido.",
  keywords: [
    "csv a google forms",
    "excel a google forms", 
    "convertir csv google forms",
    "convertir excel google forms",
    "csv to google forms",
    "excel to google forms",
    "crear formularios desde csv",
    "crear formularios desde excel",
    "automatizar google forms",
    "generador google forms",
    "csv formularios",
    "excel formularios",
    "importar csv google forms",
    "importar excel google forms",
    "herramienta google forms",
    "fastform"
  ],
  authors: [{ name: "FastForm Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "FastForm - Convertir CSV a Google Forms | Excel a Google Forms",
    description: "Convierte archivos CSV y Excel a Google Forms automáticamente. Herramienta gratuita y fácil de usar.",
    url: "https://fastform.app",
    siteName: "FastForm",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FastForm - Convertir CSV y Excel a Google Forms"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FastForm - Convertir CSV a Google Forms | Excel a Google Forms",
    description: "Convierte archivos CSV y Excel a Google Forms automáticamente. Gratis y sin código.",
    images: ["/twitter-image.jpg"],
    creator: "@fastform_app"
  },
  alternates: {
    canonical: "https://fastform.app",
    languages: {
      'es': 'https://fastform.app/es',
      'en': 'https://fastform.app/en'
    }
  },
  other: {
    "google-site-verification": "tu-codigo-de-verificacion-aqui"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "FastForm",
              "description": "Convierte archivos CSV y Excel a Google Forms automáticamente. Herramienta gratuita para crear formularios desde CSV, Excel hacia Google Forms en segundos.",
              "url": "https://fastform.app",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "creator": {
                "@type": "Organization",
                "name": "FastForm Team"
              },
              "keywords": "csv a google forms, excel a google forms, convertir csv google forms, convertir excel google forms, crear formularios desde csv, crear formularios desde excel",
              "featureList": [
                "Convertir CSV a Google Forms",
                "Convertir Excel a Google Forms", 
                "Importar datos desde archivos",
                "Generación automática de formularios",
                "Integración directa con Google Forms",
                "Herramienta gratuita",
                "Sin necesidad de programación"
              ]
            })
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
