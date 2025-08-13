import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Upload,
  Settings,
  Share2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cómo Convertir CSV a Google Forms - FastForm',
  description: 'Guía paso a paso para convertir archivos CSV/Excel en formularios de Google Forms automáticamente con FastForm.',
};

export default function ComoConvertirCSVPage() {
  const steps = [
    {
      icon: Upload,
      title: 'Sube tu archivo CSV o Excel',
      description: 'Arrastra y suelta tu archivo o selecciónalo manualmente. Soportamos .csv, .xlsx y .xls',
    },
    {
      icon: Settings,
      title: 'Configura las preguntas',
      description: 'Revisa y ajusta los tipos de preguntas, títulos y opciones según tus necesidades',
    },
    {
      icon: CheckCircle,
      title: 'Crea el formulario',
      description: 'Un clic y tu formulario se creará automáticamente en Google Forms',
    },
    {
      icon: Share2,
      title: 'Comparte y recolecta respuestas',
      description: 'Comparte el enlace y comienza a recolectar respuestas de forma organizada',
    },
  ];

  const features = [
    'Conversión automática de CSV a formulario',
    'Detección inteligente de tipos de preguntas',
    'Soporte para archivos Excel (.xlsx, .xls)',
    'Validación de datos en tiempo real',
    'Interfaz intuitiva y fácil de usar',
    'Integración directa con Google Forms',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <FileText className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Cómo Convertir CSV a Google Forms
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Guía paso a paso para transformar tus archivos CSV/Excel en formularios profesionales
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => window.location.href = '/dashboard'}
          >
            Comenzar Ahora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Proceso Simple en 4 Pasos
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Características Destacadas
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para convertir tu CSV?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sube tu archivo ahora y crea tu formulario en minutos
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = '/dashboard'}
          >
            Ir al Dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}