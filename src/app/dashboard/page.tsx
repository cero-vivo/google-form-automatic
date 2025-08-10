'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUploadCard from '@/components/molecules/FileUploadCard';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Users, 
  ArrowLeft,
  Settings,
  HelpCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { FormCreatedModal } from '@/components/organisms/FormCreatedModal';

export default function DashboardPage() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  const { user, signOut, loading: authLoading } = useAuthContext();

  const {
    createGoogleForm,
    shareGoogleForm,
    isCreating,
    isSharing,
    error: googleFormsError,
    createdForm,
    clearError,
    clearCreatedForm
  } = useGoogleFormsIntegration();

  const handleQuestionsLoaded = (questions: Question[]) => {
    setLoadedQuestions(questions);
    setShowPreview(true);
    
    // Generar título sugerido basado en las preguntas
    if (questions.length > 0) {
      const suggestedTitle = `Formulario - ${questions.length} preguntas`;
      setFormTitle(suggestedTitle);
    }
  };

  const handleCreateForm = async () => {
    if (!user) {
      console.error('No hay usuario autenticado');
      return;
    }

    if (loadedQuestions.length === 0) {
      console.error('No hay preguntas para crear el formulario');
      return;
    }

    const result = await createGoogleForm({
      title: formTitle || 'Formulario sin título',
      description: formDescription,
      questions: loadedQuestions
    });

    if (result) {
      console.log('✅ Formulario creado exitosamente:', result);
    }
  };

  const formatQuestionType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'short_text': 'Texto corto',
      'long_text': 'Texto largo',
      'multiple_choice': 'Opción múltiple',
      'checkboxes': 'Casillas de verificación',
      'dropdown': 'Lista desplegable',
      'linear_scale': 'Escala lineal',
      'date': 'Fecha',
      'time': 'Hora',
      'email': 'Email',
      'number': 'Número',
      'phone': 'Teléfono'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Crea y gestiona tus formularios</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ayuda
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
            
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut()}
                  disabled={authLoading}
                >
                  Cerrar Sesión
                </Button>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Formulario
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/login">
                  Iniciar Sesión
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!showPreview ? (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Formularios</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Comienza creando tu primer formulario
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Respuestas</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Respuestas recolectadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    En los últimos 30 días
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">¡Bienvenido a FormGenerator!</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Comienza subiendo un archivo Excel o CSV para crear tu primer formulario
              </p>
            </div>

            {/* File Upload */}
            <FileUploadCard 
              onQuestionsLoaded={handleQuestionsLoaded}
              className="mb-8"
            />

            {/* Instructions */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Instrucciones rápidas</CardTitle>
                <CardDescription>
                  Sigue estos pasos para crear tu formulario perfectamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Prepara tu archivo</h4>
                    <p className="text-sm text-muted-foreground">
                      Organiza tus preguntas en Excel o CSV con las columnas: Pregunta, Tipo, Opciones, Requerido
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Sube el archivo</h4>
                    <p className="text-sm text-muted-foreground">
                      Arrastra tu archivo o haz clic para seleccionarlo. El sistema detectará automáticamente los tipos de pregunta
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Revisa y publica</h4>
                    <p className="text-sm text-muted-foreground">
                      Previsualiza tu formulario, haz ajustes si es necesario y publícalo directamente en Google Forms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Preview Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Previsualización del Formulario</h2>
                  <p className="text-muted-foreground">
                    Revisa las {loadedQuestions.length} preguntas detectadas
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPreview(false);
                      setLoadedQuestions([]);
                      setFormTitle('');
                      setFormDescription('');
                    }}
                  >
                    Subir otro archivo
                  </Button>
                  <Button 
                    onClick={handleCreateForm}
                    disabled={isCreating || !formTitle.trim()}
                  >
                    {isCreating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      'Crear Google Form'
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {googleFormsError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {googleFormsError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Configuration */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Configuración del Formulario</CardTitle>
                  <CardDescription>
                    Personaliza el título y descripción de tu formulario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="form-title" className="text-sm font-medium block mb-2">
                      Título del formulario *
                    </label>
                    <Input
                      id="form-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ej: Encuesta de satisfacción"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-description" className="text-sm font-medium block mb-2">
                      Descripción (opcional)
                    </label>
                    <Input
                      id="form-description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Ej: Tu opinión es importante para nosotros"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions Preview */}
            <div className="space-y-4">
              {loadedQuestions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            Pregunta {index + 1}
                          </Badge>
                          <Badge variant="secondary">
                            {formatQuestionType(question.type)}
                          </Badge>
                          {question.required && (
                            <Badge variant="destructive" className="text-xs">
                              Requerido
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{question.title}</CardTitle>
                        {question.description && (
                          <CardDescription className="mt-1">
                            {question.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {question.multipleChoiceConfig?.options && (
                    <CardContent>
                      <p className="text-sm font-medium mb-2">Opciones:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.multipleChoiceConfig.options.map((option, optionIndex) => (
                          <Badge key={optionIndex} variant="outline">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}

                  {question.linearScaleConfig && (
                    <CardContent>
                      <p className="text-sm font-medium mb-2">Escala:</p>
                      <Badge variant="outline">
                        {question.linearScaleConfig.min} - {question.linearScaleConfig.max}
                      </Badge>
                    </CardContent>
                  )}

                  {question.validation && question.validation.length > 0 && (
                    <CardContent className="pt-0">
                      <p className="text-sm font-medium mb-2">Validaciones:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.validation.map((validation, validationIndex) => (
                          <Badge key={validationIndex} variant="secondary" className="text-xs">
                            {validation.message || validation.type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="lg">
                  Guardar como borrador
                </Button>
                <Button 
                  size="lg"
                  onClick={handleCreateForm}
                  disabled={isCreating || !formTitle.trim()}
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Google Form'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Form Created Modal */}
      {(createdForm || googleFormsError) && (
        <FormCreatedModal
          createdForm={createdForm}
          error={googleFormsError}
          onClose={() => {
            clearCreatedForm();
            clearError();
            // Reset estado para crear otro formulario
            setShowPreview(false);
            setLoadedQuestions([]);
            setFormTitle('');
            setFormDescription('');
          }}
          onClearError={clearError}
        />
      )}
    </div>
  );
} 