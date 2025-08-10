import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "FormGenerator - Generador Automático de Google Forms",
  description: "Genera Google Forms automáticamente desde archivos Excel y CSV. Solución moderna y escalable para crear formularios profesionales.",
  keywords: ["google forms", "excel", "csv", "formularios", "automatización"],
  authors: [{ name: "FormGenerator Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
