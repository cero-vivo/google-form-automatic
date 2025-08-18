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
import { ReusableFormBuilder } from './ReusableFormBuilder';
import FormInstructions from './FormInstructions';

interface FileImportFormCreatorProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
}

export function FileImportFormCreator({ onFormCreated, currentCredits = 0 }: FileImportFormCreatorProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);


  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [collectEmail, setCollectEmail] = useState(true);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [createdFormData, setCreatedFormData] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  const { handleFileSelect, questions, loading, progress, error } = useFileUpload();
  const { consumeCredits } = useCredits();

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
      setShowEditor(true);

      // Consume credits after successful parsing
      consumeCredits({
        amount: 1,
        formTitle: uploadedFile?.name || 'Formulario importado'
      });
    }
  }, [questions, uploadedFile, consumeCredits, loading]);



  const handleCreateForm = () => {
    if (parsedQuestions.length === 0) {
      handleFileSelect(null, 'No hay preguntas válidas para crear el formulario');
      return;
    }

    const formData = {
      title: formTitle,
      description: formDescription,
      questions: parsedQuestions,
      creationMethod: 'file',
      formUrl: 'https://forms.google.com/viewform',
      editUrl: 'https://forms.google.com/edit',
      createdAt: new Date()
    };

    setCreatedFormData(formData);
    setShowSuccessView(true);

    onFormCreated?.(formData);
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
      <div className="space-y-8 max-w-5xl mx-auto px-4">
        {/* Hero Success Section */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-excel/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-excel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-forms">
              ¡Formulario creado con éxito!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tu formulario <span className="font-semibold text-forms">"{createdFormData.title}"</span> está listo en Google Forms
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4">
            <div className="bg-excel/10 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-excel">{createdFormData.questions.length}</div>
              <div className="text-sm text-muted-foreground">Preguntas</div>
            </div>
            <div className="bg-forms/10 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-forms">✓</div>
              <div className="text-sm text-muted-foreground">Google Forms</div>
            </div>
            <div className="bg-velocity/10 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-velocity">∞</div>
              <div className="text-sm text-muted-foreground">Respuestas</div>
            </div>
          </div>
        </div>

        {/* Form Preview Card */}
        <Card className="border-border">
          <div className="bg-excel/5 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-forms/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-forms" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-forms">{createdFormData.title}</h3>
                {createdFormData.description && (
                  <p className="text-muted-foreground text-sm mt-1">{createdFormData.description}</p>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Questions Preview */}
            <div className="space-y-4">
              <h4 className="font-medium text-forms flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Vista previa de preguntas
              </h4>
              <div className="grid gap-3">
                {createdFormData.questions.slice(0, 4).map((q: any, index: number) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg border-l-4 border-l-excel">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-foreground flex-1">{q.title}</span>
                      <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">{q.type}</span>
                    </div>
                  </div>
                ))}
                {createdFormData.questions.length > 4 && (
                  <div className="text-center py-3">
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      +{createdFormData.questions.length - 4} preguntas más
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
              {/* Share Link */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-excel/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-excel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-forms">Compartir formulario</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={createdFormData.formUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-excel/50"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(createdFormData.formUrl);
                      alert('¡Enlace copiado al portapapeles!');
                    }}
                    className="bg-excel hover:bg-excel/90 text-white shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
                <a
                  href={createdFormData.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-excel text-white rounded-lg hover:bg-excel/90 transition-colors text-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver formulario
                </a>
              </div>

              {/* Edit Link */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-forms/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-forms" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-forms">Editar formulario</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={createdFormData.editUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forms/50"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(createdFormData.editUrl);
                      alert('¡Enlace copiado al portapapeles!');
                    }}
                    className="bg-forms hover:bg-forms/90 text-white shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
                <a
                  href={createdFormData.editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-forms text-white rounded-lg hover:bg-forms/90 transition-colors text-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar en Google
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={handleCreateNewForm}
            className="w-full bg-excel hover:bg-excel/90 text-white h-14 rounded-xl text-lg font-medium transition-colors"
            size="lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Crear nuevo formulario</span>
            </div>
          </Button>

          <Button
            onClick={handleDuplicateForm}
            className="w-full bg-forms hover:bg-forms/90 text-white h-14 rounded-xl text-lg font-medium transition-colors"
            size="lg"
            variant="outline"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Crear copia del formulario</span>
            </div>
          </Button>
        </div>
      </div>
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
            <ReusableFormBuilder
              initialQuestions={parsedQuestions}
              initialTitle={formTitle}
              initialDescription={formDescription}
              onQuestionsChange={setParsedQuestions}
              onTitleChange={setFormTitle}
              onDescriptionChange={setFormDescription}
            />

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