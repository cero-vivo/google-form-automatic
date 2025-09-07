'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/domain/entities/question';
import { useAuthContext } from '@/containers/useAuth';
import { useGoogleFormsIntegration } from '@/containers/useGoogleFormsIntegration';
import { useCredits } from '@/containers/useCredits';
import { useRouter } from 'next/navigation';
import { GoogleAuthCheckProvider } from '@/providers/GoogleAuthCheckProvider';
import { GoogleAuthCheckModal } from '@/components/GoogleAuthCheckModal';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FormsListModal } from '@/components/dashboard/FormsListModal';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import CreditsAlert from '@/components/molecules/CreditsAlert';
import { useGoogleAuthCheckContext } from '@/providers/GoogleAuthCheckProvider';
import { Loader2 } from 'lucide-react';

/**
 * Dashboard con verificación silenciosa de autenticación
 * Solo muestra el modal de renovación cuando es estrictamente necesario
 */

function DashboardContent() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [showFormsList, setShowFormsList] = useState(false);
  
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuthContext();
  const { currentCredits, loading: creditsLoading } = useCredits();
  const { 
    isLoadingForms, 
    error: googleFormsError, 
    userForms, 
    getUserForms 
  } = useGoogleFormsIntegration();

  const { status: authStatus, isLoading: authCheckLoading } = useGoogleAuthCheckContext();

  useEffect(() => setHasMounted(true), []);

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

  // Estados de carga
  const isLoading = authLoading || authCheckLoading || !hasMounted;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {authCheckLoading ? 'Verificando permisos...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  // Evitar render SSR/CSR distinto
  if (!hasMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirigiendo a inicio de sesión...</p>
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
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
        {/* El modal de autenticación aparecerá automáticamente si es necesario */}
        
        <DashboardWelcome
          onQuestionsLoaded={handleQuestionsLoaded}
          currentCredits={currentCredits}
        />
      </div>
      
      {/* Modal condicional de renovación de permisos */}
      <GoogleAuthCheckModal />
    </div>
  );
}

export default function DashboardPageWithAuthCheck() {
  return (
    <GoogleAuthCheckProvider>
      <DashboardContent />
    </GoogleAuthCheckProvider>
  );
}