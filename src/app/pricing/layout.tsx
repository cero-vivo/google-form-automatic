import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios FastForm - Planes para la Plataforma de Formularios Inteligentes",
  description: "Planes y precios de FastForm para crear Google Forms con IA, formularios inteligentes y automatización avanzada. Plan gratuito disponible para empezar a crear formularios profesionales.",
  keywords: [
    "precios fastform",
    "planes formularios inteligentes",
    "fastform precio",
    "google forms con ia precio",
    "plan gratuito formularios",
    "suscripcion fastform",
    "formularios empresariales precio",
    "plataforma formularios costo"
  ],
  openGraph: {
    title: "Precios FastForm - Plataforma Inteligente de Formularios",
    description: "Planes flexibles para crear formularios inteligentes con IA. Desde plan gratuito hasta soluciones empresariales.",
    type: "website",
    url: "https://fastform.pro/pricing"
  }
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}