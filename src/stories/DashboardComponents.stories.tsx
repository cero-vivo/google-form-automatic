import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Upload, FileText, CreditCard } from 'lucide-react';

const meta: Meta = {
  title: 'Fast Form/Dashboard Components',
  parameters: {
    docs: {
      description: {
        component: 'Componentes principales del dashboard de Fast Form',
      },
    },
  },
};

export default meta;

// Mock data para las historias
const mockStats = [
  { label: 'Formularios Creados', value: 24, icon: FileText },
  { label: 'Créditos Disponibles', value: 15, icon: CreditCard },
  { label: 'Tasa de Éxito', value: '96%', icon: Sparkles },
];

export const StatsCards: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      {mockStats.map((stat) => (
        <Card key={stat.label} className="border-border bg-background rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground font-inter">
                {stat.label}
              </CardTitle>
              <div className="p-2 bg-velocity-50 rounded-lg">
                <stat.icon className="h-5 w-5 text-velocity-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-poppins">{stat.value}</div>
            </CardContent>
          </Card>
      ))}
    </div>
  ),
};

export const CreationCards: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      <Card className="border-border bg-background rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground flex items-center font-poppins">
            <Sparkles className="h-6 w-6 mr-3 text-velocity-500" />
            Crear con IA
          </CardTitle>
          <CardDescription className="text-muted-foreground font-inter">
            Genera formularios profesionales con inteligencia artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-velocity-500 hover:bg-velocity-600 text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-poppins">
            Comenzar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-background rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground flex items-center font-poppins">
            <Upload className="h-6 w-6 mr-3 text-forms-500" />
            Subir Archivo
          </CardTitle>
          <CardDescription className="text-muted-foreground font-inter">
            Convierte CSV, Excel o Google Forms en formularios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full border-2 border-forms-500 text-forms-500 hover:bg-forms-50 font-semibold py-3 rounded-full transition-all duration-200 font-poppins">
            Seleccionar archivo
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

export const QuestionPreview: StoryObj = {
  render: () => (
    <Card className="border-border bg-background rounded-xl shadow-sm font-sans">
      <CardHeader>
        <CardTitle className="text-xl text-foreground font-semibold font-poppins">Vista previa de preguntas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="border-b border-border pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground font-inter">1.</span>
              <h4 className="font-medium text-foreground font-poppins">¿Cuál es tu nombre completo?</h4>
              <Badge className="bg-velocity-50 text-velocity-700 border border-velocity-200 text-xs font-medium font-inter">Requerido</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-inter">Tipo: Texto corto</p>
          </div>
          
          <div className="border-b border-border pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground font-inter">2.</span>
              <h4 className="font-medium text-foreground font-poppins">¿Cuál es tu correo electrónico?</h4>
              <Badge className="bg-velocity-50 text-velocity-700 border border-velocity-200 text-xs font-medium font-inter">Requerido</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-inter">Tipo: Email</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground font-inter">3.</span>
              <h4 className="font-medium text-foreground font-poppins">¿Cómo calificarías nuestro servicio?</h4>
              <Badge className="bg-muted text-muted-foreground text-xs font-medium font-inter">Opcional</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-inter">Tipo: Escala 1-5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const FormSettings: StoryObj = {
  render: () => (
    <Card className="border-border bg-background rounded-xl shadow-sm font-sans">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground font-semibold font-poppins">Configuración del formulario</CardTitle>
        <CardDescription className="text-muted-foreground font-inter">
          Revisa y ajusta los detalles antes de crear
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block font-poppins">Título del formulario</label>
          <input 
            type="text" 
            value="Encuesta de satisfacción del cliente"
            className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-velocity-500 focus:border-velocity-500 transition-all duration-200 font-inter"
            readOnly
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block font-poppins">Descripción</label>
          <textarea 
            value="Ayúdanos a mejorar nuestro servicio compartiendo tu experiencia"
            className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-velocity-500 focus:border-velocity-500 transition-all duration-200 font-inter"
            rows={3}
            readOnly
          />
        </div>
        
        <Button className="w-full bg-excel-500 hover:bg-excel-600 text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-poppins">
          Crear formulario (15 créditos)
        </Button>
      </CardContent>
    </Card>
  ),
};