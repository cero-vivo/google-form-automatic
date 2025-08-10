'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { FormCreatedModal } from '@/components/organisms/FormCreatedModal';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

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
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ayuda
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
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
                <CardTitle>Cómo crear tu formulario</CardTitle>
                <CardDescription>
                  Sigue estos pasos para crear tu formulario profesional en Google Forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Prepara tu archivo</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Organiza tus preguntas en Excel (.xlsx, .xls) o CSV con estas columnas:
                    </p>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-xs space-y-1">
                        <div><strong>Pregunta:</strong> El texto de la pregunta</div>
                        <div><strong>Tipo:</strong> El tipo de pregunta (ver tipos soportados abajo)</div>
                        <div><strong>Opciones:</strong> Para preguntas de selección (separadas por comas)</div>
                        <div><strong>Requerido:</strong> Sí/No o true/false</div>
                        <div><strong>Descripción:</strong> Texto adicional (opcional)</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tipos de preguntas soportados</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div><Badge variant="outline" className="text-xs">short_text</Badge> Respuesta corta</div>
                        <div><Badge variant="outline" className="text-xs">long_text</Badge> Respuesta larga</div>
                        <div><Badge variant="outline" className="text-xs">multiple_choice</Badge> Opción múltiple</div>
                        <div><Badge variant="outline" className="text-xs">checkboxes</Badge> Casillas múltiples</div>
                        <div><Badge variant="outline" className="text-xs">dropdown</Badge> Lista desplegable</div>
                        <div><Badge variant="outline" className="text-xs">linear_scale</Badge> Escala lineal</div>
                      </div>
                      <div className="space-y-1">
                        <div><Badge variant="outline" className="text-xs">date</Badge> Fecha</div>
                        <div><Badge variant="outline" className="text-xs">time</Badge> Hora</div>
                        <div><Badge variant="outline" className="text-xs">email</Badge> Correo electrónico</div>
                        <div><Badge variant="outline" className="text-xs">number</Badge> Número</div>
                        <div><Badge variant="outline" className="text-xs">phone</Badge> Teléfono</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Formatos de archivo soportados</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">.xlsx</Badge>
                      <Badge variant="secondary">.xls</Badge>
                      <Badge variant="secondary">.csv</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tamaño máximo: 10MB. El sistema detecta automáticamente si tu archivo tiene cabeceras.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Revisa y publica</h4>
                    <p className="text-sm text-muted-foreground">
                      Sube tu archivo, revisa la vista previa, personaliza título y descripción, y créalo directamente en Google Forms. 
                      Obtendrás enlaces para ver y editar el formulario.
                    </p>
                  </div>
                </div>

                {/* Example and Download */}
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">💡 Ejemplo de estructura CSV:</h5>
                    <code className="text-xs block bg-white dark:bg-slate-800 p-2 rounded border">
                      Pregunta,Tipo,Opciones,Requerido<br/>
                      ¿Cuál es tu nombre?,short_text,,Sí<br/>
                      ¿Cuál es tu color favorito?,multiple_choice,"Rojo,Azul,Verde,Amarillo",No<br/>
                      Comentarios adicionales,long_text,,No
                    </code>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium mb-1">🚀 ¿Quieres un ejemplo completo?</h5>
                        <p className="text-xs text-muted-foreground">
                          Descarga un archivo Excel con ejemplos de todos los tipos de preguntas
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={generateExampleExcel}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Descargar Ejemplo
                      </Button>
                    </div>
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