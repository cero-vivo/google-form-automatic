'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { ArrowRight, Upload, Zap, CheckCircle, Star, Users, FileSpreadsheet, FormInput, Clock, Target, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/containers/useAuth";
import Image from "next/image";
import FileUploadCard from "@/components/molecules/FileUploadCard";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const { user, loading } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const AuthArea = () => {
    if (!isMounted) {
      return <div className="w-28 h-10 bg-gray-200 rounded" />;
    }
    if (loading) {
      return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>;
    }
    if (user) {
      return (
        <Button variant="ghost" asChild className="flex items-center space-x-2 p-2">
          <Link href="/dashboard">
            {user.photoURL ? (
              <Image src={user.photoURL} alt={user.displayName || 'Usuario'} width={32} height={32} className="w-8 h-8 rounded-full ring-2 ring-[#22A565]" />
            ) : (
              <div className="w-8 h-8 bg-velocity rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0)}</span>
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-excel">{user.displayName}</span>
          </Link>
        </Button>
      );
    }
    return (
      <Button className="btn-modern text-white font-semibold px-6 py-2">
        <Link href="/auth/login" className="flex items-center">
          Iniciar con Google
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Modern Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold text-velocity">FastForm</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group">
              Características
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/pricing" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group">
              Precios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/docs" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group">
              Documentación
              <span className="absolute -bottom-1 left-0 w-0.5 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <AuthArea />
          </div>
        </div>
      </header>

      {/* Hero Section - 3 Creation Methods */}
      <section className="relative py-24 px-6 bg-light-gray overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy + CTAs + Social Proof */}
          <div>
            <Badge className="mb-6 bg-velocity/10 text-velocity border-velocity/30 px-4 py-2 font-semibold">
              3 Formas de Crear Google Forms
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-primary">
              Crea formularios profesionales en segundos
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Tres métodos poderosos para crear formularios: importa archivos, construye manualmente o usa IA. Tu flujo, tu elección.
            </p>
            
            {/* 3 Methods Preview */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-primary mb-1">Importar Archivos</h4>
                <p className="text-xs text-muted-foreground">Excel y CSV</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-2">
                  <FormInput className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-primary mb-1">Constructor</h4>
                <p className="text-xs text-muted-foreground">Manual y plantillas</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-primary mb-1">Asistente IA</h4>
                <p className="text-xs text-muted-foreground">Inteligente y rápido</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-modern text-white font-bold text-lg px-8 py-5">
                <Link href="/dashboard" className="flex items-center">
                  <Upload className="mr-3 h-6 w-6" />
                  Comenzar Gratis
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-excel" />
                <span className="font-semibold text-primary">Gratis</span>
              </div>
            </div>
          </div>

          {/* Right: Promotional Images Showcase */}
          <div className="relative max-w-xl w-full mx-auto">
            <div className="relative">
              <Image
                src="/images/heroimage1.png"
                alt="3 métodos de creación de formularios"
                width={680}
                height={420}
                className="rounded-2xl shadow-xl border border-gray-200 bg-white"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 3 Creation Methods */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-velocity/10 text-velocity border-velocity/30 px-4 py-2 font-semibold">
              3 Formas de Crear
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary">
              Elige cómo crear tu formulario
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres métodos diseñados para adaptarse a tu flujo de trabajo. Desde archivos hasta IA, crea formularios como prefieras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* File Upload Method */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 mx-auto">
                  <FileSpreadsheet className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 text-center">Importar Archivos</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Sube Excel o CSV y convierte tus columnas en preguntas automáticamente
                </p>
                <ul className="space-y-2 text-sm text-primary mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Excel (.xlsx) y CSV</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Detección automática de tipos</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Mapeo inteligente de preguntas</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/create/file" className="flex items-center justify-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar Archivo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Manual Builder Method */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6 mx-auto">
                  <FormInput className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 text-center">Constructor Manual</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Crea formularios desde cero con nuestro editor intuitivo y plantillas predefinidas
                </p>
                <ul className="space-y-2 text-sm text-primary mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Editor drag & drop</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Plantillas profesionales</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Validación en tiempo real</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/create/manual" className="flex items-center justify-center">
                    <Target className="mr-2 h-4 w-4" />
                    Crear Manualmente
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant Method */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 text-center">Asistente IA</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Describe lo que necesitas y nuestra IA crea el formulario completo con inteligencia
                </p>
                <ul className="space-y-2 text-sm text-primary mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Conversación natural</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Optimización automática</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-excel flex-shrink-0" /> Mejora continua</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/create/ai" className="flex items-center justify-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Usar IA
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-6 bg-velocity-light">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-primary">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Crea tu primer formulario ahora mismo. Es gratis y toma segundos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-velocity text-white hover:opacity-90 text-lg px-10 py-5 font-bold">
              <Link href="/dashboard" className="flex items-center">
                <Upload className="mr-3 h-6 w-6" />
                Comenzar Gratis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-velocity text-velocity hover:bg-velocity hover:text-white text-lg px-10 py-5 font-bold">
              <Link href="/docs">
                Ver Documentación
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-primary/5 border-t border-primary/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Logo className="w-12 h-12" />
            <span className="text-3xl font-black text-velocity">FastForm</span>
          </div>
          
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            La forma más inteligente y rápida de crear formularios profesionales con Google Forms.
          </p>
          
          <div className="pt-8 border-t border-primary/10 text-muted-foreground">
            <p className="font-medium">© {new Date().getFullYear()} FastForm.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
