'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, FileSpreadsheet, Download } from 'lucide-react';
import { useFileUpload } from '@/containers/useFileUpload';
import { QuestionType } from '@/domain/types';
import { Question } from '@/domain/entities/question';
import * as XLSX from 'xlsx';

export interface FileUploadCardProps {
  onQuestionsLoaded?: (questions: Question[]) => void;
  className?: string;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ 
  onQuestionsLoaded,
  className = ""
}) => {
  const { 
    loading, 
    progress, 
    error, 
    questions, 
    handleFileSelect: uploadFile, 
    clearError,
    clearFile
  } = useFileUpload();

  // Notificar cuando se cargan las preguntas
  useEffect(() => {
    if (questions.length > 0 && onQuestionsLoaded) {
      onQuestionsLoaded(questions);
    }
  }, [questions, onQuestionsLoaded]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    const labels = {
      [QuestionType.SHORT_TEXT]: 'Texto Corto',
      [QuestionType.LONG_TEXT]: 'Texto Largo',
      [QuestionType.MULTIPLE_CHOICE]: 'Opción Múltiple',
      [QuestionType.CHECKBOXES]: 'Selección Múltiple',
      [QuestionType.DROPDOWN]: 'Lista Desplegable',
      [QuestionType.LINEAR_SCALE]: 'Escala Linear',
      [QuestionType.DATE]: 'Fecha',
      [QuestionType.TIME]: 'Hora',
      [QuestionType.EMAIL]: 'Email',
      [QuestionType.NUMBER]: 'Número',
      [QuestionType.PHONE]: 'Teléfono'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: QuestionType): string => {
    const colors = {
      [QuestionType.SHORT_TEXT]: 'bg-blue-50 text-blue-700',
      [QuestionType.LONG_TEXT]: 'bg-purple-50 text-purple-700',
      [QuestionType.MULTIPLE_CHOICE]: 'bg-green-50 text-green-700',
      [QuestionType.CHECKBOXES]: 'bg-yellow-50 text-yellow-700',
      [QuestionType.DROPDOWN]: 'bg-orange-50 text-orange-700',
      [QuestionType.LINEAR_SCALE]: 'bg-pink-50 text-pink-700',
      [QuestionType.DATE]: 'bg-red-50 text-red-700',
      [QuestionType.TIME]: 'bg-red-50 text-red-700',
      [QuestionType.EMAIL]: 'bg-indigo-50 text-indigo-700',
      [QuestionType.NUMBER]: 'bg-gray-50 text-gray-700',
      [QuestionType.PHONE]: 'bg-cyan-50 text-cyan-700'
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  const generateExampleExcel = () => {
    // Datos de ejemplo con todos los tipos de preguntas soportados
    const exampleData = [
      // Header
      ['Pregunta', 'Tipo', 'Opciones', 'Requerido', 'Descripción'],
      
      // Ejemplos para cada tipo
      ['¿Cuál es tu nombre completo?', 'short_text', '', 'Sí', 'Ingresa tu nombre y apellidos'],
      ['¿Podrías contarnos tu experiencia?', 'long_text', '', 'No', 'Describe tu experiencia en detalle'],
      ['¿Cuál es tu color favorito?', 'multiple_choice', 'Rojo,Azul,Verde,Amarillo,Otro', 'No', 'Selecciona una opción'],
      ['¿Qué deportes practicas?', 'checkboxes', 'Fútbol,Básquet,Tenis,Natación,Ciclismo', 'No', 'Puedes seleccionar múltiples opciones'],
      ['¿Cuál es tu país de residencia?', 'dropdown', 'México,España,Colombia,Argentina,Chile,Perú', 'Sí', 'Selecciona de la lista'],
      ['¿Cómo calificarías nuestro servicio?', 'linear_scale', '1-5', 'No', 'Escala del 1 (malo) al 5 (excelente)'],
      ['¿Cuál es tu fecha de nacimiento?', 'date', '', 'No', 'Formato: DD/MM/AAAA'],
      ['¿A qué hora prefieres ser contactado?', 'time', '', 'No', 'Formato: HH:MM'],
      ['¿Cuál es tu correo electrónico?', 'email', '', 'Sí', 'Ingresa un email válido'],
      ['¿Cuántos años tienes?', 'number', '', 'No', 'Solo números'],
      ['¿Cuál es tu número de teléfono?', 'phone', '', 'No', 'Incluye código de país si es necesario']
    ];

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(exampleData);
    
    // Configurar ancho de columnas
    const columnWidths = [
      { wch: 35 }, // Pregunta
      { wch: 15 }, // Tipo
      { wch: 40 }, // Opciones
      { wch: 10 }, // Requerido
      { wch: 35 }  // Descripción
    ];
    worksheet['!cols'] = columnWidths;

    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ejemplo Formulario');
    
    // Descargar archivo
    XLSX.writeFile(workbook, 'ejemplo_formulario_completo.xlsx');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-velocity" />
            Subir Archivo de Preguntas
          </CardTitle>
          <CardDescription className="text-gray-700">
            Sube un archivo Excel (.xlsx) o CSV (.csv) con las preguntas para tu formulario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formato Compatible */}
          <Alert className="bg-white border border-gray-200">
            <FileSpreadsheet className="w-4 h-4 text-excel" />
            <AlertDescription className="space-y-2">
              <div>
                <strong>Formato requerido:</strong> Tu archivo debe tener estas columnas:
              </div>
              <code className="block bg-gray-100 px-2 py-1 rounded text-sm">
                Pregunta | Tipo | Opciones | Requerido | Descripción
              </code>
              <div className="space-y-1">
                <div><strong>Tipos soportados:</strong></div>
                <div className="text-xs grid grid-cols-2 gap-1 text-gray-700">
                  <span>• short_text (Respuesta corta)</span>
                  <span>• long_text (Respuesta larga)</span>
                  <span>• multiple_choice (Opción múltiple)</span>
                  <span>• checkboxes (Casillas múltiples)</span>
                  <span>• dropdown (Lista desplegable)</span>
                  <span>• linear_scale (Escala lineal)</span>
                  <span>• date (Fecha)</span>
                  <span>• time (Hora)</span>
                  <span>• email (Correo electrónico)</span>
                  <span>• number (Número)</span>
                  <span>• phone (Teléfono)</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Download Example Button */}
          <div className="bg-excel-light p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">¿Necesitas un ejemplo?</p>
                <p className="text-xs text-muted">
                  Descarga un archivo Excel con ejemplos de todos los tipos
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateExampleExcel}
                className="flex items-center gap-2 border-excel text-excel hover:bg-excel/5"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileSelect}
              disabled={loading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer flex flex-col items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FileText className="w-12 h-12 text-gray-400" />
              <span className="text-lg font-medium text-primary">
                {loading ? 'Procesando archivo...' : 'Haz clic para seleccionar archivo'}
              </span>
              <span className="text-sm text-muted">
                Archivos soportados: .xlsx, .csv (máx. 10MB)
              </span>
            </label>
          </div>

          {/* Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-primary">
                <span>Procesando archivo...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="ml-2"
                >
                  Intentar de nuevo
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Success with Questions Preview */}
          {questions.length > 0 && (
            <Alert className="bg-white border border-gray-200">
              <CheckCircle className="w-4 h-4 text-excel" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span className="text-primary">✅ {questions.length} preguntas procesadas exitosamente</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFile}
                  >
                    Limpiar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Questions Preview */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Preview de Preguntas ({questions.length})
            </CardTitle>
            <CardDescription className="text-gray-700">
              Revisa las preguntas antes de crear el formulario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 space-y-2 bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted">
                          #{index + 1}
                        </span>
                        <Badge className={getTypeColor(question.type)}>
                          {getQuestionTypeLabel(question.type)}
                        </Badge>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">
                            Requerida
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-primary">
                        {question.title}
                      </h4>
                      {question.description && (
                        <p className="text-sm text-muted mt-1">
                          {question.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Options Preview */}
                  {question.multipleChoiceConfig?.options && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted mb-2">
                        Opciones disponibles:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {question.multipleChoiceConfig.options.map((option, optIndex) => (
                          <Badge
                            key={optIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploadCard; 