import { Metadata } from 'next';
import { AIChatFormCreator } from '@/components/organisms/AIChatFormCreator';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crear Formulario con IA - FastForm',
  description: 'Crea formularios de Google Forms conversando con inteligencia artificial',
};

export default function AIChatPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Crear Formularios con IA</h1>
                <p className="text-muted-foreground">
                  Usa inteligencia artificial para crear formularios de Google Forms conversando
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Asistente de Formularios
                </CardTitle>
                <CardDescription>
                  Describe el formulario que necesitas y la IA lo creará por ti. 
                  Cada 5 mensajes consume 1 crédito, y publicar el formulario cuesta 2 créditos adicionales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIChatFormCreator />
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>¿Cómo funciona?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <strong>1. Conversa con la IA:</strong> Describe el formulario que necesitas en lenguaje natural.
                </p>
                <p>
                  <strong>2. Revisa la vista previa:</strong> La IA generará una vista previa del formulario en tiempo real.
                </p>
                <p>
                  <strong>3. Publica el formulario:</strong> Una vez satisfecho, publica directamente a Google Forms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consejos para mejores resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  • Sé específico sobre los tipos de preguntas que necesitas
                </p>
                <p>
                  • Menciona si necesitas opciones específicas o rangos numéricos
                </p>
                <p>
                  • Puedes pedir modificaciones antes de publicar
                </p>
                <p>
                  • La IA entiende español perfectamente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}