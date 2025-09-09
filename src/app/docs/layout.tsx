import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guía Completa: Cómo Convertir CSV y Excel a Google Forms Paso a Paso",
  description: "Aprende cómo convertir archivos CSV y Excel a Google Forms paso a paso. Guía completa para importar datos y crear formularios automáticamente con FastForm.",
  keywords: [
    "como convertir csv a google forms",
    "como convertir excel a google forms",
    "tutorial csv google forms",
    "guia excel google forms",
    "importar csv google forms",
    "importar excel google forms",
    "convertir datos google forms",
    "crear formularios desde csv",
    "crear formularios desde excel"
  ],
  openGraph: {
    title: "Guía: Cómo Convertir CSV y Excel a Google Forms",
    description: "Tutorial completo para convertir archivos CSV y Excel a Google Forms automáticamente.",
    type: "article",
  }
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}