'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, ExternalLink, X } from 'lucide-react';
import { useGoogleAuthContext } from '@/providers/GoogleAuthProvider';
import { getGoogleAuthConfig } from '@/config/google-auth.config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface GoogleAuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  autoShow?: boolean;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  open,
  onOpenChange,
  title = 'Renovar permisos de Google',
  description = 'Tu sesión con Google ha expirado o los permisos son insuficientes para continuar.',
  showCloseButton = false,
  autoShow = true,
}) => {
  const { 
    googleAuthStatus, 
    renewGoogleAuth, 
    isRenewing, 
    error: authError,
    lastCheckTime 
  } = useGoogleAuthContext();

  const [isOpen, setIsOpen] = useState(false);
  const [renewProgress, setRenewProgress] = useState(0);

  // Determinar si mostrar el modal automáticamente
  const shouldShowModal = googleAuthStatus === 'expired' || googleAuthStatus === 'error';

  useEffect(() => {
    if (autoShow && shouldShowModal) {
      setIsOpen(true);
    } else if (!shouldShowModal) {
      setIsOpen(false);
    }
  }, [autoShow, shouldShowModal]);

  useEffect(() => {
    if (isRenewing) {
      // Simular progreso de renovación
      const interval = setInterval(() => {
        setRenewProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return Math.min(prev + 10, 100);
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setRenewProgress(0);
    }
  }, [isRenewing]);

  const handleRenew = async () => {
    try {
      setRenewProgress(0);
      const success = await renewGoogleAuth();
      
      if (success) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    } catch (error) {
      console.error('Error renewing Google auth:', error);
    }
  };

  const handleClose = () => {
    if (!isRenewing) {
      setIsOpen(false);
      onOpenChange?.(false);
    }
  };

  const getStatusIcon = () => {
    switch (googleAuthStatus) {
      case 'expired':
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'renewing':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (googleAuthStatus) {
      case 'expired':
      case 'error':
        return 'destructive';
      case 'renewing':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (googleAuthStatus) {
      case 'expired':
        return 'Sesión expirada';
      case 'error':
        return 'Error de autenticación';
      case 'renewing':
        return 'Renovando...';
      default:
        return 'Verificando...';
    }
  };

  const modalOpen = open !== undefined ? open : isOpen;

  return (
    <Dialog open={modalOpen} onOpenChange={onOpenChange || setIsOpen}>
      <DialogContent 
        className="sm:max-w-md" 
        onEscapeKeyDown={!showCloseButton ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={!showCloseButton ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            {getGoogleAuthConfig().messages.renewalTitle}
          </DialogTitle>
          <DialogDescription>
            {getGoogleAuthConfig().messages.renewalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado actual */}
          <Alert variant={getStatusColor() as any}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{getStatusText()}</AlertTitle>
            <AlertDescription>
              {authError || 'Por favor, renueva tus permisos para continuar.'}
            </AlertDescription>
          </Alert>

          {/* Información adicional */}
          {lastCheckTime && (
            <div className="text-sm text-muted-foreground">
              Última verificación: {lastCheckTime.toLocaleTimeString()}
            </div>
          )}

          {/* Barra de progreso durante renovación */}
          {isRenewing && (
            <div className="space-y-2">
              <Progress value={renewProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Estableciendo conexión con Google...
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {showCloseButton && (
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isRenewing}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          )}
          
          <Button
            onClick={handleRenew}
            disabled={isRenewing}
            className="w-full sm:w-auto"
          >
            {isRenewing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Renovando...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                {getGoogleAuthConfig().messages.renewalButtonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Componente wrapper para mostrar el modal cuando sea necesario
export const GoogleAuthModalWrapper: React.FC<Omit<GoogleAuthModalProps, 'open' | 'onOpenChange'>> = (props) => {
  const { googleAuthStatus } = useGoogleAuthContext();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (googleAuthStatus === 'expired' || googleAuthStatus === 'error') {
      setIsOpen(true);
    }
  }, [googleAuthStatus]);

  return (
    <GoogleAuthModal
      open={isOpen}
      onOpenChange={setIsOpen}
      {...props}
    />
  );
};