import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { 
  Upload, 
  Edit3, 
  Eye, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Settings,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta: Meta = {
  title: 'Form Creation/Complete Flow',
  parameters: {
    docs: {
      description: {
        component: 'Flujo completo de creación de formularios desde carga hasta publicación',
      },
    },
  },
};

export default meta;

// Componente de flujo completo
const CompleteFormFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      title: 'Cargar Archivo',
      description: 'Sube tu archivo Excel o CSV',
      icon: Upload,
      content: 'Arrastra y suelta tu archivo aquí o haz clic para seleccionar',
    },
    {
      title: 'Editar Formulario',
      description: 'Personaliza preguntas y diseño',
      icon: Edit3,
      content: 'Edita el título, descripción y cada pregunta',
    },
    {
      title: 'Vista Previa',
      description: 'Revisa cómo se verá tu formulario',
      icon: Eye,
      content: 'Mira cómo los usuarios verán tu formulario',
    },
    {
      title: 'Publicar',
      description: 'Comparte tu formulario',
      icon: CheckCircle,
      content: 'Publica en Google Forms y comparte el enlace',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / (steps.length - 1)) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 1) / (steps.length - 1)) * 100);
    }
  };

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground font-poppins mb-2">
          Flujo Completo de Creación
        </h2>
        <p className="text-muted-foreground font-inter">
          Desde la carga del archivo hasta la publicación en Google Forms
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-velocity-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-velocity-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-sm">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="font-medium font-poppins text-foreground">{step.title}</div>
              <div className="text-xs text-muted-foreground font-inter">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      <Progress value={progress} className="mb-6" />

      {/* Step Content */}
      <Card className="border-border bg-background">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <CurrentStepIcon className="w-6 h-6 text-velocity-500" />
            <div>
              <CardTitle className="text-xl font-poppins">{steps[currentStep].title}</CardTitle>
              <CardDescription className="font-inter">{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={currentStep.toString()} className="w-full">
            <TabsList className="hidden">
              {steps.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()} />
              ))}
            </TabsList>
            
            {steps.map((step, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-4">
                {index === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2 font-poppins">Cargar archivo</h3>
                    <p className="text-sm text-muted-foreground mb-4 font-inter">
                      Soporta archivos .xlsx, .xls y .csv hasta 10MB
                    </p>
                    <Button className="bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">
                      Seleccionar archivo
                    </Button>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-muted rounded-lg">
                        <FileText className="w-8 h-8 text-velocity-500 mx-auto mb-2" />
                        <div className="text-sm font-medium font-poppins">Excel</div>
                        <div className="text-xs text-muted-foreground font-inter">.xlsx, .xls</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <FileText className="w-8 h-8 text-forms-500 mx-auto mb-2" />
                        <div className="text-sm font-medium font-poppins">CSV</div>
                        <div className="text-xs text-muted-foreground font-inter">.csv</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <FileText className="w-8 h-8 text-excel-500 mx-auto mb-2" />
                        <div className="text-sm font-medium font-poppins">Google Sheets</div>
                        <div className="text-xs text-muted-foreground font-inter">Importar</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {index === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-foreground mb-2 font-poppins">Formulario: Encuesta de Satisfacción</h4>
                      <p className="text-sm text-muted-foreground mb-4 font-inter">
                        Ayúdanos a mejorar nuestro servicio
                      </p>
                      
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium font-poppins">1. ¿Cómo calificarías tu experiencia?</span>
                            <Badge variant="secondary" className="font-inter">Obligatorio</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground font-inter">Escala 1-5</div>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium font-poppins">2. ¿Qué podríamos mejorar?</span>
                            <Badge variant="outline" className="font-inter">Opcional</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground font-inter">Texto largo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {index === 2 && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 font-poppins">
                        Encuesta de Satisfacción
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 font-inter">
                        Ayúdanos a mejorar nuestro servicio
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 font-poppins">
                            1. ¿Cómo calificarías tu experiencia?
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                className="w-10 h-10 border rounded hover:bg-velocity-100 transition-colors"
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 font-poppins">
                            2. ¿Qué podríamos mejorar?
                          </label>
                          <textarea 
                            className="w-full p-2 border rounded h-24"
                            placeholder="Tu respuesta..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {index === 3 && (
                  <div className="space-y-4">
                    <div className="text-center p-8 bg-excel-50 rounded-lg">
                      <CheckCircle className="w-12 h-12 text-excel-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2 font-poppins">
                        ¡Formulario listo!
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 font-inter">
                        Tu formulario ha sido creado exitosamente
                      </p>
                      
                      <div className="space-y-3">
                        <Button className="w-full bg-excel-500 hover:bg-excel-600 text-white font-poppins">
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartir en Google Forms
                        </Button>
                        
                        <div className="text-sm text-muted-foreground font-inter">
                          Enlace: forms.google.com/fast-form-12345
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="font-poppins"
          >
            Anterior
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                className="bg-velocity-500 hover:bg-velocity-600 text-white font-poppins"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-excel-500 hover:bg-excel-600 text-white font-poppins">
                Finalizar
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export const CompleteFlow: StoryObj = {
  render: () => <CompleteFormFlow />,
};

export const QuickStart: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Inicio rápido</h2>
        <p className="text-muted-foreground font-inter">
          Crea tu primer formulario en 4 pasos simples
        </p>
      </div>
      
      <Card className="border-border bg-background">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-velocity-500 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <div className="font-medium font-poppins">Cargar archivo</div>
                <div className="text-sm text-muted-foreground font-inter">Sube tu Excel o CSV</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-forms-500 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <div className="font-medium font-poppins">Editar preguntas</div>
                <div className="text-sm text-muted-foreground font-inter">Personaliza cada pregunta</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-excel-500 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <div className="font-medium font-poppins">Vista previa</div>
                <div className="text-sm text-muted-foreground font-inter">Revisa antes de publicar</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-neutral-500 text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <div className="font-medium font-poppins">Publicar</div>
                <div className="text-sm text-muted-foreground font-inter">Comparte en Google Forms</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};