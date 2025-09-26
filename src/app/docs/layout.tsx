import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentación FastForm - Guía Completa",
  description: "Documentación completa de FastForm: aprende a crear formularios con IA, importar datos, usar plantillas, automatizar flujos y dominar todas las funcionalidades de nuestra plataforma inteligente.",
  keywords: [
    "documentacion fastform",
    "guia fastform",
    "como usar fastform",
    "tutorial formularios inteligentes",
    "crear formularios con ia guia",
    "fastform manual usuario",
    "api fastform documentacion",
    "integraciones fastform",
    "automatizacion formularios guia",
    "plantillas formularios tutorial"
  ],
  openGraph: {
    title: "Documentación FastForm - Plataforma de Formularios Inteligentes",
    description: "Guía completa para dominar FastForm: formularios con IA, automatización, integraciones y más.",
    type: "article",
    url: "https://fastform.pro/docs"
  }
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}