'use client';

import { useEffect } from 'react';
import { useAuthContext } from '@/containers/useAuth';
import { CreatedFormResult } from '@/infrastructure/google/google-forms-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FormCreatedModalProps {
  createdForm: CreatedFormResult | null;
  error: string | null;
  onClose: () => void;
  onClearError: () => void;
}

export function FormCreatedModal({ 
  createdForm, 
  error, 
  onClose, 
  onClearError 
}: FormCreatedModalProps) {
  const { signInWithGoogle } = useAuthContext();

  useEffect(() => {
    if (createdForm || error) {
      // Mostrar modal cuando hay un formulario creado o error
    }
  }, [createdForm, error]);

  const handleReauth = async () => {
    try {
      await signInWithGoogle();
      onClearError();
    } catch (err) {
      console.error('Error reautenticando:', err);
    }
  };

  const isTokenError = error && (
    error.includes('Token') || 
    error.includes('sesión') || 
    error.includes('permisos')
  );

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Hubo un problema al crear el formulario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">{error}</p>
            
            {isTokenError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 mb-2">
                  Para continuar, necesitas renovar tus permisos con Google.
                </p>
                <Button 
                  onClick={handleReauth}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  🔑 Renovar permisos con Google
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={onClearError} variant="outline" className="flex-1">
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!createdForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-green-600">¡Formulario Creado! 🎉</CardTitle>
          <CardDescription>Tu formulario se ha creado exitosamente en Google Forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{createdForm.title}</h3>
            <Badge variant="secondary" className="mt-1">
              {createdForm.questionCount} pregunta{createdForm.questionCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">URLs del formulario:</p>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Responder formulario:</span>
                <a 
                  href={createdForm.formUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {createdForm.formUrl}
                </a>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Editar formulario:</span>
                <a 
                  href={createdForm.editUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {createdForm.editUrl}
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => window.open(createdForm.formUrl, '_blank')}
              className="flex-1"
            >
              Ver formulario
            </Button>
            <Button 
              onClick={() => window.open(createdForm.editUrl, '_blank')}
              variant="outline"
              className="flex-1"
            >
              Editar
            </Button>
          </div>
          
          <Button onClick={onClose} variant="outline" className="w-full">
            Cerrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 