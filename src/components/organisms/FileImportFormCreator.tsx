'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { Loader2 } from 'lucide-react';
import { useFileUpload } from '@/containers/useFileUpload';
import { useCredits } from '@/containers/useCredits';
import FormInstructions from './FormInstructions';

interface FileImportFormCreatorProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
}

export function FileImportFormCreator({ onFormCreated, currentCredits = 0 }: FileImportFormCreatorProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const { handleFileSelect: uploadFile, questions: parsedQuestionsFromUpload } = useFileUpload();
  const { consumeCredits } = useCredits();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      handleFileUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleFileUpload = async (file: File) => {
    if (currentCredits < 1) {
      setError('No tienes suficientes créditos para importar archivos (requiere 1 crédito)');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Simulate file processing
      const questions = [
        {
          id: 'q1',
          title: '¿Cuál es tu nombre?',
          type: 'short_text',
          required: true,
          options: [],
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'q2',
          title: '¿Cuál es tu edad?',
          type: 'number',
          required: true,
          options: [],
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      clearInterval(progressInterval);
      setProgress(100);

      setParsedQuestions(questions);
      setFormTitle(`Formulario importado: ${file.name}`);
      setFormDescription(`Formulario creado desde archivo ${file.name} (${questions.length} preguntas)`);

      // Consume credits
      await consumeCredits({
        amount: 1,
        formTitle: file.name
      });

    } catch (error) {
      setError('Error al procesar el archivo. Asegúrate de que el formato sea correcto.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateForm = () => {
    if (parsedQuestions.length > 0) {
      onFormCreated?.({
        title: formTitle,
        description: formDescription,
        questions: parsedQuestions,
        creationMethod: 'file'
      });
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['Pregunta', 'Tipo', 'Opciones', 'Requerido'],
      ['¿Cuál es tu nombre?', 'short_text', '', 'TRUE'],
      ['¿Cuál es tu edad?', 'number', '', 'TRUE'],
      ['¿Cuál es tu color favorito?', 'multiple_choice', 'Rojo,Azul,Verde,Otro', 'FALSE'],
      ['¿Estás de acuerdo con los términos?', 'checkboxes', 'Sí', 'TRUE']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-formulario.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Importar desde archivo</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sube un archivo CSV o Excel y lo convertiremos automáticamente en un formulario
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Procesando archivo...</p>
              <Progress value={progress} className="w-full max-w-xs" />
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">Archivo cargado: {uploadedFile.name}</p>
              <Badge variant="secondary">{uploadedFile.type}</Badge>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium">
                {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta o haz clic para seleccionar'}
              </p>
              <p className="text-sm text-muted-foreground">
                CSV, Excel (máx. 10MB)
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {parsedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formulario importado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título del formulario</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md min-h-[60px]"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Preguntas importadas ({parsedQuestions.length}):</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {parsedQuestions.map((q, index) => (
                  <div key={q.id} className="p-2 bg-muted rounded text-sm">
                    <span className="font-medium">{index + 1}.</span> {q.title}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {q.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleCreateForm} className="w-full">
              Crear formulario en Google Forms
            </Button>
          </CardContent>
        </Card>
      )}
      <FormInstructions />
    </div>
  );
}