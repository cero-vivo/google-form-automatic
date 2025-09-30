'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowUp, ArrowDown, Replace, BookOpen, Download } from 'lucide-react';
import { Question } from '@/domain/entities/question';
import { useFileUpload } from '@/containers/useFileUpload';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { ReusableFormBuilder } from './ReusableFormBuilder';
import { DraftService } from '@/infrastructure/firebase/DraftService';
import { useAuth } from '@/containers/useAuth';
import FormInstructions from './FormInstructions';
import { FormSuccessView } from './FormSuccessView';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FileImportFormCreatorProps {
  onFormCreated?: (formData: any) => void;
  currentCredits?: number;
  draftId?: string;
}

export function FileImportFormCreator({ onFormCreated, currentCredits = 0, draftId }: FileImportFormCreatorProps) {
  // Estados principales del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [] as Question[],
    collectEmail: true,
    creationMethod: 'manual'
  });

  // Estados de UI
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [createdFormData, setCreatedFormData] = useState<any>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [pendingFileQuestions, setPendingFileQuestions] = useState<Question[]>([]);
  const [lastUploadedFileName, setLastUploadedFileName] = useState<string>('');
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  // Hooks
  const { handleFileSelect, questions: fileQuestions, loading, progress, error } = useFileUpload();
  const { createGoogleForm, isCreating: creatingForm, error: formError } = useGoogleFormsIntegration();
  const { user } = useAuth();

  // Handlers para cambios en el formulario
  const handleFormUpdate = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleQuestionsUpdate = useCallback((questions: Question[]) => {
    handleFormUpdate({ questions });
  }, [handleFormUpdate]);

  const handleTitleUpdate = useCallback((title: string) => {
    handleFormUpdate({ title });
  }, [handleFormUpdate]);

  const handleDescriptionUpdate = useCallback((description: string) => {
    handleFormUpdate({ description });
  }, [handleFormUpdate]);

  const handleCollectEmailUpdate = useCallback((collectEmail: boolean) => {
    handleFormUpdate({ collectEmail });
  }, [handleFormUpdate]);

  // Manejo de archivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setShowSuccessView(false);
      setCreatedFormData(null);
      setIsProcessingFile(true);
      setLastUploadedFileName(file.name);
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: loading
  });

  // Load draft automatically when draftId is provided
  useEffect(() => {
    const loadDraftById = async () => {
      if (!draftId || !user) return;
      
      setIsLoadingDraft(true);
      try {
        const draft = await DraftService.getDraftById(user.id, draftId);
        if (draft) {
          setFormData({
            title: draft.title,
            description: draft.description,
            questions: draft.questions,
            collectEmail: draft.collectEmail,
            creationMethod: draft.creationMethod === 'excel' ? 'excel' : 'manual'
          });
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraftById();
  }, [draftId, user]);

  // Efecto para manejar preguntas nuevas del archivo
  useEffect(() => {
    if (loading || !fileQuestions || fileQuestions.length === 0) return;

    setPendingFileQuestions(fileQuestions);
    
    if (formData.questions.length > 0) {
      // Si hay preguntas existentes, mostrar opciones de importación
      setShowImportOptions(true);
    } else {
      // Si no hay preguntas, cargar directamente
      loadFileQuestions(fileQuestions);
    }
    
    setIsProcessingFile(false);
  }, [fileQuestions, loading]);

  const loadFileQuestions = (questions: Question[]) => {
    setFormData({
      ...formData,
      questions,
      creationMethod: 'excel',
      title: `Formulario importado: ${lastUploadedFileName || 'Formulario importado'}`,
      description: `Formulario creado desde archivo ${lastUploadedFileName || ''} (${questions.length} preguntas)`
    });
  };

  // Función para manejar el resultado de la creación del formulario desde ReusableFormBuilder
  const handleFormCreated = async (formData: any) => {
    // El ReusableFormBuilder ya se encarga de crear el formulario y consumir créditos
    // Solo necesitamos actualizar nuestro estado local y mostrar la vista de éxito
    const createdForm = {
      title: formData.title,
      description: formData.description,
      questions: formData.questions,
      collectEmail: formData.collectEmail,
      creationMethod: formData.creationMethod,
      formId: formData.formId,
      formUrl: formData.formUrl,
      editUrl: formData.editUrl,
      createdAt: formData.createdAt
    };
    
    setCreatedFormData(createdForm);
    setShowSuccessView(true);
    
    // Notificar al componente padre si es necesario
    onFormCreated?.(createdForm);
  };

  const handleCreateNewForm = () => {
    setShowSuccessView(false);
    setCreatedFormData(null);
    setFormData({
      title: '',
      description: '',
      questions: [],
      collectEmail: true,
      creationMethod: 'manual'
    });
    setLastUploadedFileName('');
    setPendingFileQuestions([]);
  };

  const handleDuplicateForm = () => {
    if (createdFormData) {
      setFormData({
        title: `${createdFormData.title} - Copia`,
        description: createdFormData.description,
        questions: createdFormData.questions.map((q: any) => ({
          ...q,
          id: Date.now().toString() + Math.random()
        })),
        collectEmail: createdFormData.collectEmail,
        creationMethod: createdFormData.creationMethod
      });
      setShowSuccessView(false);
      setCreatedFormData(null);
      setLastUploadedFileName('');
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

  const handleImportOption = (option: 'replace' | 'add-top' | 'add-bottom') => {
    let newQuestions: Question[];
    
    switch (option) {
      case 'replace':
        newQuestions = pendingFileQuestions;
        break;
      case 'add-top':
        newQuestions = [...pendingFileQuestions, ...formData.questions];
        break;
      case 'add-bottom':
        newQuestions = [...formData.questions, ...pendingFileQuestions];
        break;
    }
    
    setFormData({
      ...formData,
      questions: newQuestions,
      creationMethod: 'excel',
      title: `${formData.title || 'Formulario'} + ${pendingFileQuestions.length} preguntas importadas`
    });
    
    setPendingFileQuestions([]);
    setShowImportOptions(false);
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

  if (isLoadingDraft) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando borrador...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* File Upload Section - Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Importar desde archivo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sube un archivo CSV o Excel para llenar automáticamente el formulario
          </p>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${loading || isProcessingFile ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-4">
              {loading || isProcessingFile ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">Procesando archivo...</p>
                  <Progress value={progress} className="w-full max-w-xs" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {progress < 50 ? 'Validando formato...' : 
                     progress < 80 ? 'Analizando preguntas...' : 
                     'Preparando formulario...'}
                  </p>
                </>
              ) : lastUploadedFileName ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className="text-lg font-medium">Archivo procesado: {lastUploadedFileName}</p>
                  <Badge variant="secondary">{formData.questions.length} preguntas importadas</Badge>
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

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={downloadTemplate}
              variant="outline"
              size="sm"
              className="border-excel-300 text-excel-600 hover:bg-excel-50 font-inter"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar plantilla de ejemplo
            </Button>
            <Button
              onClick={() => {
                // Scroll a la sección de documentación
                const docSection = document.querySelector('[data-section="documentation"]');
                if (docSection) {
                  docSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              variant="ghost"
              size="sm"
              className="text-forms-600 hover:bg-forms-50 font-inter"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Saber más
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Builder - Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {formData.creationMethod === 'excel' ? 'Formulario importado' : 'Crear formulario manual'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formData.creationMethod === 'excel' 
              ? 'Revisa y edita las preguntas importadas desde tu archivo'
              : 'Crea tu formulario desde cero'}
          </p>
        </CardHeader>
        <CardContent>
          <ReusableFormBuilder
            creationMethod={formData.creationMethod as 'manual' | 'excel'}
            initialQuestions={formData.questions}
            initialTitle={formData.title}
            initialDescription={formData.description}
            initialCollectEmail={formData.collectEmail}
            onQuestionsChange={handleQuestionsUpdate}
            onTitleChange={handleTitleUpdate}
            onDescriptionChange={handleDescriptionUpdate}
            onCollectEmailChange={handleCollectEmailUpdate}
            onFormCreated={handleFormCreated}
            mode="create"
            draftId={draftId}
          />
        </CardContent>
      </Card>

      {(error || formError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || formError}</AlertDescription>
        </Alert>
      )}

      {/* Import Options Dialog */}
      <Dialog open={showImportOptions} onOpenChange={setShowImportOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Qué deseas hacer con las preguntas importadas?</DialogTitle>
            <DialogDescription>
              Ya tienes {formData.questions.length} preguntas en tu formulario. 
              Las nuevas preguntas del archivo: {pendingFileQuestions.length}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              onClick={() => handleImportOption('replace')}
              className="justify-start"
              variant="outline"
            >
              <Replace className="mr-2 h-4 w-4" />
              Reemplazar todas las preguntas actuales
            </Button>
            <Button 
              onClick={() => handleImportOption('add-top')}
              className="justify-start"
              variant="outline"
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Agregar nuevas preguntas arriba de las existentes
            </Button>
            <Button 
              onClick={() => handleImportOption('add-bottom')}
              className="justify-start"
              variant="outline"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Agregar nuevas preguntas debajo de las existentes
            </Button>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowImportOptions(false);
                setPendingFileQuestions([]);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div data-section="documentation">
        <FormInstructions />
      </div>
    </div>
  );
}