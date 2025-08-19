'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { useCredits } from '@/containers/useCredits';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FormsListModal } from '@/components/dashboard/FormsListModal';
import { FormPreview } from '@/components/dashboard/FormPreview';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import CreditsAlert from '@/components/molecules/CreditsAlert';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  // Configuraciones avanzadas del formulario
  const [formSettings, setFormSettings] = useState({
    collectEmails: false
  });
  
  // Guardar montaje para evitar desajustes de hidratación
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const router = useRouter();
  
  // Estado para lista de formularios
  const [showFormsList, setShowFormsList] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuthContext();
  const { currentCredits, loading: creditsLoading } = useCredits();

  const {
    createGoogleForm,
    isCreating,
    isLoadingForms,
    error: googleFormsError,
    createdForm,
    userForms,
    getUserForms,
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

    // Verificar créditos antes de crear el formulario
    if (currentCredits < 1) {
      alert('No tienes créditos suficientes para crear un formulario. Compra más créditos para continuar.');
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

  const handleBackToWelcome = () => {
    setShowPreview(false);
    setLoadedQuestions([]);
    setFormTitle('');
    setFormDescription('');
    setFormSettings({ collectEmails: false });
  };

  const handleToggleFormsList = async () => {
    setShowFormsList(!showFormsList);
    if (!showFormsList && userForms.length === 0) {
      await getUserForms();
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Evitar render SSR/CSR distinto
  if (!hasMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  // Redirect to login if not authenticated (this will trigger the useEffect)
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirigiendo a inicio de sesión...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        user={user}
        currentCredits={currentCredits}
        creditsLoading={creditsLoading}
        isLoadingForms={isLoadingForms}
        userFormsCount={userForms.length}
        onToggleFormsList={handleToggleFormsList}
        onSignOut={signOut}
      />
      
      <div className="container mx-auto px-4 pb-4 py-6">
        {creditsLoading ? (
          <div className="mb-4 border-l-4 border-gray-300 bg-gray-100 p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 rounded-full bg-gray-300" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-full bg-gray-300 rounded mb-3" />
                <div className="flex items-center space-x-3 mt-3">
                  <div className="h-8 w-32 bg-gray-300 rounded" />
                  <div className="h-8 w-28 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CreditsAlert currentCredits={currentCredits} />
        )}
      </div>

      <FormsListModal
        isOpen={showFormsList}
        onClose={() => setShowFormsList(false)}
        isLoading={isLoadingForms}
        forms={userForms}
      />

      <div className="container mx-auto px-4 py-8">
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
          <DashboardWelcome
            onQuestionsLoaded={handleQuestionsLoaded}
            currentCredits={currentCredits}
          />
        ) : (
          <FormPreview
             questions={loadedQuestions}
             formTitle={formTitle}
             formDescription={formDescription}
             formSettings={formSettings}
             isCreating={isCreating}
             creditsLoading={creditsLoading}
             currentCredits={currentCredits}
             googleFormsError={googleFormsError}
             onFormTitleChange={setFormTitle}
             onFormDescriptionChange={setFormDescription}
             onFormSettingsChange={setFormSettings}
             onCreateForm={handleCreateForm}
             onBack={handleBackToWelcome}
           />
        )}
      </div>
    </div>
  );
}