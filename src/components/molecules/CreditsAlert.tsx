'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface CreditsAlertProps {
  currentCredits: number;
  threshold?: number;
  loading?: boolean;
}

export default function CreditsAlert({ currentCredits, threshold = 3, loading = false }: CreditsAlertProps) {
  if (loading) {
    return (
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
    );
  }

  // Mostrar alerta solo si los créditos están por debajo del umbral
  if (currentCredits >= threshold) {
    return null;
  }

  const isCritical = currentCredits === 0;
  const isLow = currentCredits <= 2;

  return (
    <Alert 
      variant={isCritical ? "destructive" : "default"}
      className={`mb-4 border-l-4 ${
        isCritical 
          ? 'border-red-500 bg-red-50 text-red-800' 
          : 'border-orange-500 bg-orange-50 text-orange-800'
      }`}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
          isCritical ? 'text-red-600' : 'text-orange-600'
        }`} />
        
        <div className="flex-1">
          <AlertDescription className="font-medium">
            {isCritical 
              ? '¡Sin créditos disponibles!' 
              : 'Créditos bajos'
            }
          </AlertDescription>
          
          <p className="text-sm mt-1 opacity-90">
            {isCritical 
              ? 'No puedes crear más formularios. Compra créditos para continuar.'
              : `Solo te quedan ${currentCredits} crédito${currentCredits !== 1 ? 's' : ''}. Considera comprar más para no interrumpir tu trabajo.`
            }
          </p>
          
          <div className="flex items-center space-x-3 mt-3">
            <Button 
              size="sm" 
              asChild
              className={isCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              <Link href="/pricing">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar Créditos
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className={isCritical ? 'border-red-300 text-red-700 hover:bg-red-100' : 'border-orange-300 text-orange-700 hover:bg-orange-100'}
            >
              <Link href="/dashboard/credits">
                <CreditCard className="h-4 w-4 mr-2" />
                Ver Detalles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}