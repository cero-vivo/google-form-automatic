import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { GoogleAuthProvider } from "@/providers/GoogleAuthProvider";
import { Footer } from "@/components/ui/footer";
import { FloatingFeedbackButton } from "@/components/FloatingFeedbackButton";
import ZoomPreventionScript from "@/components/ZoomPreventionScript";
import { AppToaster } from "@/components/ui/app-toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FastForm | Plataforma #1 para Crear Google Forms",
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
    title: "FastForm - Plataforma Inteligente para Google Forms",
    description: "Convierte archivos CSV y Excel a Google Forms automáticamente. Herramienta gratuita y fácil de usar.",
    url: "https://fastform.pro",
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
    canonical: "https://fastform.pro",
    languages: {
      'es': 'https://fastform.pro/es',
      'en': 'https://fastform.pro/en'
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
    "google-site-verification": "tu-codigo-de-verificacion-aqui",
    "copyright": "©2025 FastForm. Todos los derechos reservados.",
    "revised": new Date().toISOString(),
    "subject": "Conversión de CSV y Excel a Google Forms",
    "language": "es",
    "rating": "general",
    "reply-to": "hola@fastform.pro"
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "FastForm",
              "description": "Convierte archivos CSV y Excel a Google Forms automáticamente. Herramienta gratuita para crear formularios desde CSV, Excel hacia Google Forms en segundos.",
              "url": "https://fastform.pro",
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
                "Interfaz intuitiva",
                "Sin registro requerido",
                "Procesamiento en segundos",
                "Compatible con Google Workspace"
              ]
            })
          }}
        />
        <AuthProvider>
          <GoogleAuthProvider>
            <ZoomPreventionScript />
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
