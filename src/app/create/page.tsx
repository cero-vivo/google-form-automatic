'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUploadCard } from '@/components/molecules/FileUploadCard';
import { 
  ArrowLeft,
  FileText,
  Upload,
  Edit,
  Sparkles,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [selectedMethod, setSelectedMethod] = useState<'upload' | 'blank' | 'template' | null>(null);
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const { user } = useAuthContext();
  const router = useRouter();

  const handleQuestionsLoaded = (questions: Question[]) => {
    setLoadedQuestions(questions);
    // Redirigir a editor con las preguntas
    console.log('Preguntas cargadas:', questions);
  };

  const creationMethods = [
    {
      id: 'upload',
      title: 'Subir Archivo',
      description: 'Carga un archivo Excel o CSV con tus preguntas',
      icon: Upload,
      badge: 'Recomendado',
      badgeVariant: 'default' as const,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'blank',
      title: 'Formulario en Blanco',
      description: 'Empieza desde cero y crea preguntas manualmente',
      icon: Edit,
      badge: 'Básico',
      badgeVariant: 'secondary' as const,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'template',
      title: 'Usar Plantilla',
      description: 'Elige de nuestra biblioteca de plantillas prediseñadas',
      icon: Sparkles,
      badge: 'Pro',
      badgeVariant: 'outline' as const,
      color: 'from-orange-500 to-red-600'
    }
  ];

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

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
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Crear Formulario</h1>
                <p className="text-sm text-muted-foreground">Elige cómo quieres crear tu formulario</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium">{user.displayName}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!selectedMethod ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Cómo quieres crear tu formulario?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Elige el método que mejor se adapte a tus necesidades. Puedes cambiar de método en cualquier momento.
              </p>
            </div>

            {/* Creation Methods */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {creationMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => setSelectedMethod(method.id as any)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <Badge variant={method.badgeVariant}>{method.badge}</Badge>
                        </div>
                        <CardDescription className="text-center">
                          {method.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Seleccionar
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Features Section */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-center mb-8">
                Todas las opciones incluyen
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-medium">Previsualización</h4>
                  <p className="text-sm text-muted-foreground">
                    Ve cómo se verá tu formulario antes de publicarlo
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto">
                    <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">Edición Completa</h4>
                  <p className="text-sm text-muted-foreground">
                    Modifica preguntas, opciones y configuraciones
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium">Publicación Directa</h4>
                  <p className="text-sm text-muted-foreground">
                    Publica automáticamente en Google Forms
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : selectedMethod === 'upload' ? (
          <>
            {/* File Upload Section */}
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedMethod(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cambiar método
                </Button>
                <h2 className="text-2xl font-bold mb-2">Subir Archivo Excel/CSV</h2>
                <p className="text-muted-foreground">
                  Sube tu archivo con las preguntas y nosotros nos encargamos del resto
                </p>
              </div>

              <FileUploadCard 
                onQuestionsLoaded={handleQuestionsLoaded}
                className="mb-8"
              />
            </div>
          </>
        ) : selectedMethod === 'blank' ? (
          <>
            {/* Blank Form Section */}
            <div className="max-w-4xl mx-auto text-center">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedMethod(null)}
                className="mb-8"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cambiar método
              </Button>
              
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto">
                  <Edit className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Formulario en Blanco</h2>
                  <p className="text-muted-foreground">
                    Esta funcionalidad estará disponible pronto. Por ahora, puedes usar la carga de archivos.
                  </p>
                </div>
                <Button onClick={() => setSelectedMethod('upload')}>
                  Probar carga de archivos
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Templates Section */}
            <div className="max-w-4xl mx-auto text-center">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedMethod(null)}
                className="mb-8"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cambiar método
              </Button>
              
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Plantillas</h2>
                  <p className="text-muted-foreground">
                    Nuestra biblioteca de plantillas estará disponible pronto. Por ahora, puedes crear desde cero.
                  </p>
                </div>
                <Button onClick={() => setSelectedMethod('upload')}>
                  Crear con archivo
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 