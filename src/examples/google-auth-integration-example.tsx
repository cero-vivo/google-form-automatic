import React, { useState, useEffect } from 'react';
import { useGoogleAuthContext } from '../providers/GoogleAuthProvider';
import { useGoogleAPIInterceptor } from '../services/google-api-interceptor';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';

/**
 * Ejemplo de integración del sistema de autenticación con Google
 * 
 * Este componente demuestra cómo usar el sistema de autenticación
 * en componentes de React.
 */

interface ExampleProps {
  formData?: any;
}

export function GoogleAuthIntegrationExample({ formData }: ExampleProps) {
  const {
    isGoogleAuthenticated,
    checkGoogleAuthStatus,
    renewGoogleAuth,
    googleAuthStatus,
    error: authError
  } = useGoogleAuthContext();

  const { 
    executeWithAuthRetry,
    fetchWithAuth,
    canProceedWithGoogleOps,
    handleGoogleFormsError
  } = useGoogleAPIInterceptor();

  const [loading, setLoading] = useState(false);
  const [operationResult, setOperationResult] = useState<string | null>(null);

  // Verificar estado al montar
  useEffect(() => {
    checkGoogleAuthStatus();
  }, [checkGoogleAuthStatus]);

  // Ejemplo 1: Verificación simple
  const checkAuthStatus = async () => {
    try {
      const isValid = await checkGoogleAuthStatus(true);
      setOperationResult(`Estado de autenticación: ${isValid ? 'Válido' : 'Inválido'}`);
    } catch (error) {
      setOperationResult(`Error al verificar: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Ejemplo 2: Crear formulario con manejo automático de errores
  const createFormWithRetry = async (data: any) => {
    if (!await canProceedWithGoogleOps()) {
      setOperationResult('No se puede proceder sin autenticación válida');
      return;
    }

    setLoading(true);
    try {
      const result = await executeWithAuthRetry(async () => {
        // Simular llamada a API
        const response = await fetchWithAuth('/api/google-forms/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData: data }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      });

      setOperationResult(`Formulario creado: ${result.id || 'éxito'}`);
    } catch (error) {
      setOperationResult(`Error al crear formulario: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 3: Obtener formularios del usuario
  const getUserForms = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/google-forms/user-forms');
      const data = await response.json();
      setOperationResult(`Formularios encontrados: ${data.forms?.length || 0}`);
    } catch (error) {
      setOperationResult(`Error al obtener formularios: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 4: Manejo de errores específicos
  const handleGoogleError = async (error: any) => {
    try {
      const renewed = await handleGoogleFormsError(error);
      if (renewed) {
        setOperationResult('Sesión renovada exitosamente');
      } else {
        setOperationResult('No se pudo renovar la sesión');
      }
    } catch (handleError) {
      setOperationResult(`Error al manejar: ${handleError instanceof Error ? handleError.message : String(handleError)}`);
    }
  };

  // Ejemplo 5: Renovar permisos manualmente
  const handleManualRenew = async () => {
    try {
      setLoading(true);
      await renewGoogleAuth();
      setOperationResult('Permisos renovados exitosamente');
    } catch (error) {
      setOperationResult(`Error al renovar: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Integración</CardTitle>
          <CardDescription>
            Demostración del uso del sistema de autenticación con Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={checkAuthStatus}
              disabled={loading}
              variant="outline"
            >
              Verificar estado
            </Button>

            <Button 
              onClick={handleManualRenew}
              disabled={loading}
              variant="outline"
            >
              Renovar permisos
            </Button>

            <Button 
              onClick={() => createFormWithRetry({ title: 'Formulario de prueba' })}
              disabled={loading}
            >
              Crear formulario
            </Button>

            <Button 
              onClick={getUserForms}
              disabled={loading}
              variant="outline"
            >
              Obtener formularios
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {operationResult && (
            <Alert>
              <AlertDescription>{operationResult}</AlertDescription>
            </Alert>
          )}

          {authError && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>Estado de autenticación: <strong>{googleAuthStatus}</strong></div>
            <div>Autenticado: <strong>{isGoogleAuthenticated ? 'Sí' : 'No'}</strong></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrapper para uso en aplicaciones
export function GoogleAuthIntegrationExampleWrapper() {
  return (
    <div className="max-w-4xl mx-auto">
      <GoogleAuthIntegrationExample />
    </div>
  );
}

// Exportar funciones auxiliares
export const googleAuthHelpers = {
  checkAuthStatus: async () => {
    // Función auxiliar para verificar estado
    return true;
  },
  
  createAuthHeaders: (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }),
};