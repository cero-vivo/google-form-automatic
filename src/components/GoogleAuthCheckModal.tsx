import React from 'react';
import { useGoogleAuthCheckContext } from '../providers/GoogleAuthCheckProvider';
import { useGoogleAuthContext } from '../providers/GoogleAuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

/**
 * Modal de renovación de permisos que solo aparece cuando es estrictamente necesario
 * Se basa en la verificación real con Google API, no en estimaciones preventivas
 */
export function GoogleAuthCheckModal() {
  const { status, error, checkAuth } = useGoogleAuthCheckContext();
  const { renewGoogleAuth, isRenewing } = useGoogleAuthContext();

  // Solo mostrar el modal cuando el estado sea 'expired'
  const shouldShowModal = status === 'expired';

  const handleRenew = async () => {
    try {
      await renewGoogleAuth();
      // Después de renovar, verificar nuevamente
      await checkAuth();
    } catch (error) {
      console.error('Error al renovar permisos:', error);
    }
  };

  // No renderizar nada durante la fase de verificación
  if (status === 'checking') {
    return null;
  }

  return (
    <Dialog open={shouldShowModal} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Permisos de Google expirados
          </DialogTitle>
          <DialogDescription>
            Es necesario renovar los permisos para continuar usando las funciones de Google Forms
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acción requerida</CardTitle>
              <CardDescription>
                Los permisos de acceso a Google Forms han expirado. 
                Haz clic en "Renovar permisos" para restaurar el acceso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleRenew}
                disabled={isRenewing}
                className="w-full"
              >
                {isRenewing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Renovando...
                  </>
                ) : (
                  'Renovar permisos'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Wrapper para integrar el modal en cualquier componente
 */
export function GoogleAuthCheckModalWrapper() {
  return <GoogleAuthCheckModal />;
}