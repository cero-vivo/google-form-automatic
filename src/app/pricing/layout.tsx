import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios FastForm - Convertir CSV a Google Forms Gratis | Excel a Google Forms",
  description: "Planes y precios de FastForm para convertir archivos CSV y Excel a Google Forms. Plan gratuito disponible para crear formularios automáticamente.",
  keywords: [
    "precios fastform",
    "convertir csv google forms gratis",
    "excel google forms precio",
    "plan gratuito google forms",
    "suscripcion fastform"
  ],
  openGraph: {
    title: "Precios FastForm - Convertir CSV y Excel a Google Forms",
    description: "Planes flexibles para convertir archivos a Google Forms. Comienza gratis.",
    type: "website",
  }
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 