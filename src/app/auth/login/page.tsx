'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Chrome,
  CheckCircle
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useAuthContext } from '@/containers/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const { 
    signInWithGoogle, 
    loading, 
    error,
    clearError 
  } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      // Verificar conexión a internet
      if (!navigator.onLine) {
        alert('No hay conexión a internet. Por favor, verifica tu conexión.');
        return;
      }

      await signInWithGoogle();
      router.push('/dashboard');
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      // Error ya manejado por useAuth - no necesitamos hacer nada aquí
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <Logo className="w-12 h-12" width={48} height={48} />
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
          <p className="text-muted-foreground">
            Inicia sesión con Google para acceder a tus formularios
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Conecta con tu cuenta de Google para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Why Google Info */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>¿Por qué Google?</strong> Necesitamos acceso a tu cuenta de Google para crear y administrar tus formularios directamente en Google Forms.
              </AlertDescription>
            </Alert>

            {/* Google Login Button */}
            <Button
              className="w-full h-12"
              onClick={() => {
                clearError();
                handleGoogleLogin();
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {error ? 'Reintentando...' : 'Conectando con Google...'}
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-4 w-4" />
                  Continuar con Google
                </>
              )}
            </Button>

            {/* Legal Consent */}
            <div className="space-y-3 text-center">
              <p className="text-xs text-muted-foreground">
                Al hacer clic en "Continuar con Google" aceptas nuestros{' '}
                <Link 
                  href="/legals/ttcc" 
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                >
                  Términos y Condiciones
                </Link>
                {' '}y{' '}
                <Link 
                  href="/legals/pp" 
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                >
                  Política de Privacidad
                </Link>
                .
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="space-y-3">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {error.includes('Timeout') ? 
                      'La conexión está tardando más de lo esperado. Por favor, verifica tu conexión a internet.' :
                      error.includes('popup') ?
                      'Por favor, permite las ventanas emergentes (popups) en tu navegador para continuar.' :
                      error.includes('cancelado') ?
                      'El proceso de autenticación fue cancelado. Intenta nuevamente.' :
                      error
                    }
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Intentar de nuevo
                </Button>
              </div>
            )}

            {/* What you get */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-medium text-center">Al conectar tu cuenta obtienes:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Creación automática de formularios en Google Forms</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sincronización de respuestas en tiempo real</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Gestión centralizada desde tu dashboard</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <Badge variant="outline" className="w-full justify-center">
              ⚡ Rápido
            </Badge>
            <p className="text-xs text-muted-foreground">
              Formularios en segundos
            </p>
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="w-full justify-center">
              🔒 Seguro
            </Badge>
            <p className="text-xs text-muted-foreground">
              Integración con Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}