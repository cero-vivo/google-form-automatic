import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard FastForm - Plataforma #1 para Crear Google Forms",
  description: "Panel de control de FastForm para crear Google Forms con IA, gestionar formularios inteligentes, analizar resultados y automatizar flujos de trabajo. Tu centro de comando para formularios profesionales.",
  keywords: [
    "dashboard fastform",
    "panel formularios",
    "gestionar google forms",
    "crear formularios ia",
    "formularios inteligentes",
    "dashboard forms",
    "panel control formularios"
  ],
  robots: "noindex, nofollow" // Dashboard requires authentication
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}