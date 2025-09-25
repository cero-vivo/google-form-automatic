'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const draftId = searchParams.get('draftId');
  const builder = searchParams.get('builder');

  useEffect(() => {
    // Redirigir según el tipo de builder seleccionado
    if (builder && draftId) {
      const builderRoutes = {
        'ai': '/create/ai',
        'manual': '/create/manual', 
        'file': '/create/file'
      };
      
      const targetRoute = builderRoutes[builder as keyof typeof builderRoutes];
      if (targetRoute) {
        router.replace(`${targetRoute}?draftId=${draftId}`);
        return;
      }
    }
    
    // Si no hay parámetros específicos, redirigir al dashboard
    router.replace('/dashboard');
  }, [builder, draftId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}