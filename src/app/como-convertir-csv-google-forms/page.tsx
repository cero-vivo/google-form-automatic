import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Upload, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cómo Convertir CSV a Google Forms en 3 Pasos Simples | FastForm 2025",
  description: "Guía completa: aprende cómo convertir archivos CSV a Google Forms automáticamente. Tutorial paso a paso con ejemplos prácticos. ¡Convierte CSV a Google Forms gratis!",
  keywords: [
    "como convertir csv a google forms",
    "convertir csv google forms tutorial",
    "csv to google forms español",
    "importar csv google forms",
    "subir csv google forms",
    "crear formulario desde csv",
    "csv google forms automatico",
    "tutorial csv formulario google"
  ],
  openGraph: {
    title: "Cómo Convertir CSV a Google Forms - Tutorial Completo",
    description: "Aprende a convertir archivos CSV a Google Forms en 3 pasos simples. Gratis y sin conocimientos técnicos.",
    type: "article",
  }
};

export default function ComoConvertirCSVGoogleForms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FastForm
            </span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Convertir CSV Ahora</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Cómo Convertir CSV a Google Forms
              <br />
              <span className="text-2xl md:text-3xl">en 3 Pasos Simples</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Aprende a convertir archivos CSV a Google Forms automáticamente con FastForm. 
              Tutorial completo con ejemplos prácticos para crear formularios desde CSV sin conocimientos técnicos.
            </p>

            <Button size="lg" asChild>
              <Link href="/dashboard">
                <Upload className="mr-2 h-5 w-5" />
                Convertir CSV a Google Forms Gratis
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tutorial Steps */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tutorial: Convertir CSV a Google Forms en 3 Pasos
          </h2>
          
          <div className="space-y-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  Preparar tu archivo CSV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Para convertir CSV a Google Forms exitosamente, tu archivo debe tener la estructura correcta:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
                  <code className="text-sm">
                    Pregunta,Tipo,Opciones,Requerido,Descripción<br/>
                    "¿Cuál es tu nombre?","texto_corto","","true","Ingresa tu nombre completo"<br/>
                    "¿Tu edad?","numero","","false","Edad en años"<br/>
                    "¿Color favorito?","opcion_multiple","Rojo,Verde,Azul","false","Selecciona tu color"
                  </code>
                </div>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Primera fila debe contener los encabezados</li>
                  <li>Columna "Pregunta": El texto de la pregunta</li>
                  <li>Columna "Tipo": tipo de respuesta (texto_corto, numero, opcion_multiple, etc.)</li>
                  <li>Columna "Opciones": Para preguntas de opción múltiple, separadas por comas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  Subir CSV a FastForm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Una vez que tengas tu archivo CSV listo para convertir a Google Forms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Ve al <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard de FastForm</Link></li>
                  <li>Arrastra tu archivo CSV a la zona de carga</li>
                  <li>FastForm procesará automáticamente tu CSV</li>
                  <li>Revisa la vista previa de las preguntas detectadas</li>
                  <li>Edita títulos o descripciones si es necesario</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  Exportar a Google Forms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  El paso final para convertir CSV a Google Forms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Haz clic en "Crear Google Form"</li>
                  <li>Autoriza el acceso a tu cuenta de Google (solo la primera vez)</li>
                  <li>FastForm creará automáticamente el formulario en Google Forms</li>
                  <li>Recibirás los enlaces para ver y editar tu formulario</li>
                  <li>¡Tu formulario estará listo para usar!</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué usar FastForm para convertir CSV a Google Forms?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">100% Gratuito</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Convierte CSV a Google Forms gratis, sin límites ni restricciones en el plan básico.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Automático y Rápido</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Convierte archivos CSV a Google Forms en menos de 30 segundos, sin trabajo manual.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Sin Conocimientos Técnicos</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    No necesitas saber programación para convertir CSV a Google Forms con FastForm.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Detección Inteligente</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Reconoce automáticamente tipos de preguntas al convertir CSV a Google Forms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Vista Previa en Tiempo Real</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Ve cómo se verá tu formulario antes de convertir CSV a Google Forms definitivamente.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Integración Nativa</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Los formularios se crean directamente en Google Forms con toda su funcionalidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para convertir tu CSV a Google Forms?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comienza ahora y crea tu formulario de Google Forms desde CSV en menos de 1 minuto.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">
              Convertir CSV a Google Forms Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-white">
        <div className="container mx-auto text-center">
          <p className="text-slate-400">
            © 2024 FastForm. La mejor herramienta para convertir CSV a Google Forms.
          </p>
        </div>
      </footer>
    </div>
  );
} 