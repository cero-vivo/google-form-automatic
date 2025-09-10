import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download,
  FileSpreadsheet,
  FileJson,
  Clock
} from 'lucide-react';

const meta: Meta = {
  title: 'Form Creation/Upload Components',
  parameters: {
    docs: {
      description: {
        component: 'Componentes especializados para la carga y procesamiento de archivos',
      },
    },
  },
};

export default meta;

// Componente simulado de drag & drop
const FileUploadZone = ({ 
  file, 
  progress, 
  status, 
  error 
}: { 
  file?: { name: string; size: number; type: string };
  progress?: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
}) => {
  const getIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <FileSpreadsheet className="w-12 h-12 text-forms-500" />;
      case 'success':
        return <CheckCircle2 className="w-12 h-12 text-excel-500" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Upload className="w-12 h-12 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Subiendo archivo...';
      case 'processing':
        return 'Procesando datos...';
      case 'success':
        return 'Archivo procesado exitosamente';
      case 'error':
        return error || 'Error al procesar';
      default:
        return 'Arrastra tu archivo aquí o haz clic para seleccionar';
    }
  };

  return (
    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-all duration-200 hover:border-forms-300 hover:bg-forms-50/30">
      <div className="flex flex-col items-center space-y-4">
        {getIcon()}
        <div>
          <p className="text-sm font-medium text-foreground font-poppins">{getStatusText()}</p>
          {file && (
            <p className="text-xs text-muted-foreground font-inter mt-1">
              {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
        
        {progress !== undefined && (
          <div className="w-full max-w-xs">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground font-inter mt-1">{progress}%</p>
          </div>
        )}
        
        {status === 'idle' && (
          <Button className="bg-velocity-500 hover:bg-velocity-600 text-white font-poppins">
            Seleccionar archivo
          </Button>
        )}
      </div>
    </div>
  );
};

export const DragDropZone: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Zona de carga de archivos</h2>
        
        <div className="space-y-6">
          <FileUploadZone status="idle" />
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-inter">
              Formatos soportados: .xlsx, .csv. Tamaño máximo: 10MB
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  ),
};

export const UploadProgress: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Progreso de carga</h2>
        
        <div className="space-y-4">
          <FileUploadZone 
            file={{ name: 'encuesta_clientes.xlsx', size: 2457600, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }}
            progress={75}
            status="uploading"
          />
        </div>
      </div>
    </div>
  ),
};

export const ProcessingStates: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Estados de procesamiento</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">Procesando archivo</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadZone 
                file={{ name: 'datos_ventas.csv', size: 1048576, type: 'text/csv' }}
                progress={100}
                status="processing"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">Archivo procesado exitosamente</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadZone 
                file={{ name: 'formulario_completo.xlsx', size: 3145728, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }}
                status="success"
              />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-inter">Preguntas detectadas:</span>
                  <span className="font-medium text-foreground font-inter">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-inter">Tiempo de procesamiento:</span>
                  <span className="font-medium text-foreground font-inter">3.2s</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">Error en el procesamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadZone 
                file={{ name: 'archivo_corrupto.csv', size: 512000, type: 'text/csv' }}
                status="error"
                error="El archivo contiene formato inválido o está dañado"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const FileValidation: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Validación de archivos</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Resultados de validación</CardTitle>
            <CardDescription className="font-inter">Análisis detallado del archivo subido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-excel-500" />
                  <span className="text-sm font-medium text-foreground font-inter">Formato válido</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-excel-500" />
                  <span className="text-sm font-medium text-foreground font-inter">Estructura correcta</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-excel-500" />
                  <span className="text-sm font-medium text-foreground font-inter">Encoding UTF-8</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-velocity-500" />
                  <span className="text-sm font-medium text-foreground font-inter">Procesando tipos</span>
                </div>
                <div className="text-sm text-muted-foreground font-inter">
                  <p>Tamaño: 2.4 MB</p>
                  <p>Filas: 1,247</p>
                  <p>Columnas: 8</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-foreground mb-2 font-poppins">Tipos de preguntas detectadas:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-forms-100 text-forms-700 font-medium font-inter">Texto corto (3)</Badge>
                <Badge className="bg-forms-100 text-forms-700 font-medium font-inter">Email (1)</Badge>
                <Badge className="bg-forms-100 text-forms-700 font-medium font-inter">Opción múltiple (2)</Badge>
                <Badge className="bg-forms-100 text-forms-700 font-medium font-inter">Escala (2)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const SupportedFormats: StoryObj = {
  render: () => (
    <div className="space-y-8 font-sans max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Formatos soportados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-poppins">
                <FileSpreadsheet className="w-5 h-5 mr-2 text-forms-500" />
                Microsoft Excel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                <li>• .xlsx (recomendado)</li>
                <li>• .xls (soportado)</li>
                <li>• Máximo 10MB</li>
                <li>• Primera hoja procesada</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-poppins">
                <FileJson className="w-5 h-5 mr-2 text-forms-500" />
                CSV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground font-inter">
                <li>• .csv estándar</li>
                <li>• UTF-8 encoding</li>
                <li>• Coma o punto y coma</li>
                <li>• Headers en primera fila</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};