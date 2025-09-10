import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, Zap, Upload, Sparkles } from 'lucide-react';

const meta: Meta = {
  title: 'Fast Form/Brand Components',
  parameters: {
    docs: {
      description: {
        component: 'Componentes de UI con estilo de marca Fast Form',
      },
    },
  },
};

export default meta;

export const Buttons: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Botones Primarios</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button className="bg-velocity-500 hover:bg-velocity-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-poppins">
            <Sparkles className="w-4 h-4 mr-2" />
            Crear con IA
          </Button>
          <Button className="bg-forms-500 hover:bg-forms-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-poppins">
            <Upload className="w-4 h-4 mr-2" />
            Subir Archivo
          </Button>
          <Button disabled className="bg-velocity-500/50 text-white/70 font-semibold px-6 py-3 rounded-full cursor-not-allowed font-poppins">
            Botón Deshabilitado
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Botones Secundarios</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="outline" className="border-2 border-velocity-500 text-velocity-700 hover:bg-velocity-50 font-semibold px-6 py-3 rounded-full transition-all duration-200 font-poppins">
            Ver Demo
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted font-medium px-6 py-3 rounded-full transition-all duration-200 font-inter">
            Más Información
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Tamaños de Botones</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm" className="bg-velocity-500 hover:bg-velocity-600 text-white font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-poppins">
            Pequeño
          </Button>
          <Button className="bg-velocity-500 hover:bg-velocity-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-poppins">
            Mediano
          </Button>
          <Button size="lg" className="bg-velocity-500 hover:bg-velocity-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-poppins">
            Grande
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const Cards: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Tarjetas Fast Form</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border bg-background rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-inter">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground font-poppins">Crear Formulario</CardTitle>
              <CardDescription className="text-muted-foreground font-inter">Comienza tu formulario con plantillas inteligentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed font-inter">Utiliza nuestra IA para generar formularios optimizados en segundos, con validación automática y diseño responsive.</p>
              <div className="mt-4 flex gap-2">
                <Badge className="bg-velocity-50 text-velocity-700 border border-velocity-500 font-medium">AI</Badge>
                <Badge className="bg-forms-50 text-forms-700 border border-forms-500 font-medium">Rápido</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none bg-background rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-inter">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground font-poppins">Estadísticas Premium</CardTitle>
              <CardDescription className="text-muted-foreground font-inter">Análisis detallado de respuestas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed font-inter">Obtén insights valiosos con visualizaciones interactivas y exportación en tiempo real.</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-excel-500"></div>
                <span className="text-sm font-medium text-excel-700">99.9% disponibilidad</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const Badges: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Badges de Estado</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge className="bg-velocity-500 text-white font-semibold px-3 py-1 rounded-full text-sm font-poppins shadow-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Nuevo
          </Badge>
          <Badge className="bg-forms-500 text-white font-semibold px-3 py-1 rounded-full text-sm font-poppins shadow-sm">
            <Zap className="w-3 h-3 mr-1" />
            Procesando
          </Badge>
          <Badge className="bg-excel-500 text-white font-semibold px-3 py-1 rounded-full text-sm font-poppins shadow-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completado
          </Badge>
          <Badge className="bg-red-500 text-white font-semibold px-3 py-1 rounded-full text-sm font-poppins shadow-sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
          <Badge className="bg-muted font-medium px-3 py-1 rounded-full text-sm font-inter">
            Pendiente
          </Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-neutral-text_primary font-poppins">Badges con Contador</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge className="bg-velocity-50 text-velocity-700 border border-velocity-500 font-bold px-2.5 py-0.5 rounded-full text-xs font-inter">
            15
          </Badge>
          <Badge className="bg-forms-50 text-forms-700 border border-forms-500 font-bold px-2.5 py-0.5 rounded-full text-xs font-inter">
            3
          </Badge>
          <Badge className="bg-excel-50 text-excel-700 border border-excel-500 font-bold px-2.5 py-0.5 rounded-full text-xs font-inter">
            99+
          </Badge>
          <Badge className="bg-muted font-bold px-2.5 py-0.5 rounded-full text-xs font-inter">
            0
          </Badge>
        </div>
      </div>
    </div>
  ),
};

export const Inputs: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Inputs de Formulario</h2>
        <div className="space-y-6 max-w-lg">
          <div>
            <label className="text-base font-semibold text-foreground mb-2 block font-poppins">
              Título del Formulario
            </label>
            <Input 
              placeholder="Ej: Encuesta de Satisfacción 2024"
              className="border-border bg-background rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-velocity-500 focus:ring-2 focus:ring-velocity-500 focus:ring-opacity-20 transition-all duration-200 font-inter"
            />
            <p className="text-sm text-muted-foreground mt-1 font-inter">Dale un nombre descriptivo a tu formulario</p>
          </div>
          
          <div>
            <label className="text-base font-semibold text-foreground mb-2 block font-poppins">
              Email Corporativo
            </label>
            <Input 
              type="email"
              placeholder="tu@empresa.com"
              className="border-border bg-background rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-velocity-500 focus:ring-2 focus:ring-velocity-500 focus:ring-opacity-20 transition-all duration-200 font-inter"
            />
            <p className="text-sm text-muted-foreground mt-1 font-inter">Recibirás las respuestas aquí</p>
          </div>
          
          <div>
            <label className="text-base font-semibold text-foreground mb-2 block font-poppins">
              Descripción (Opcional)
            </label>
            <Input 
              value="Campo deshabilitado - Solo lectura"
              disabled
              className="border-border bg-muted rounded-lg px-4 py-3 text-muted-foreground cursor-not-allowed font-inter"
            />
            <p className="text-sm text-muted-foreground mt-1 font-inter">Este campo está bloqueado temporalmente</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Alerts: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-neutral-text_primary font-poppins">Mensajes de Estado</h2>
        <div className="space-y-5 max-w-2xl">
          <div className="bg-[hsl(142,72%,95%)] border border-[hsl(142,72%,85%)] rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-[hsl(142,72%,29%)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[hsl(142,72%,29%)] font-poppins mb-1">¡Formulario Creado!</h3>
                <p className="text-sm text-[hsl(142,72%,25%)] font-inter">
                  Tu formulario "Encuesta de Satisfacción" está listo. Compártelo con tu audiencia y comienza a recopilar respuestas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[hsl(38,100%,95%)] border border-[hsl(38,100%,85%)] rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-[hsl(38,100%,40%)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[hsl(38,100%,40%)] font-poppins mb-1">Límite Próximo</h3>
                <p className="text-sm text-[hsl(38,100%,35%)] font-inter">
                  Te quedan 2 formularios gratuitos este mes. Considera actualizar a Pro para formularios ilimitados.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[hsl(0,100%,95%)] border border-[hsl(0,100%,85%)] rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-[hsl(0,72%,51%)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[hsl(0,72%,51%)] font-poppins mb-1">Error de Conexión</h3>
                <p className="text-sm text-[hsl(0,72%,45%)] font-inter">
                  No pudimos conectar con Google Sheets. Verifica tu conexión y vuelve a intentarlo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};