import React, { useState, useEffect } from 'react';
import { useGoogleAuthContext } from '@/providers/GoogleAuthProvider';
import { useGoogleAPIInterceptor } from '@/services/google-api-interceptor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Componente de prueba para verificar el sistema de autenticación con Google
 * 
 * Este componente demuestra:
 * 1. Verificación de estado de autenticación
 * 2. Renovación de permisos
 * 3. Operaciones con reintentos automáticos
 * 4. Manejo de errores
 * 5. Actualización en tiempo real
 */

export function GoogleAuthTestComponent() {
  const {
    googleAuthStatus,
    isGoogleAuthenticated,
    checkGoogleAuthStatus,
    renewGoogleAuth,
    isChecking,
    isRenewing,
    error
  } = useGoogleAuthContext();

  const { 
    executeWithAuthRetry,
    fetchWithAuth,
    canProceedWithGoogleOps 
  } = useGoogleAPIInterceptor();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Verificación automática al montar
  useEffect(() => {
    checkGoogleAuthStatus();
  }, [checkGoogleAuthStatus]);

  const addTestResult = (message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${success ? '✅' : '❌'} ${message}`, ...prev]);
  };

  const runFullTest = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      addTestResult('Iniciando pruebas de autenticación...');

      // Test 1: Verificar estado actual
      addTestResult(`Estado actual: ${googleAuthStatus}`);
      
      // Test 2: Verificar si puede proceder con operaciones
      const canProceed = await canProceedWithGoogleOps();
      addTestResult(`Puede proceder con operaciones: ${canProceed}`);

      // Test 3: Verificación manual
      const isValid = await checkGoogleAuthStatus(true);
      addTestResult(`Verificación manual: ${isValid ? 'Válido' : 'Inválido'}`);

      // Test 4: Operación de prueba con reintentos
      if (isValid) {
        addTestResult('Ejecutando operación de prueba...');
        
        const testOperation = async () => {
          // Simular una llamada a la API de Google Forms
          const response = await fetchWithAuth('/api/google-forms/test');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        };

        const result = await executeWithAuthRetry(testOperation);
        addTestResult(`Operación exitosa: ${result?.message || 'Completado'}`);
      }

    } catch (error) {
      addTestResult(`Error en pruebas: ${error instanceof Error ? error.message : String(error)}`, false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualRenew = async () => {
    try {
      addTestResult('Renovando permisos manualmente...');
      await renewGoogleAuth();
      addTestResult('Permisos renovados exitosamente');
      
      // Verificar después de renovar
      const isValid = await checkGoogleAuthStatus(true);
      addTestResult(`Verificación post-renovación: ${isValid ? 'Válido' : 'Inválido'}`);
      
    } catch (error) {
      addTestResult(`Error en renovación: ${error instanceof Error ? error.message : String(error)}`, false);
    }
  };

  const getStatusIcon = () => {
    switch (googleAuthStatus) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'renewing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'checking':
        return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (googleAuthStatus) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'renewing': return 'bg-blue-100 text-blue-800';
      case 'checking': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado de Autenticación con Google</CardTitle>
          <CardDescription>
            Sistema de verificación y renovación automática de permisos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span>Estado actual:</span>
            </div>
            <Badge className={getStatusColor()}>
              {googleAuthStatus || 'desconocido'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Autenticado:</span>
              <Badge variant={isGoogleAuthenticated ? "default" : "secondary"}>
                {isGoogleAuthenticated ? 'Sí' : 'No'}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-gray-600">Verificando:</span>
              <Badge variant={isChecking ? "default" : "secondary"}>
                {isChecking ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={runFullTest}
              disabled={isTesting || isChecking || isRenewing}
              size="sm"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Ejecutar pruebas
                </>
              )}
            </Button>

            <Button 
              onClick={handleManualRenew}
              disabled={isRenewing || !isGoogleAuthenticated}
              variant="outline"
              size="sm"
            >
              {isRenewing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renovando...
                </>
              ) : (
                'Renovar permisos'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Pruebas</CardTitle>
            <CardDescription>
              Historial de operaciones y verificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono p-2 bg-gray-50 rounded">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Uso</CardTitle>
          <CardDescription>
            Código de ejemplo para diferentes escenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Verificación simple</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded">
{`const { isGoogleAuthenticated } = useGoogleAuthContext();
if (!isGoogleAuthenticated) {
  // Manejar caso de no autenticado
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Operación con reintento</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded">
{`const { executeWithAuthRetry } = useGoogleAPIInterceptor();

const createForm = async (data) => {
  return await executeWithAuthRetry(
    () => googleFormsService.createForm(data)
  );
};`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Verificación manual</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded">
{`const { checkGoogleAuthStatus } = useGoogleAuthContext();

useEffect(() => {
  checkGoogleAuthStatus(true); // Verificación silenciosa
}, []);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente wrapper para uso fácil
export function GoogleAuthTestWrapper() {
  return (
    <div className="max-w-4xl mx-auto">
      <GoogleAuthTestComponent />
    </div>
  );
}