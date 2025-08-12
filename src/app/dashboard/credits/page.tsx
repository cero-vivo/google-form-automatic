'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  CreditCard,
  FileText
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuthContext } from '@/containers/useAuth';
import { useRouter } from 'next/navigation';
import CreditsManager from '@/components/organisms/CreditsManager';
import { useCredits } from '@/containers/useCredits';

// Datos mock para demostración - en producción vendrían de la base de datos
const mockTransactions = [
  {
    id: '1',
    type: 'purchase' as const,
    amount: 50,
    description: 'Compra de 50 créditos - Pack Business',
    date: new Date('2024-01-15T10:30:00'),
    status: 'completed' as const
  },
  {
    id: '2',
    type: 'usage' as const,
    amount: 1,
    description: 'Formulario: Encuesta de satisfacción',
    date: new Date('2024-01-16T14:20:00'),
    status: 'completed' as const
  },
  {
    id: '3',
    type: 'usage' as const,
    amount: 1,
    description: 'Formulario: Registro de usuarios',
    date: new Date('2024-01-17T09:15:00'),
    status: 'completed' as const
  },
  {
    id: '4',
    type: 'purchase' as const,
    amount: 20,
    description: 'Compra de 20 créditos - Pack Starter',
    date: new Date('2024-01-18T16:45:00'),
    status: 'completed' as const
  }
];

export default function CreditsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const { user, loading: authLoading } = useAuthContext();
  const { 
    credits, 
    loading: creditsLoading, 
    currentCredits, 
    totalPurchased, 
    totalUsed, 
    usagePercentage,
    error: creditsError,
    clearError 
  } = useCredits();
  const router = useRouter();

  // Guardar montaje para evitar desajustes de hidratación
  useEffect(() => setHasMounted(true), []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication or loading credits
  if (authLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {creditsLoading ? 'Cargando créditos...' : 'Cargando...'}
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  // Usar datos reales de Firestore en lugar de mock
  const transactions = credits?.history || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
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
                <h1 className="text-xl font-bold text-primary">Créditos</h1>
                <p className="text-sm text-muted-foreground">Gestiona tu saldo de formularios</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {creditsError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar créditos
            </h3>
            <p className="text-muted-foreground mb-4">{creditsError}</p>
            <Button onClick={clearError} variant="outline">
              Intentar de nuevo
            </Button>
          </div>
        ) : (
          <CreditsManager
            currentCredits={currentCredits}
            totalCreditsPurchased={totalPurchased}
            totalCreditsUsed={totalUsed}
            transactions={transactions}
          />
        )}
      </div>
    </div>
  );
} 