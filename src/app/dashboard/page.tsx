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
  Mail,
  X,
  Search,
  Edit,
  Trash2,
  Check,
  MoreVertical,
  Upload,
  FileUp
} from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { FormCreatedModal } from '@/components/organisms/FormCreatedModal';
import FormInstructions from '@/components/organisms/FormInstructions';
import EmailManagerModal from '@/components/organisms/EmailManagerModal';
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
  
  // Lista de emails para notificaciones
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  
  // Estados para gestión avanzada de emails
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailManager, setShowEmailManager] = useState(false);
  const [isUploadingEmails, setIsUploadingEmails] = useState(false);
  
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
      settings: formSettings,
      shareEmails: notificationEmails.length > 0 ? notificationEmails : undefined
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

  const removeEmail = (emailToRemove: string) => {
    setNotificationEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const extractEmailsFromText = (text: string): string[] => {
    // Separar por múltiples delimitadores comunes
    const separators = /[,;\s\n\t]+/;
    const potentialEmails = text.split(separators).map(email => email.trim()).filter(email => email.length > 0);
    
    // Filtrar solo emails válidos
    return potentialEmails.filter(email => isValidEmail(email));
  };

  const addEmailsFromInput = (inputText: string) => {
    const emailsInText = extractEmailsFromText(inputText);
    
    if (emailsInText.length > 0) {
      // Agregar solo emails que no estén ya en la lista
      const newEmails = emailsInText.filter(email => !notificationEmails.includes(email));
      if (newEmails.length > 0) {
        setNotificationEmails(prev => [...prev, ...newEmails]);
      }
      
      // Limpiar el input después de procesar emails válidos
      setEmailInput('');
    }
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    
    // Detectar si el usuario terminó de escribir un email (espacio, coma, Enter, etc.)
    const lastChar = value.slice(-1);
    if ([',', ';', ' ', '\n', '\t'].includes(lastChar)) {
      addEmailsFromInput(value);
    }
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmailsFromInput(emailInput);
    } else if (e.key === 'Backspace' && emailInput === '' && notificationEmails.length > 0) {
      // Si está vacío y presiona backspace, remover el último email
      removeEmail(notificationEmails[notificationEmails.length - 1]);
    }
  };

  const handleEmailPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const currentText = emailInput + pastedText;
    
    // Procesar todos los emails del texto pegado
    addEmailsFromInput(currentText);
  };

  const handleEmailBlur = () => {
    // Al perder el foco, procesar cualquier email que quede en el input
    if (emailInput.trim()) {
      addEmailsFromInput(emailInput);
    }
  };

  // Funciones de gestión avanzada
  const filteredEmails = notificationEmails.filter(email => 
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEmailSelection = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const selectAllFilteredEmails = () => {
    setSelectedEmails(filteredEmails);
  };

  const clearSelection = () => {
    setSelectedEmails([]);
  };

  const deleteSelectedEmails = () => {
    setNotificationEmails(prev => prev.filter(email => !selectedEmails.includes(email)));
    setSelectedEmails([]);
  };

  const deleteSingleEmail = (emailToDelete: string) => {
    setNotificationEmails(prev => prev.filter(email => email !== emailToDelete));
    setSelectedEmails(prev => prev.filter(email => email !== emailToDelete));
  };

  const deleteAllEmails = () => {
    setNotificationEmails([]);
    setSelectedEmails([]);
    setSearchTerm('');
  };

  const editEmail = (oldEmail: string, newEmail: string) => {
    if (isValidEmail(newEmail) && !notificationEmails.includes(newEmail)) {
      setNotificationEmails(prev => 
        prev.map(email => email === oldEmail ? newEmail : email)
      );
    }
  };

  // Funciones para importar emails desde archivo
  const processEmailFile = (file: File) => {
    setIsUploadingEmails(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let emailsFromFile: string[] = [];

        if (file.name.endsWith('.csv')) {
          // Procesar CSV
          emailsFromFile = processCSVEmails(data as string);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Procesar Excel
          emailsFromFile = processExcelEmails(data);
        }

        // Filtrar emails válidos y únicos
        const validEmails = emailsFromFile.filter(email => 
          email && isValidEmail(email) && !notificationEmails.includes(email)
        );

        if (validEmails.length > 0) {
          setNotificationEmails(prev => [...prev, ...validEmails]);
          console.log(`✅ ${validEmails.length} emails importados exitosamente`);
        } else {
          console.warn('⚠️ No se encontraron emails válidos en el archivo');
        }

      } catch (error) {
        console.error('❌ Error procesando archivo de emails:', error);
      } finally {
        setIsUploadingEmails(false);
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const processCSVEmails = (csvText: string): string[] => {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const emails: string[] = [];

    for (const line of lines) {
      // Dividir por comas y procesar cada campo
      const fields = line.split(',').map(field => field.trim().replace(/"/g, ''));
      
      // Buscar emails en todos los campos de la línea
      for (const field of fields) {
        if (isValidEmail(field)) {
          emails.push(field);
        }
      }
    }

    return [...new Set(emails)]; // Remover duplicados
  };

  const processExcelEmails = (arrayBuffer: any): string[] => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const emails: string[] = [];

    // Procesar todas las hojas
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Procesar todas las celdas buscando emails
      sheetData.forEach(row => {
        row.forEach(cell => {
          if (cell && typeof cell === 'string' && isValidEmail(cell.trim())) {
            emails.push(cell.trim());
          }
        });
      });
    });

    return [...new Set(emails)]; // Remover duplicados
  };

  const handleEmailFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const validExtensions = ['.csv', '.xls', '.xlsx'];
      
      const hasValidType = validTypes.includes(file.type) || 
                          validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (hasValidType) {
        processEmailFile(file);
      } else {
        alert('Por favor selecciona un archivo CSV o Excel (.csv, .xls, .xlsx)');
      }
    }
    
    // Limpiar el input para permitir subir el mismo archivo otra vez
    event.target.value = '';
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
                      setNotificationEmails([]);
                      setEmailInput('');
                      setSelectedEmails([]);
                      setSearchTerm('');
                      setShowEmailManager(false);
                      setIsUploadingEmails(false);
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

                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Envío Automático</h4>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="notification-emails" className="text-sm font-medium block mb-2">
                          Enviar formulario por email (opcional)
                        </label>
                        <div className="space-y-3">
                          <Input
                            id="notification-emails"
                            type="email"
                            value={emailInput}
                            onChange={handleEmailInputChange}
                            onKeyPress={handleEmailKeyPress}
                            onPaste={handleEmailPaste}
                            onBlur={handleEmailBlur}
                            placeholder="Escribe o pega emails separados por comas, espacios o Enter..."
                            className="w-full"
                          />
                          
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-border"></div>
                            <span className="text-xs text-muted-foreground px-2">o</span>
                            <div className="flex-1 h-px bg-border"></div>
                          </div>
                          
                          <div className="flex gap-2">
                            <input
                              type="file"
                              id="email-file-upload"
                              accept=".csv,.xlsx,.xls"
                              onChange={handleEmailFileUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('email-file-upload')?.click()}
                              disabled={isUploadingEmails}
                              className="flex items-center gap-2 flex-1"
                            >
                              {isUploadingEmails ? (
                                <>
                                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  Subir archivo de emails
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Sube un archivo CSV o Excel con emails. Se procesarán automáticamente y se convertirán en tags.
                            <br />
                            <strong>Formatos soportados:</strong> .csv, .xlsx, .xls
                          </p>
                        </div>
                      </div>
                      
                      {notificationEmails.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-muted/30 min-h-[2.5rem]">
                            {notificationEmails.slice(0, 5).map((email, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium"
                              >
                                <Mail className="h-3 w-3" />
                                {email}
                                <button
                                  onClick={() => removeEmail(email)}
                                  className="ml-1 hover:bg-white/20 rounded-sm p-0.5 transition-colors"
                                  aria-label={`Remover ${email}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                            {notificationEmails.length > 5 && (
                              <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                                +{notificationEmails.length - 5} más
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                              💡 Presiona Backspace para remover el último email
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowEmailManager(true)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-3 w-3" />
                              Gestionar ({notificationEmails.length})
                            </Button>
                          </div>
                        </div>
                      )}
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
            setNotificationEmails([]);
            setEmailInput('');
            setSelectedEmails([]);
            setSearchTerm('');
            setShowEmailManager(false);
            setIsUploadingEmails(false);
          }}
          onClearError={clearError}
        />
      )}

      {/* Email Manager Modal */}
      {showEmailManager && (
        <EmailManagerModal
          emails={notificationEmails}
          selectedEmails={selectedEmails}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleSelection={toggleEmailSelection}
          onSelectAll={selectAllFilteredEmails}
          onClearSelection={clearSelection}
          onDeleteSelected={deleteSelectedEmails}
          onDeleteSingle={deleteSingleEmail}
          onDeleteAll={deleteAllEmails}
          onEditEmail={editEmail}
          onImportEmails={processEmailFile}
          isUploading={isUploadingEmails}
          onClose={() => setShowEmailManager(false)}
        />
      )}
    </div>
  );
} 