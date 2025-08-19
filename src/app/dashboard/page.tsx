'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { useCredits } from '@/containers/useCredits';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FormsListModal } from '@/components/dashboard/FormsListModal';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import CreditsAlert from '@/components/molecules/CreditsAlert';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  
  // Guardar montaje para evitar desajustes de hidratación
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const router = useRouter();
  
  // Estado para lista de formularios
  const [showFormsList, setShowFormsList] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuthContext();
  const { currentCredits, loading: creditsLoading } = useCredits();

  const { isLoadingForms, error: googleFormsError, userForms, getUserForms } = useGoogleFormsIntegration();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleQuestionsLoaded = (questions: Question[]) => {
    setLoadedQuestions(questions);
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
        <CreditsAlert currentCredits={currentCredits} loading={creditsLoading} />
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

        <DashboardWelcome
          onQuestionsLoaded={handleQuestionsLoaded}
          currentCredits={currentCredits}
        />
      </div>
    </div>
  );
}