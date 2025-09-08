'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const draftId = searchParams.get('draftId');
    const builder = searchParams.get('builder');

    if (!builder) {
      // Si no hay builder especificado, redirigir a manual por defecto
      router.push('/create/manual');
      return;
    }

    // Validar y redirigir según el builder
    switch (builder) {
      case 'ai':
        router.push(draftId ? `/create/ai?draftId=${draftId}` : '/create/ai');
        break;
      case 'manual':
        router.push(draftId ? `/create/manual?draftId=${draftId}` : '/create/manual');
        break;
      case 'file':
        router.push(draftId ? `/create/file?draftId=${draftId}` : '/create/file');
        break;
      default:
        // Si el builder no es válido, redirigir a manual
        router.push('/create/manual');
        break;
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirigiendo al creador de formularios...</p>
      </div>
    </div>
  );
}