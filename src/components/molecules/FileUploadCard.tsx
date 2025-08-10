'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  X,
  RefreshCw,
  Download
} from 'lucide-react';
import { useFileUpload } from '@/containers/useFileUpload';

export interface FileUploadCardProps {
  onQuestionsLoaded?: (questions: any[]) => void;
  className?: string;
  disabled?: boolean;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  onQuestionsLoaded,
  className = '',
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    file,
    questions,
    loading,
    progress,
    error,
    validation,
    handleFileSelect,
    handleFileDrop,
    clearFile,
    clearError,
    retryParsing
  } = useFileUpload();

  // Notificar cuando se cargan las preguntas
  React.useEffect(() => {
    if (questions.length > 0 && onQuestionsLoaded) {
      onQuestionsLoaded(questions);
    }
  }, [questions, onQuestionsLoaded]);

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      await handleFileSelect(selectedFile);
    }
  };

  const handleDropZoneClick = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!disabled && !loading) {
      await handleFileDrop(event);
    }
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadSampleFile = () => {
    // Crear un archivo CSV de ejemplo
    const sampleData = `Pregunta,Tipo,Opciones,Requerido,Descripción
¿Cuál es tu nombre?,texto_corto,,true,Ingresa tu nombre completo
¿Tu edad?,numero,,true,Edad en años
¿Color favorito?,opcion_multiple,"Rojo,Verde,Azul,Amarillo",false,Selecciona tu color preferido
¿Cómo calificarías nuestro servicio?,escala,,true,Del 1 al 10
¿Comentarios adicionales?,texto_largo,,false,Cualquier comentario que quieras agregar`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ejemplo-formulario.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Subir Archivo Excel/CSV
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Formatos soportados: .xlsx, .xls, .csv (máximo 10MB)
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSampleFile}
            className="flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Descargar ejemplo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Zona de Drop */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${loading || disabled 
              ? 'border-muted-foreground/25 bg-muted/50 cursor-not-allowed' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/25'
            }
            ${file && !error ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : ''}
          `}
          onClick={handleDropZoneClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || loading}
          />

          {loading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Procesando archivo...</p>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground">{progress}% completado</p>
              </div>
            </div>
          ) : file ? (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <div className="space-y-2">
                <p className="font-medium text-green-700 dark:text-green-300">
                  Archivo cargado exitosamente
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <Badge variant="outline">{getFileSize(file.size)}</Badge>
                </div>
                {questions.length > 0 && (
                  <Badge variant="default" className="bg-green-500">
                    {questions.length} pregunta{questions.length !== 1 ? 's' : ''} encontrada{questions.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Limpiar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Sube archivos Excel (.xlsx, .xls) o CSV con tus preguntas
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Información de validación */}
        {validation && (
          <div className="space-y-2">
            {validation.warnings.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Advertencias:</p>
                    <ul className="list-disc list-inside text-sm">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Error al procesar archivo</p>
                  <p className="text-sm">{error}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearError}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {file && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryParsing}
                      disabled={loading}
                    >
                      <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                      Reintentar
                    </Button>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Formato esperado */}
        {!file && !loading && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Formato esperado del archivo:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• <strong>Pregunta:</strong> El texto de la pregunta</p>
              <p>• <strong>Tipo:</strong> texto, opcion_multiple, escala, etc.</p>
              <p>• <strong>Opciones:</strong> Para preguntas de opción múltiple (separadas por comas)</p>
              <p>• <strong>Requerido:</strong> true/false o sí/no</p>
              <p>• <strong>Descripción:</strong> Texto adicional (opcional)</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 