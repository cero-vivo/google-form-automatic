'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Upload, Zap, CheckCircle, Star, Users } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/containers/useAuth";
import FormInstructions from "@/components/organisms/FormInstructions";

export default function HomePage() {
  const { user, loading } = useAuthContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FormGenerator
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              Características
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              Precios
            </Link>
            <Link href="#docs" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              Documentación
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <Button variant="ghost" asChild className="flex items-center space-x-2 p-2">
                <Link href="/dashboard">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-medium">{user.displayName}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth/login">
                  Iniciar con Google
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-6">
            🚀 Transforma Excel en Google Forms en segundos
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Crea Google Forms
            <br />
            desde archivos Excel
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Sube tu archivo Excel o CSV y convierte automáticamente tus preguntas 
            en formularios profesionales de Google Forms. Sin código, sin complicaciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                <Upload className="mr-2 h-5 w-5" />
                Subir Archivo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.9/5 estrellas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>+10,000 usuarios activos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>100% gratis para empezar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir FormGenerator?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              La forma más rápida y sencilla de crear formularios profesionales 
              a partir de tus datos existentes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Carga Inteligente</CardTitle>
                <CardDescription>
                  Detecta automáticamente tipos de preguntas desde Excel/CSV. 
                  Soporte para múltiple opción, texto, escalas y más.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Previsualización en Tiempo Real</CardTitle>
                <CardDescription>
                  Ve cómo se verá tu formulario antes de publicarlo. 
                  Edita, reordena y personaliza sobre la marcha.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Integración con Google</CardTitle>
                <CardDescription>
                  Publica directamente en Google Forms con un clic. 
                  Mantén toda la funcionalidad nativa de Google.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Validaciones Automáticas</CardTitle>
                <CardDescription>
                  Aplica validaciones inteligentes basadas en el tipo de datos. 
                  Emails, números, longitud de texto y más.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Gestión Completa</CardTitle>
                <CardDescription>
                  Dashboard para gestionar todos tus formularios. 
                  Estadísticas, respuestas y análisis en un solo lugar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle>Plantillas Premium</CardTitle>
                <CardDescription>
                  Biblioteca de plantillas prediseñadas para diferentes 
                  industrias y casos de uso. Empieza rápido.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              En solo 3 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Sube tu archivo</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Arrastra tu archivo Excel o CSV con las preguntas y opciones de respuesta.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Previsualiza y edita</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Revisa el formulario generado automáticamente y haz ajustes si es necesario.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Publica en Google</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Con un clic, tu formulario estará listo y publicado en Google Forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de usuarios que ya están creando formularios más rápido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Crear mi primer formulario
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/templates">
                Ver plantillas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Documentación
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas saber para crear formularios profesionales desde Excel y CSV
            </p>
          </div>
          
          <FormInstructions />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FormGenerator</span>
          </div>
          
          <p className="text-slate-400 mb-6">
            La forma más inteligente de crear Google Forms desde Excel
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Soporte
            </Link>
            <Link href="#docs" className="hover:text-white transition-colors">
              Documentación
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-slate-400">
            © 2024 FormGenerator. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
