import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings, 
  Copy,
  Move,
  CheckCircle2,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

const meta: Meta = {
  title: 'Form Creation/Form Editor',
  parameters: {
    docs: {
      description: {
        component: 'Editor visual de formularios con vista previa en tiempo real',
      },
    },
  },
};

export default meta;

// Tipos de preguntas disponibles
const questionTypes = [
  { value: 'text', label: 'Texto corto', icon: 'T' },
  { value: 'textarea', label: 'Texto largo', icon: '¶' },
  { value: 'email', label: 'Email', icon: '@' },
  { value: 'number', label: 'Número', icon: '#' },
  { value: 'select', label: 'Opción múltiple', icon: '☐' },
  { value: 'radio', label: 'Opción única', icon: '⊙' },
  { value: 'checkbox', label: 'Casillas', icon: '☑' },
  { value: 'date', label: 'Fecha', icon: '📅' },
  { value: 'scale', label: 'Escala', icon: '↔' },
];

// Componente de pregunta editable
const EditableQuestion = ({ 
  question, 
  onUpdate, 
  onDelete, 
  index 
}: { 
  question: any; 
  onUpdate: (id: string, updates: any) => void; 
  onDelete: (id: string) => void; 
  index: number;
}) => {
  return (
    <Card className="border-border bg-background hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground font-inter">{index + 1}.</span>
            <Input 
              value={question.title}
              onChange={(e) => onUpdate(question.id, { title: e.target.value })}
              className="font-medium text-foreground font-poppins border-none shadow-none p-0 h-auto"
              placeholder="Título de la pregunta"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Move className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={() => onDelete(question.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label className="text-xs font-medium text-muted-foreground font-inter">Tipo</Label>
            <Select 
              value={question.type} 
              onValueChange={(value) => onUpdate(question.id, { type: value })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={question.required}
              onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
            />
            <Label className="text-xs font-medium font-inter">Requerido</Label>
          </div>
        </div>
        
        {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground font-inter">Opciones</Label>
            {question.options?.map((option: string, optIndex: number) => (
              <div key={optIndex} className="flex items-center space-x-2">
                <Input 
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...question.options];
                    newOptions[optIndex] = e.target.value;
                    onUpdate(question.id, { options: newOptions });
                  }}
                  className="text-sm h-8"
                  placeholder={`Opción ${optIndex + 1}`}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500"
                  onClick={() => {
                    const newOptions = question.options.filter((_: any, i: number) => i !== optIndex);
                    onUpdate(question.id, { options: newOptions });
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => {
                const newOptions = [...(question.options || []), ''];
                onUpdate(question.id, { options: newOptions });
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Agregar opción
            </Button>
          </div>
        )}
        
        <div>
          <Label className="text-xs font-medium text-muted-foreground font-inter">Descripción (opcional)</Label>
          <Input 
            value={question.description || ''}
            onChange={(e) => onUpdate(question.id, { description: e.target.value })}
            className="text-sm h-8"
            placeholder="Texto de ayuda para el usuario"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Vista previa de la pregunta
const QuestionPreview = ({ question }: { question: any }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return <input type="text" className="w-full px-3 py-2 border border-border rounded-md text-sm" placeholder="Respuesta corta..." />;
      case 'textarea':
        return <textarea className="w-full px-3 py-2 border border-border rounded-md text-sm" rows={3} placeholder="Respuesta larga..." />;
      case 'email':
        return <input type="email" className="w-full px-3 py-2 border border-border rounded-md text-sm" placeholder="tu@email.com" />;
      case 'number':
        return <input type="number" className="w-full px-3 py-2 border border-border rounded-md text-sm" placeholder="0" />;
      case 'select':
        return (
          <select className="w-full px-3 py-2 border border-border rounded-md text-sm">
            <option>Selecciona una opción...</option>
            {question.options?.map((option: string, index: number) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="radio" name={question.id} />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'date':
        return <input type="date" className="w-full px-3 py-2 border border-border rounded-md text-sm" />;
      case 'scale':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(num => (
              <label key={num} className="flex flex-col items-center">
                <input type="radio" name={question.id} />
                <span className="text-xs mt-1">{num}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium text-foreground font-poppins">{question.title}</Label>
        {question.required && <Badge className="bg-velocity-100 text-velocity-700 text-xs font-medium">Requerido</Badge>}
      </div>
      {question.description && (
        <p className="text-xs text-muted-foreground font-inter">{question.description}</p>
      )}
      {renderInput()}
    </div>
  );
};

// Componente principal del editor
const FormEditor = () => {
  const [questions, setQuestions] = useState([
    {
      id: '1',
      title: '¿Cuál es tu nombre completo?',
      type: 'text',
      required: true,
      description: 'Por favor, ingresa tu nombre y apellidos',
    },
    {
      id: '2',
      title: '¿Cuál es tu correo electrónico?',
      type: 'email',
      required: true,
      description: 'Nos pondremos en contacto contigo',
    },
    {
      id: '3',
      title: '¿Cómo calificarías nuestro servicio?',
      type: 'scale',
      required: false,
      description: 'Del 1 (malo) al 5 (excelente)',
    },
  ]);

  const [formTitle, setFormTitle] = useState('Encuesta de Satisfacción');
  const [formDescription, setFormDescription] = useState('Ayúdanos a mejorar nuestro servicio');

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      title: 'Nueva pregunta',
      type: 'text',
      required: false,
      description: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Editor de formularios</h2>
        
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="font-poppins">Editor</TabsTrigger>
            <TabsTrigger value="preview" className="font-poppins">Vista previa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Configuración del formulario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium font-poppins">Título del formulario</Label>
                  <Input 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="font-poppins"
                    placeholder="Título del formulario"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium font-poppins">Descripción</Label>
                  <Input 
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="font-inter"
                    placeholder="Descripción del formulario"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground font-poppins">Preguntas</h3>
                <Button 
                  onClick={addQuestion}
                  className="bg-velocity-500 hover:bg-velocity-600 text-white font-poppins"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar pregunta
                </Button>
              </div>
              
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <EditableQuestion 
                    key={question.id}
                    question={question}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins">{formTitle}</CardTitle>
                <CardDescription className="font-inter">{formDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question) => (
                  <QuestionPreview key={question.id} question={question} />
                ))}
                
                <div className="pt-4 border-t">
                  <Button className="w-full bg-excel-500 hover:bg-excel-600 text-white font-poppins">
                    Enviar respuesta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const Editor: StoryObj = {
  render: () => <FormEditor />,
};

export const EmptyState: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Estado vacío</h2>
        
        <Card className="border-2 border-dashed border-border">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2 font-poppins">Formulario vacío</h3>
            <p className="text-sm text-muted-foreground mb-4 font-inter">
              Comienza agregando tu primera pregunta
            </p>
            <Button className="bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">
              <Plus className="w-4 h-4 mr-2" />
              Agregar pregunta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const ValidationStates: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Estados de validación</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-poppins">
                <CheckCircle2 className="w-5 h-5 mr-2 text-excel-500" />
                Formulario válido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className="bg-excel-100 text-excel-700 border border-excel-200 font-medium font-inter">
                  5 preguntas
                </Badge>
                <Badge className="bg-excel-100 text-excel-700 border border-excel-200 font-medium font-inter">
                  Todos los títulos completos
                </Badge>
                <Badge className="bg-excel-100 text-excel-700 border border-excel-200 font-medium font-inter">
                  Listo para publicar
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-poppins">
                <AlertCircle className="w-5 h-5 mr-2 text-velocity-500" />
                Errores pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-velocity-700 bg-velocity-50 p-2 rounded font-inter">
                  ⚠️ Falta título en la pregunta 2
                </div>
                <div className="text-sm text-velocity-700 bg-velocity-50 p-2 rounded font-inter">
                  ⚠️ Opción 3 en pregunta 4 está vacía
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};