'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { useFileUpload } from '@/containers/useFileUpload';
import { useCredits } from '@/containers/useCredits';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { ReusableFormBuilder } from './ReusableFormBuilder';
import FormInstructions from './FormInstructions';
import { FormSuccessView } from './FormSuccessView';

interface FileImportFormCreatorProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
}

export function FileImportFormCreator({ onFormCreated, currentCredits = 0 }: FileImportFormCreatorProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  console.log("🚀 ~ FileImportFormCreator ~ uploadedFile:", uploadedFile)
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  console.log("🚀 ~ FileImportFormCreator ~ parsedQuestions:", parsedQuestions)


  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [collectEmail, setCollectEmail] = useState(true);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [createdFormData, setCreatedFormData] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  const { handleFileSelect, questions, loading, progress, error } = useFileUpload();
  const { createGoogleForm, isCreating: creatingForm, error: formError } = useGoogleFormsIntegration();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Reset all state to start from zero
      setShowSuccessView(false);
      setCreatedFormData(null);
      setUploadedFile(file);
      setParsedQuestions([]);
      setFormTitle('');
      setFormDescription('');
// Remove setProgress line since progress is managed by useFileUpload hook
      // Remove this line since setError is not defined and error state is managed by the useFileUpload hook
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
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: loading
  });

  const handleFileUpload = async (file: File) => {
    if (currentCredits < 1) {
      // This will be handled by the hook's error state
      return;
    }
    
    try {
      await handleFileSelect(file);
    } catch (error) {
      // Errors are handled by the hook's error state
      console.error('Error handling file upload:', error);
    }
  };

  // Update questions when they are parsed
  React.useEffect(() => {
    if (loading) return; // Don't process while loading

    if (questions && questions.length > 0) {
      setParsedQuestions(questions);
      setFormTitle(`Formulario importado: ${uploadedFile?.name || 'Formulario importado'}`);
      setFormDescription(`Formulario creado desde archivo ${uploadedFile?.name || ''} (${questions.length} preguntas)`);
    }
  }, [questions, uploadedFile?.name, loading]);



  const handleCreateForm = async () => {
    if (parsedQuestions.length === 0) {
      console.error('No hay preguntas válidas para crear el formulario');
      return;
    }

    if (!formTitle.trim()) {
      console.error('Debes agregar un título al formulario');
      return;
    }

    if (currentCredits < 1) {
      console.error('No tienes suficientes créditos para crear un formulario');
      return;
    }

    try {
      const result = await createGoogleForm({
        title: formTitle,
        description: formDescription,
        questions: parsedQuestions,
        settings: {
          collectEmails: collectEmail
        }
      });
      console.log("RESULT", result)

      if (result) {
        const formData = {
          title: formTitle,
          description: formDescription,
          questions: parsedQuestions,
          collectEmail: collectEmail,
          creationMethod: 'file',
          formId: result.formId,
          formUrl: result.formUrl,
          editUrl: result.editUrl,
          createdAt: new Date()
        };
        
        setCreatedFormData(formData);
        setShowSuccessView(true);
        
        onFormCreated?.(formData);
      }
    } catch (error) {
      console.error('Error al crear el formulario:', error);
    }
  };



  const handleCreateNewForm = () => {
    setShowSuccessView(false);
    setCreatedFormData(null);
    setUploadedFile(null);
    setParsedQuestions([]);
    setFormTitle('');
    setFormDescription('');
    setCollectEmail(true);
    setShowEditor(false);
  };

  const handleDuplicateForm = () => {
    if (createdFormData) {
      setFormTitle(`${createdFormData.title} - Copia`);
      setFormDescription(createdFormData.description);
      setParsedQuestions(createdFormData.questions.map((q: any) => ({
        ...q,
        id: Date.now().toString() + Math.random()
      })));
      setCollectEmail(createdFormData.collectEmail);
      setShowSuccessView(false);
      setCreatedFormData(null);
      setUploadedFile(null);
      setShowEditor(true);
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

  if (showSuccessView && createdFormData) {
    return (
      <FormSuccessView
        formData={{
          title: createdFormData.title,
          description: createdFormData.description,
          questions: createdFormData.questions,
          formUrl: createdFormData.formUrl,
          editUrl: createdFormData.editUrl,
          createdAt: createdFormData.createdAt
        }}
        onCreateNewForm={handleCreateNewForm}
        onDuplicateForm={handleDuplicateForm}
      />
    );
  }

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
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {loading ? (
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
      {(error || formError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || formError}</AlertDescription>
        </Alert>
      )}

      {parsedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formulario importado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              <ReusableFormBuilder
                initialQuestions={parsedQuestions}
                initialTitle={formTitle}
                initialDescription={formDescription}
                initialCollectEmail={collectEmail}
                onQuestionsChange={setParsedQuestions}
                onTitleChange={setFormTitle}
                onDescriptionChange={setFormDescription}
                onCollectEmailChange={setCollectEmail}
                onFormCreated={handleCreateForm}
                mode="create"
              />
            </div>
          </CardContent>
        </Card>
      )}
      <FormInstructions />
    </div>
  );
}