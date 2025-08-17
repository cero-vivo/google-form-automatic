import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Grid3X3, Star, CalendarDays, Clock } from 'lucide-react';

interface AdvancedQuestionPreviewProps {
  className?: string;
}

export default function AdvancedQuestionPreview({ className }: AdvancedQuestionPreviewProps) {
  const advancedTypes = [
    {
      type: 'file_upload',
      name: 'Carga de Archivos',
      description: 'Permite a los usuarios subir archivos adjuntos',
      icon: Upload,
      example: {
        question: 'Sube tu CV actualizado',
        options: 'pdf,doc,docx,jpg,png',
        validation: 'Máximo 10MB por archivo'
      }
    },
    {
      type: 'grid',
      name: 'Matriz de Preguntas',
      description: 'Tabla con filas y columnas para evaluar múltiples aspectos',
      icon: Grid3X3,
      example: {
        question: 'Evalúa estos productos',
        options: 'Producto A,Producto B,Producto C|Excelente,Bueno,Regular,Malo',
        validation: 'Selección única por fila'
      }
    },
    {
      type: 'rating',
      name: 'Escala de Calificación',
      description: 'Escala numérica o de estrellas para valoraciones',
      icon: Star,
      example: {
        question: '¿Qué tan satisfecho estás con el servicio?',
        options: '1-10',
        validation: 'Escala del 1 al 10'
      }
    },
    {
      type: 'datetime',
      name: 'Fecha y Hora',
      description: 'Selector de fecha y hora completo',
      icon: CalendarDays,
      example: {
        question: '¿Cuándo fue tu última visita?',
        options: '',
        validation: 'Formato: DD/MM/AAAA HH:MM'
      }
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'file_upload': return Upload;
      case 'grid': return Grid3X3;
      case 'rating': return Star;
      case 'datetime': return CalendarDays;
      default: return Upload;
    }
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Tipos de Preguntas Avanzadas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advancedTypes.map((type) => {
          const Icon = getIcon(type.type);
          return (
            <Card key={type.type} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{type.name}</CardTitle>
                    <CardDescription className="text-xs">{type.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Ejemplo:</span>
                    <p className="text-xs">{type.example.question}</p>
                  </div>
                  {type.example.options && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Opciones:</span>
                      <p className="text-xs text-muted-foreground">{type.example.options}</p>
                    </div>
                  )}
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {type.example.validation}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border">
        <h4 className="text-sm font-medium mb-2">📋 Formato para tipos avanzados:</h4>
        <div className="text-xs space-y-2">
          <div><strong>file_upload:</strong> extensiones permitidas separadas por comas (ej: pdf,doc,jpg)</div>
          <div><strong>grid:</strong> filas|columnas (ej: Producto 1,Producto 2|Excelente,Bueno,Regular)</div>
          <div><strong>rating:</strong> rango numérico (ej: 1-5, 1-10)</div>
          <div><strong>datetime:</strong> sin opciones, usa formato automático</div>
        </div>
      </div>
    </div>
  );
}