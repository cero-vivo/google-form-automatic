'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUploadCard from '@/components/molecules/FileUploadCard';
import { 
  FileText, 
  ArrowLeft,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { FormCreatedModal } from '@/components/organisms/FormCreatedModal';
import FormInstructions from '@/components/organisms/FormInstructions';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  // Configuraciones avanzadas del formulario
  const [formSettings, setFormSettings] = useState({
    collectEmails: false
  });
  

  
  const router = useRouter();
  
  // Estado para lista de formularios
  const [showFormsList, setShowFormsList] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuthContext();

  const {
    createGoogleForm,
    shareGoogleForm,
    isCreating,
    isSharing,
    isLoadingForms,
    error: googleFormsError,
    createdForm,
    userForms,
    getUserForms,
    clearError,
    clearCreatedForm
  } = useGoogleFormsIntegration();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

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
      router.push('/auth/login');
      return;
    }

    if (loadedQuestions.length === 0) {
      console.error('No hay preguntas para crear el formulario');
      return;
    }

    const result = await createGoogleForm({
      title: formTitle || 'Formulario sin título',
      description: formDescription,
      questions: loadedQuestions,
      settings: formSettings
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





  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (this will trigger the useEffect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirigiendo a inicio de sesión...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => {
                setShowFormsList(!showFormsList);
                if (!showFormsList && userForms.length === 0) {
                  await getUserForms();
                }
              }}
              disabled={isLoadingForms}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isLoadingForms ? 'Cargando...' : 'Mis formularios'}
            </Button>
            
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
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
              disabled={authLoading}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Modal de formularios */}
      {showFormsList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFormsList(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Mis Formularios</h2>
                <button
                  onClick={() => setShowFormsList(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
                              <div className="max-h-[60vh] overflow-y-auto">
                  {isLoadingForms ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <h3 className="text-lg font-medium mb-2">Cargando formularios...</h3>
                      <p className="text-sm">Obteniendo tus formularios de Google Forms</p>
                    </div>
                  ) : userForms.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No tienes formularios creados aún</h3>
                      <p className="text-sm">Crea tu primer formulario subiendo un archivo Excel o CSV</p>
                      <button
                        onClick={() => setShowFormsList(false)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Crear mi primer formulario
                      </button>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {userForms.map((form, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                              {form.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {form.description || 'Sin descripción'}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                                             <span className="flex items-center gap-1">
                                 📊 <strong>{form.responseCount || 0}</strong> respuestas
                               </span>
                               <span className="flex items-center gap-1">
                                 📅 Creado {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'hace poco'}
                               </span>
                               <span className="flex items-center gap-1">
                                 ✏️ Modificado {form.modifiedAt ? new Date(form.modifiedAt).toLocaleDateString() : 'hace poco'}
                               </span>
                            </div>
                          </div>
                        </div>
                        {form.googleFormUrl && (
                          <div className="flex gap-3">
                            <a
                              href={form.googleFormUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Ver formulario
                            </a>
                            {form.editUrl && (
                              <a
                                href={form.editUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                              >
                                Editar en Google Forms
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Authentication-required notice for Google Forms */}
        {googleFormsError && googleFormsError.includes('sesión con Google ha expirado') && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sesión expirada:</strong> Tu sesión con Google ha expirado. Para crear formularios, cierra sesión y vuelve a iniciar sesión con Google.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    signOut();
                    router.push('/auth/login');
                  }}
                >
                  Renovar sesión
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!showPreview ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">¡Bienvenido a FastForm!</h2>
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
            <FormInstructions />
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
                      setFormSettings({
                        collectEmails: false
                      });
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
                    Personaliza el título, descripción y configuraciones avanzadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Información Básica</h4>
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
                  </div>

                                    {/* Email Collection Setting */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Configuración de Privacidad</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="collect-emails"
                          checked={formSettings.collectEmails}
                          onChange={(e) => setFormSettings(prev => ({ ...prev, collectEmails: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="collect-emails" className="text-sm">
                          Recopilar direcciones de correo electrónico
                        </label>
                      </div>
                    </div>
                  </div>



                  {/* Info Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      ℹ️ Configuraciones Adicionales
                    </h4>
                    <div className="space-y-2 text-xs">
                      <p>
                        Para configuraciones adicionales como limitar respuestas por persona, mensaje de confirmación personalizado, 
                        y otras opciones avanzadas, puedes ajustarlas manualmente en el editor de Google Forms después de crear el formulario.
                      </p>
                    </div>
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
            setFormSettings({
              collectEmails: false
            });
          }}
          onClearError={clearError}
        />
      )}


    </div>
  );
} 