'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/containers/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, loading, error, clearError } = useAuthContext();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (err) {
      // Error ya manejado por useAuth
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">
            {emailSent ? '¡Email Enviado!' : '¿Olvidaste tu contraseña?'}
          </h1>
          <p className="text-muted-foreground">
            {emailSent 
              ? 'Revisa tu bandeja de entrada para continuar'
              : 'Te enviaremos instrucciones para recuperar tu cuenta'
            }
          </p>
        </div>

        {/* Reset Password Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {emailSent ? 'Revisa tu Email' : 'Recuperar Contraseña'}
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent 
                ? 'Si el email existe en nuestro sistema, recibirás las instrucciones'
                : 'Ingresa tu email para recibir las instrucciones'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {emailSent ? (
              <>
                {/* Success State */}
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Email enviado a:</h3>
                    <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                      {email}
                    </p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Si no recibes el email en los próximos minutos, revisa tu carpeta de spam.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        setEmailSent(false);
                        setEmail('');
                        clearError();
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      Enviar a otro email
                    </Button>
                    
                    <Button asChild className="w-full">
                      <Link href="/auth/login">
                        Volver al inicio de sesión
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Reset Password Form */}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email de la cuenta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearError();
                        }}
                        className="pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando instrucciones...
                      </>
                    ) : (
                      'Enviar Instrucciones'
                    )}
                  </Button>
                </form>

                {/* Help Text */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    ¿Recordaste tu contraseña?{' '}
                    <Link 
                      href="/auth/login" 
                      className="font-medium text-primary hover:underline"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </>
            )}
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

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium">¿Necesitas ayuda?</h3>
            <p className="text-xs text-muted-foreground">
              Si tienes problemas para acceder a tu cuenta, contacta nuestro soporte técnico.
            </p>
            <Button variant="ghost" size="sm" className="text-xs">
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 