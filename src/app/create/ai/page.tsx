'use client';

import { AIChatFormCreator } from '@/components/organisms/AIChatFormCreator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCredits } from '@/containers/useCredits';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default function AIChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentCredits } = useCredits();
  
  const handleFormCreated = (formData: any) => {
    const onFormCreated = searchParams.get('onFormCreated');
    if (onFormCreated) {
      router.push(onFormCreated);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Logo className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-primary">Asistente de IA FastForm</h1>
                <p className="text-sm text-muted-foreground">Crea formularios con asistencia de inteligencia artificial</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-purple-600">Creación Inteligente</p>
              <p className="text-xs text-muted-foreground">{currentCredits} créditos disponibles</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">AI</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Asistente Inteligente para Formularios
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Describe en lenguaje natural el formulario que necesitas y nuestra IA te ayudará a crearlo paso a paso. 
              Los primeros 15 mensajes son gratuitos, luego se cobran 2 créditos adicionales.
            </p>
          </div>
          
          <AIChatFormCreator 
            onFormCreated={handleFormCreated} 
          />
        </div>
      </main>
    </div>
  );
}