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
      type: 'linear_scale',
      title: 'Escala Lineal',
      description: 'Permite calificar en una escala numérica de 1 a 5 o 1 a 10.',
      example: (
        <div className="space-y-3 text-sm">
          <p className="font-medium">¿Qué tan satisfecho estás con el servicio?</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Muy insatisfecho</span>
            {[1, 2, 3, 4, 5].map(num => (
              <label key={num} className="flex flex-col items-center">
                <input type="radio" name="linear-scale" className="w-4 h-4" />
                <span className="text-xs mt-1">{num}</span>
              </label>
            ))}
            <span className="text-xs text-gray-600">Muy satisfecho</span>
          </div>
        </div>
      ),
      usage: 'Evaluación de satisfacción, calificaciones de desempeño',
      validation: 'Selección obligatoria'
    },

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