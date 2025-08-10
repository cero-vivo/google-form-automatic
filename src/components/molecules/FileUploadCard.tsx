'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useFileUpload } from '@/containers/useFileUpload';
import { QuestionType } from '@/domain/types';
import { Question } from '@/domain/entities/question';

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
      [QuestionType.SHORT_TEXT]: 'bg-blue-100 text-blue-800',
      [QuestionType.LONG_TEXT]: 'bg-purple-100 text-purple-800',
      [QuestionType.MULTIPLE_CHOICE]: 'bg-green-100 text-green-800',
      [QuestionType.CHECKBOXES]: 'bg-yellow-100 text-yellow-800',
      [QuestionType.DROPDOWN]: 'bg-orange-100 text-orange-800',
      [QuestionType.LINEAR_SCALE]: 'bg-pink-100 text-pink-800',
      [QuestionType.DATE]: 'bg-red-100 text-red-800',
      [QuestionType.TIME]: 'bg-red-100 text-red-800',
      [QuestionType.EMAIL]: 'bg-indigo-100 text-indigo-800',
      [QuestionType.NUMBER]: 'bg-gray-100 text-gray-800',
      [QuestionType.PHONE]: 'bg-cyan-100 text-cyan-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Archivo de Preguntas
          </CardTitle>
          <CardDescription>
            Sube un archivo Excel (.xlsx) o CSV (.csv) con las preguntas para tu formulario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formato Compatible */}
          <Alert>
            <FileSpreadsheet className="w-4 h-4" />
            <AlertDescription>
              <strong>Formato Compatible:</strong> Tu archivo debe tener las columnas:
              <br />
              <code className="bg-gray-100 px-1 rounded text-sm">Pregunta | Tipo | Requerida | Opción 1 | Opción 2 | ...</code>
              <br />
              <small className="text-gray-600">
                Tipos soportados: Respuesta corta, Respuesta larga, Opción múltiple, Selección múltiple, etc.
              </small>
            </AlertDescription>
          </Alert>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
              <span className="text-lg font-medium">
                {loading ? 'Procesando archivo...' : 'Haz clic para seleccionar archivo'}
              </span>
              <span className="text-sm text-gray-500">
                Archivos soportados: .xlsx, .csv (máx. 10MB)
              </span>
            </label>
          </div>

          {/* Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
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
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>✅ {questions.length} preguntas procesadas exitosamente</span>
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
              <FileText className="w-5 h-5" />
              Preview de Preguntas ({questions.length})
            </CardTitle>
            <CardDescription>
              Revisa las preguntas antes de crear el formulario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
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
                      <h4 className="font-medium text-gray-900">
                        {question.title}
                      </h4>
                      {question.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {question.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Options Preview */}
                  {question.multipleChoiceConfig?.options && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">
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