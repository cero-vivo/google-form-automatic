'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Chrome,
  User,
  CheckCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/containers/useAuth';
import { useRouter } from 'next/navigation';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  
  const { 
    signUpWithEmail, 
    signInWithGoogle, 
    loading, 
    error, 
    clearError 
  } = useAuthContext();

  // Validación de contraseña en tiempo real
  const passwordValidation: PasswordValidation = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(); // Limpiar error al escribir
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validaciones
      if (!isPasswordValid) {
        throw new Error('La contraseña no cumple con los requisitos de seguridad');
      }

      if (!passwordsMatch) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (!acceptTerms) {
        throw new Error('Debes aceptar los términos y condiciones');
      }

      await signUpWithEmail(formData.email, formData.password, formData.name);
      router.push('/dashboard');
      
    } catch (err) {
      // Error ya manejado por useAuth
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      // Error ya manejado por useAuth
    }
  };

  const ValidationIcon = ({ valid }: { valid: boolean }) => (
    valid ? (
      <CheckCircle className="h-3 w-3 text-green-500" />
    ) : (
      <X className="h-3 w-3 text-red-500" />
    )
  );

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
          
          <h1 className="text-3xl font-bold mb-2">¡Únete a FormGenerator!</h1>
          <p className="text-muted-foreground">
            Crea tu cuenta gratuita y comienza a generar formularios profesionales
          </p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Completa el formulario para comenzar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Google Register Button */}
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-4 w-4" />
              )}
              Registrarse con Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O regístrate con email
                </span>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password Validation */}
                {formData.password && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Requisitos de contraseña:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <ValidationIcon valid={passwordValidation.minLength} />
                        <span>Mín. 8 caracteres</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ValidationIcon valid={passwordValidation.hasUppercase} />
                        <span>Mayúscula</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ValidationIcon valid={passwordValidation.hasLowercase} />
                        <span>Minúscula</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ValidationIcon valid={passwordValidation.hasNumber} />
                        <span>Número</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password Match Validation */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-xs">
                    <ValidationIcon valid={passwordsMatch} />
                    <span>
                      {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1"
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  Acepto los{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    política de privacidad
                  </Link>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !isPasswordValid || !passwordsMatch || !acceptTerms}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta Gratuita'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

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

        {/* Plan Benefits */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-medium text-center">Tu cuenta gratuita incluye:</h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Hasta 5 formularios</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>100 respuestas por formulario</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Integración con Google Forms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 