import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, CalendarIcon, Clock } from 'lucide-react';

interface AdvancedQuestionExamplesProps {
  className?: string;
}

export const AdvancedQuestionExamples: React.FC<AdvancedQuestionExamplesProps> = ({ className }) => {
  const examples = [
    {
      type: 'file_upload',
      title: 'Subir Archivo',
      description: 'Permite a los usuarios subir archivos como CV, imágenes o documentos.',
      example: (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Arrastra y suelta o haz clic para subir</p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX hasta 10MB</p>
        </div>
      ),
      usage: 'CV, facturas, imágenes de productos',
      validation: 'Formato de archivo, tamaño máximo'
    },
    {
      type: 'grid',
      title: 'Pregunta de Matriz (Grid)',
      description: 'Crea tablas con filas y columnas para evaluaciones múltiples.',
      example: (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-4 gap-2 font-medium">
            <span>Producto</span>
            <span className="text-center">Excelente</span>
            <span className="text-center">Bueno</span>
            <span className="text-center">Regular</span>
          </div>
          <div className="grid grid-cols-4 gap-2 items-center">
            <span>Producto A</span>
            <div className="flex justify-center">
              <input type="radio" name="grid-example" className="w-4 h-4" />
            </div>
            <div className="flex justify-center">
              <input type="radio" name="grid-example" className="w-4 h-4" />
            </div>
            <div className="flex justify-center">
              <input type="radio" name="grid-example" className="w-4 h-4" />
            </div>
          </div>
        </div>
      ),
      usage: 'Evaluaciones de productos, satisfacción por áreas',
      validation: 'Al menos una opción por fila'
    },
    {
      type: 'rating',
      title: 'Calificación (Rating)',
      description: 'Escala numérica para evaluar satisfacción o preferencia.',
      example: (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Malo</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="h-8 w-8 text-yellow-400 hover:text-yellow-500 text-lg"
                type="button"
              >
                ⭐
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600">Excelente</span>
        </div>
      ),
      usage: 'Satisfacción del cliente, evaluación de servicios',
      validation: 'Rango configurable (1-5, 1-10)'
    },
    {
      type: 'datetime',
      title: 'Fecha y Hora',
      description: 'Selector de fecha y hora completo para citas o eventos.',
      example: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <Input type="date" className="w-40" />
            <Clock className="h-4 w-4 text-gray-500" />
            <Input type="time" className="w-32" />
          </div>
        </div>
      ),
      usage: 'Citas médicas, reuniones, reservas',
      validation: 'Fecha futura, horarios laborales'
    }
  ];

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Tipos de Preguntas Avanzadas</h3>
        <p className="text-sm text-gray-600">
          Descubre las nuevas opciones disponibles para crear formularios más completos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {examples.map((example, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{example.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {example.type.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {example.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {example.example}
              </div>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-medium">Uso común:</span>
                  <span className="text-gray-600 ml-1">{example.usage}</span>
                </div>
                <div>
                  <span className="font-medium">Validación:</span>
                  <span className="text-gray-600 ml-1">{example.validation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Consejo de uso</h4>
        <p className="text-sm text-blue-800">
          Para usar estos tipos avanzados en tu archivo CSV/Excel, simplemente especifica el tipo 
          en la columna "tipo": archivo, matriz, calificacion, fecha_hora
        </p>
      </div>
    </div>
  );
};