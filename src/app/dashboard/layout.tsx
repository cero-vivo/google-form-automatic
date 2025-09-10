import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard FastForm - Gestiona y Crea Google Forms desde CSV y Excel",
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