'use client';

import { AIChatFormCreator } from '@/components/organisms/AIChatFormCreator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCredits } from '@/containers/useCredits';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { Suspense } from 'react';

function AIChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentCredits } = useCredits();

  const draftId = searchParams.get('draftId');

  const handleFormCreated = (formData: any) => {
    const onFormCreated = searchParams.get('onFormCreated');
    if (onFormCreated) {
      router.push(onFormCreated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <Button variant="ghost" size="sm" asChild className="p-2 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center ml-2 min-w-0">
                <Logo className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
                <div className="ml-2 min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary truncate">
                    FastForm IA
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block truncate">
                    Crea formularios con inteligencia artificial
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-shrink-0">
              <div className="text-right">
                <p className="text-sm font-medium text-purple-600 hidden sm:block">Creación Inteligente</p>
                <p className="text-xs text-muted-foreground">
                  {currentCredits} <span className="hidden sm:inline">créditos</span>
                  <span className="sm:hidden">créd.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>


		  <AIChatFormCreator
			onFormCreated={handleFormCreated}
			draftId={draftId || undefined}
		  />


    </div>
  );
}

export default function AIChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando asistente de IA...</p>
        </div>
      </div>
    }>
      <AIChatPageContent />
    </Suspense>
  );
}
