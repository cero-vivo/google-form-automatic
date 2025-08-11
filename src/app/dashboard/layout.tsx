import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Convertir CSV a Google Forms | FastForm",
  description: "Sube tus archivos CSV y Excel para convertirlos a Google Forms automáticamente. Dashboard de FastForm para crear formularios rápidamente.",
  robots: "noindex, nofollow" // Dashboard requires authentication
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 