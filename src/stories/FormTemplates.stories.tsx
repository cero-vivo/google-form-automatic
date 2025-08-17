import type { Meta, StoryObj } from '@storybook/react';
import { 
  Users, 
  Briefcase, 
  Heart, 
  GraduationCap, 
  ShoppingCart, 
  Calendar,
  Star,
  FileText,
  Clock,
  CheckCircle2,
  Copy,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const meta: Meta = {
  title: 'Form Creation/Form Templates',
  parameters: {
    docs: {
      description: {
        component: 'Plantillas de formularios predefinidas y ejemplos de uso',
      },
    },
  },
};

export default meta;

// Plantillas disponibles
const templates = [
  {
    id: 'customer-satisfaction',
    title: 'Satisfacción del Cliente',
    description: 'Mide la satisfacción de tus clientes con tu servicio o producto',
    icon: Star,
    category: 'Negocios',
    questions: 8,
    estimatedTime: '3-5 min',
    usage: '2.3k usos',
    color: 'bg-velocity-500',
    questionsList: [
      '¿Cómo calificarías tu experiencia general?',
      '¿Qué tan probable es que nos recomiendes?',
      '¿Qué aspectos podríamos mejorar?',
      '¿Cuál fue el punto más destacado?',
    ],
  },
  {
    id: 'job-application',
    title: 'Postulación de Empleo',
    description: 'Formulario completo para recibir aplicaciones laborales',
    icon: Briefcase,
    category: 'RRHH',
    questions: 12,
    estimatedTime: '8-10 min',
    usage: '1.8k usos',
    color: 'bg-forms-500',
    questionsList: [
      'Información personal básica',
      'Experiencia laboral',
      'Educación y formación',
      'Habilidades y competencias',
    ],
  },
  {
    id: 'event-registration',
    title: 'Registro de Eventos',
    description: 'Registra asistentes para tu próximo evento o conferencia',
    icon: Calendar,
    category: 'Eventos',
    questions: 6,
    estimatedTime: '2-3 min',
    usage: '3.1k usos',
    color: 'bg-excel-500',
    questionsList: [
      'Datos del asistente',
      'Preferencias alimenticias',
      'Requerimientos especiales',
      'Sesiones de interés',
    ],
  },
  {
    id: 'health-survey',
    title: 'Encuesta de Salud',
    description: 'Recopila información médica y de bienestar de forma segura',
    icon: Heart,
    category: 'Salud',
    questions: 15,
    estimatedTime: '10-12 min',
    usage: '1.2k usos',
    color: 'bg-neutral-500',
    questionsList: [
      'Historial médico',
      'Estilo de vida',
      'Medicamentos actuales',
      'Síntomas y molestias',
    ],
  },
  {
    id: 'student-feedback',
    title: 'Evaluación de Cursos',
    description: 'Recibe feedback de estudiantes sobre cursos y profesores',
    icon: GraduationCap,
    category: 'Educación',
    questions: 10,
    estimatedTime: '5-7 min',
    usage: '4.5k usos',
    color: 'bg-velocity-400',
    questionsList: [
      'Evaluación del contenido',
      'Calidad del instructor',
      'Recursos y materiales',
      'Recomendaciones',
    ],
  },
  {
    id: 'order-form',
    title: 'Pedido Personalizado',
    description: 'Formulario para recibir pedidos personalizados de productos',
    icon: ShoppingCart,
    category: 'E-commerce',
    questions: 7,
    estimatedTime: '4-6 min',
    usage: '2.7k usos',
    color: 'bg-forms-400',
    questionsList: [
      'Datos del cliente',
      'Especificaciones del producto',
      'Cantidad y medidas',
      'Instrucciones especiales',
    ],
  },
];

const TemplateCard = ({ template }: { template: any }) => {
  const Icon = template.icon;
  
  return (
    <Card className="border-border bg-background hover:shadow-lg transition-all duration-200 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center mb-3`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg font-poppins">{template.title}</CardTitle>
            <CardDescription className="font-inter">{template.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="font-inter">
            {template.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-inter">Preguntas</span>
            <span className="font-medium font-poppins">{template.questions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-inter">Tiempo estimado</span>
            <span className="font-medium font-poppins">{template.estimatedTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-inter">Uso popular</span>
            <span className="font-medium font-poppins">{template.usage}</span>
          </div>
          
          <div className="pt-3">
            <div className="text-xs text-muted-foreground mb-2 font-inter">Preguntas incluidas:</div>
            <div className="space-y-1">
              {template.questionsList.slice(0, 3).map((question: string, index: number) => (
                <div key={index} className="text-xs text-foreground font-inter">• {question}</div>
              ))}
              {template.questionsList.length > 3 && (
                <div className="text-xs text-muted-foreground font-inter">+{template.questionsList.length - 3} más...</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Button className="flex-1 bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">
          <Copy className="w-4 h-4 mr-2" />
          Usar plantilla
        </Button>
        <Button variant="outline" className="font-poppins">
          <Eye className="w-4 h-4 mr-2" />
          Vista previa
        </Button>
      </CardFooter>
    </Card>
  );
};

export const TemplateGallery: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Galería de plantillas</h2>
        <p className="text-muted-foreground mb-6 font-inter">
          Plantillas profesionales listas para usar. Personalízalas según tus necesidades.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const CategoryFilter: StoryObj = {
  render: () => {
    const categories = [
      { name: 'Todos', count: templates.length, color: 'bg-neutral-500' },
      { name: 'Negocios', count: 2, color: 'bg-velocity-500' },
      { name: 'RRHH', count: 1, color: 'bg-forms-500' },
      { name: 'Eventos', count: 1, color: 'bg-excel-500' },
      { name: 'Salud', count: 1, color: 'bg-neutral-500' },
      { name: 'Educación', count: 1, color: 'bg-velocity-400' },
      { name: 'E-commerce', count: 1, color: 'bg-forms-400' },
    ];

    return (
      <div className="space-y-6 font-sans max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Filtrar por categoría</h2>
          
          <Card className="border-border bg-background">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">Categorías disponibles</CardTitle>
              <CardDescription className="font-inter">
                Selecciona una categoría para ver plantillas específicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="font-inter hover:bg-velocity-50"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2 font-inter">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};

export const TemplateDetails: StoryObj = {
  render: () => {
    const template = templates[0]; // Customer Satisfaction
    const Icon = template.icon;
    
    return (
      <div className="space-y-6 font-sans max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Detalles de plantilla</h2>
          
          <Card className="border-border bg-background">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 rounded-lg ${template.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-poppins">{template.title}</CardTitle>
                  <CardDescription className="font-inter">{template.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-velocity-500 font-poppins">{template.questions}</div>
                  <div className="text-sm text-muted-foreground font-inter">Preguntas</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-forms-500 font-poppins">{template.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground font-inter">Tiempo estimado</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 font-poppins">Estructura del formulario</h3>
                <div className="space-y-3">
                  {template.questionsList.map((question: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-velocity-100 text-velocity-700 flex items-center justify-center text-sm font-medium font-poppins">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground font-inter">{question}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex space-x-2">
              <Button className="flex-1 bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">
                <Copy className="w-4 h-4 mr-2" />
                Usar esta plantilla
              </Button>
              <Button variant="outline" className="font-poppins">
                Personalizar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  },
};

export const CustomTemplate: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Crear plantilla personalizada</h2>
        
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Nueva plantilla</CardTitle>
            <CardDescription className="font-inter">
              Diseña tu propia plantilla desde cero o basándote en una existente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2 font-poppins">Comenzar plantilla personalizada</h3>
              <p className="text-sm text-muted-foreground mb-4 font-inter">
                Crea una plantilla única que puedas reutilizar múltiples veces
              </p>
              <Button className="bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">
                <Plus className="w-4 h-4 mr-2" />
                Crear desde cero
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};