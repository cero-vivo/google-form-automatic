'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface SessionRenewalAlertProps {
  show: boolean;
  onRenew: () => void;
  isRenewing?: boolean;
  error?: string | null;
}

export function SessionRenewalAlert({ 
  show, 
  onRenew, 
  isRenewing = false, 
  error 
}: SessionRenewalAlertProps) {
  if (!show) return null;

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <AlertDescription className="text-amber-800">
            {error || 'Tu sesión con Google ha expirado. Necesitas renovar los permisos para continuar.'}
          </AlertDescription>
        </div>
        <Button
          onClick={onRenew}
          disabled={isRenewing}
          size="sm"
          className="ml-4 bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isRenewing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Renovando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Renovar sesión
            </>
          )}
        </Button>
      </div>
    </Alert>
  );
}