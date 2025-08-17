import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Settings, 
  Eye, 
  CheckCircle2,
  Clock,
  CreditCard,
  Download
} from 'lucide-react';

const meta: Meta = {
  title: 'Form Creation/Guía Completa',
  parameters: {
    docs: {
      description: {
        component: 'Guía completa del proceso de creación de formularios en Fast Form',
      },
    },
  },
};

export default meta;

export const Paso1_Inicio: StoryObj = {
  name: 'Paso 1: Inicio del Proceso',
  render: () => (
    <div className="space-y-8 font-sans max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-poppins mb-2">Cómo crear tu primer formulario</h1>
        <p className="text-lg text-muted-foreground font-inter mb-6">Guía paso a paso para crear formularios profesionales</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-velocity-200 bg-velocity-50/30 hover:border-velocity-300 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-poppins">
                <Upload className="w-6 h-6 mr-3 text-velocity-600" />
                Subir Archivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-inter mb-4">
                Convierte CSV, Excel o Google Forms existentes en formularios nuevos
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                <li>• Soporte .xlsx, .csv</li>
                <li>• Máximo 10MB</li>
                <li>• Validación automática</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-forms-200 bg-forms-50/30 hover:border-forms-300 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-poppins">
                <Sparkles className="w-6 h-6 mr-3 text-forms-600" />
                Crear con IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-inter mb-4">
                Genera formularios inteligentes con descripciones en lenguaje natural
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                <li>• IA contextual</li>
                <li>• Validaciones automáticas</li>
                <li>• Diseño optimizado</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-excel-200 bg-excel-50/30 hover:border-excel-300 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-poppins">
                <FileText className="w-6 h-6 mr-3 text-excel-600" />
                Plantillas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-inter mb-4">
                Usa plantillas predefinidas para casos comunes
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                <li>• Encuestas de satisfacción</li>
                <li>• Formularios de contacto</li>
                <li>• Registros de eventos</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const Paso2_Upload: StoryObj = {
  name: 'Paso 2: Proceso de Upload',
  render: () => (
    <div className="space-y-8 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Subida y procesamiento de archivos</h2>
        
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="flex items-center font-poppins">
              <Upload className="w-5 h-5 mr-2" />
              Progreso de Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground font-inter">Procesando archivo...</span>
                <span className="text-sm text-muted-foreground font-inter">65%</span>
              </div>
              <Progress value={65} className="h-2 bg-muted" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm text-foreground mb-2 font-poppins">Archivo</h4>
                <p className="text-sm text-muted-foreground font-inter">encuesta_clientes.xlsx</p>
                <p className="text-xs text-muted-foreground font-inter">2.4 MB • 15 preguntas</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm text-foreground mb-2 font-poppins">Estado</h4>
                <Badge className="bg-velocity-100 text-velocity-700 border border-velocity-200 font-medium font-inter">
                  Validando estructura
                </Badge>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-foreground mb-2 font-poppins">Validaciones realizadas:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-excel-500" /> Formato válido</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-excel-500" /> Columnas requeridas</li>
                <li className="flex items-center"><Clock className="w-4 h-4 mr-2 text-velocity-500" /> Tipos de preguntas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const Paso3_Preview: StoryObj = {
  name: 'Paso 3: Vista previa y edición',
  render: () => (
    <div className="space-y-8 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Vista previa y edición final</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center font-poppins">
                  <Eye className="w-5 h-5 mr-2" />
                  Vista previa del formulario
                </CardTitle>
                <CardDescription className="font-inter">Revisa cómo se verá tu formulario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-poppins">Encuesta de Satisfacción</h3>
                  <p className="text-sm text-muted-foreground font-inter">Ayúdanos a mejorar nuestro servicio</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1 font-poppins">Nombre completo *</label>
                    <input type="text" placeholder="Tu nombre" className="w-full px-3 py-2 border border-border rounded-md text-sm font-inter" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1 font-poppins">Correo electrónico *</label>
                    <input type="email" placeholder="tu@email.com" className="w-full px-3 py-2 border border-border rounded-md text-sm font-inter" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1 font-poppins">¿Cómo calificarías nuestro servicio?</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md text-sm font-inter">
                      <option>Selecciona una opción...</option>
                      <option>Excelente</option>
                      <option>Muy bueno</option>
                      <option>Bueno</option>
                      <option>Regular</option>
                      <option>Malo</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground font-poppins">Título</label>
                  <input type="text" value="Encuesta de Satisfacción" className="w-full px-2 py-1 border border-border rounded text-sm font-inter" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground font-poppins">Descripción</label>
                  <textarea className="w-full px-2 py-1 border border-border rounded text-sm font-inter" rows={3}>Ayúdanos a mejorar nuestro servicio</textarea>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">Guardar cambios</Button>
                  <Button variant="outline" className="w-full border-forms-500 text-forms-600 hover:bg-forms-50 font-poppins">Descartar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Paso4_Publicar: StoryObj = {
  name: 'Paso 4: Publicación y costos',
  render: () => (
    <div className="space-y-8 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Publicación final</h2>
        
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="flex items-center font-poppins">
              <CheckCircle2 className="w-5 h-5 mr-2 text-excel-500" />
              ¡Formulario listo para publicar!
            </CardTitle>
            <CardDescription className="font-inter">Revisa los detalles antes de crear</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground font-poppins">Resumen</h4>
                <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                  <li>• 3 preguntas totales</li>
                  <li>• 2 preguntas requeridas</li>
                  <li>• Diseño responsive</li>
                  <li>• Validaciones incluidas</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground font-poppins">Costo</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground font-inter">Créditos necesarios</span>
                    <Badge className="bg-velocity-100 text-velocity-700 border border-velocity-200 font-bold font-inter">
                      15 créditos
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground font-inter">Créditos disponibles</span>
                    <span className="text-sm font-medium text-foreground font-inter">42 créditos</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex gap-3">
                <Button className="bg-excel-500 hover:bg-excel-600 text-white font-poppins">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Crear formulario (15 créditos)
                </Button>
                <Button variant="outline" className="border-forms-500 text-forms-600 hover:bg-forms-50 font-poppins">
                  <Download className="w-4 h-4 mr-2" />
                  Guardar como borrador
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};