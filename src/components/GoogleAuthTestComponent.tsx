import React, { useState, useEffect } from 'react';
import { useGoogleAuthContext } from '../providers/GoogleAuthProvider';
import { useGoogleAPIInterceptor } from '../services/google-api-interceptor';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

/**
 * Componente de prueba para el sistema de autenticación con Google
 * 
 * Este componente permite probar todas las funcionalidades del sistema
 * de autenticación de Google de forma interactiva.
 */

export function GoogleAuthTestComponent() {
  const {
    isGoogleAuthenticated,
    checkGoogleAuthStatus,
    renewGoogleAuth,
    googleAuthStatus,
    error: authError,
    isChecking,
    isRenewing
  } = useGoogleAuthContext();

  const { 
    executeWithAuthRetry,
    fetchWithAuth,
    canProceedWithGoogleOps,
    handleGoogleFormsError
  } = useGoogleAPIInterceptor();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Función auxiliar para agregar resultados
  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Verificar estado al montar
  useEffect(() => {
    checkGoogleAuthStatus();
  }, [checkGoogleAuthStatus]);

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      addTestResult('Iniciando pruebas de autenticación...');
      
      // Test 1: Verificar estado inicial
      addTestResult('Test 1: Verificando estado inicial');
      const initialStatus = await checkGoogleAuthStatus(true);
      addTestResult(`Estado inicial: ${initialStatus ? 'Válido' : 'Inválido'}`);

      // Test 2: Verificar si puede proceder con operaciones
      addTestResult('Test 2: Verificando permisos para operaciones');
      const canProceed = await canProceedWithGoogleOps();
      addTestResult(`Puede proceder: ${canProceed ? 'Sí' : 'No'}`);

      // Test 3: Prueba de fetch con auth
      if (canProceed) {
        addTestResult('Test 3: Probando fetch con autenticación');
        try {
          const response = await fetchWithAuth('/api/google-forms/test', {
            method: 'GET',
          });
          addTestResult(`Fetch exitoso: ${response.status}`);
        } catch (error) {
          addTestResult(`Fetch fallido: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Test 4: Prueba de reintento con auth retry
      addTestResult('Test 4: Probando reintento automático');
      try {
        await executeWithAuthRetry(async () => {
          // Simular operación que podría fallar
          const response = await fetchWithAuth('/api/google-forms/test-retry');
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return { success: true };
        });
        addTestResult('Reintento exitoso');
      } catch (error) {
        addTestResult(`Reintento fallido: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Test 5: Manejo de errores de Google Forms
      addTestResult('Test 5: Probando manejo de errores');
      try {
        await handleGoogleFormsError({ code: 401, message: 'Unauthorized' });
        addTestResult('Manejo de error completado');
      } catch (error) {
        addTestResult(`Error en manejo: ${error instanceof Error ? error.message : String(error)}`);
      }

      addTestResult('Pruebas completadas');
      
    } catch (error) {
      addTestResult(`Error general: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Prueba individual: Verificar estado
  const testCheckStatus = async () => {
    addTestResult('Verificando estado de autenticación...');
    try {
      const status = await checkGoogleAuthStatus(true);
      addTestResult(`Estado: ${status ? 'Válido' : 'Inválido'}`);
    } catch (error) {
      addTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Prueba individual: Renovar permisos
  const testRenewPermissions = async () => {
    addTestResult('Renovando permisos...');
    try {
      await renewGoogleAuth();
      addTestResult('Permisos renovados exitosamente');
    } catch (error) {
      addTestResult(`Error al renovar: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Prueba individual: Operación con retry
  const testOperationWithRetry = async () => {
    if (!await canProceedWithGoogleOps()) {
      addTestResult('No se puede proceder sin autenticación válida');
      return;
    }

    addTestResult('Ejecutando operación con reintento...');
    try {
      const result = await executeWithAuthRetry(async () => {
        // Simular operación de Google Forms
        const response = await fetchWithAuth('/api/google-forms/test-operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      });
      
      addTestResult(`Operación exitosa: ${JSON.stringify(result)}`);
    } catch (error) {
      addTestResult(`Operación fallida: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Limpiar resultados
  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = () => {
    if (isChecking || isRenewing) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isGoogleAuthenticated) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Test Suite - Autenticación con Google</CardTitle>
          <CardDescription>
            Componente de prueba para verificar el funcionamiento del sistema de autenticación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <strong>Estado de autenticación:</strong> {googleAuthStatus}
            </div>
            <div>
              <strong>Autenticado:</strong> 
              <span className="flex items-center gap-2">
                {getStatusIcon()}
                {isGoogleAuthenticated ? 'Sí' : 'No'}
              </span>
            </div>
            <div>
              <strong>Verificando:</strong> {isChecking ? 'Sí' : 'No'}
            </div>
            <div>
              <strong>Renovando:</strong> {isRenewing ? 'Sí' : 'No'}
            </div>
          </div>

          {/* Controles de prueba */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <Button 
                onClick={runAllTests}
                disabled={isRunningTests}
                className="w-full"
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Ejecutando...
                  </>
                ) : (
                  'Ejecutar todas las pruebas'
                )}
              </Button>

              <Button 
                onClick={testCheckStatus}
                disabled={isRunningTests || isChecking}
                variant="outline"
              >
                Verificar estado
              </Button>

              <Button 
                onClick={testRenewPermissions}
                disabled={isRunningTests || isRenewing}
                variant="outline"
              >
                Renovar permisos
              </Button>

              <Button 
                onClick={testOperationWithRetry}
                disabled={isRunningTests || !isGoogleAuthenticated}
                variant="outline"
              >
                Operación con retry
              </Button>

              <Button 
                onClick={clearResults}
                disabled={isRunningTests}
                variant="ghost"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpiar resultados
              </Button>
            </div>
          </div>

          {/* Resultados de pruebas */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Resultados de pruebas:</h4>
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="text-sm font-mono py-1 border-b last:border-b-0"
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errores de autenticación */}
          {authError && (
            <Alert variant="destructive">
              <AlertDescription>
                Error de autenticación: {authError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Guía rápida */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Verificar estado:</strong> Usa checkGoogleAuthStatus() para verificar el estado actual</p>
            <p><strong>2. Renovar permisos:</strong> Usa renewGoogleAuth() para renovar manualmente</p>
            <p><strong>3. Operaciones seguras:</strong> Usa executeWithAuthRetry() para operaciones con reintento automático</p>
            <p><strong>4. Verificar antes de operar:</strong> Usa canProceedWithGoogleOps() antes de operaciones críticas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrapper para usar en desarrollo
export function GoogleAuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <GoogleAuthTestComponent />
    </div>
  );
}

// Exportar para uso en testing
export const testHelpers = {
  GoogleAuthTestComponent,
  GoogleAuthTestPage
};