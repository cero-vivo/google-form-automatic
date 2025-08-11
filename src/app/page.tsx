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
        <Button variant="ghost" asChild className="flex items-center space-x-2 p-2 hover:bg-white/10">
          <Link href="/dashboard">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full ring-2 ring-velocity" />
            ) : (
              <div className="w-8 h-8 bg-velocity rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0)}</span>
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-primary">{user.displayName}</span>
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
            <Link href="#docs" className="text-primary hover:text-velocity transition-all duration-300 font-medium relative group">
              Documentación
              <span className="absolute -bottom-1 left-0 w-0.5 h-0.5 bg-velocity transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <AuthArea />
          </div>
        </div>
      </header>

      {/* Hero Section - Solid colors, high conversion */}
      <section className="relative py-24 px-6 bg-light-gray overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy + CTAs + Social Proof */}
          <div>
            <Badge className="mb-6 bg-velocity/10 text-velocity border-velocity/30 px-4 py-2 font-semibold">
              Convierte Excel/CSV a Google Forms
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-primary">
              Crea Google Forms desde Excel en segundos
            </h1>
            <p className="text-lg md:text-xl text-muted mb-8 max-w-xl leading-relaxed">
              Sube tu archivo y obtén un formulario profesional listo para usar. Velocidad, precisión y cero complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="btn-modern text-white font-bold text-lg px-8 py-5">
                <Link href="/dashboard" className="flex items-center">
                  <Upload className="mr-3 h-6 w-6" />
                  Probar Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary/30 text-primary hover:border-velocity hover:text-velocity hover:bg-velocity/5 text-lg px-8 py-5">
                <Link href="#demo" className="flex items-center">
                  <Target className="mr-3 h-5 w-5" />
                  Ver Demo
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-velocity" />
                <span className="font-semibold text-primary">4.9/5 valoración</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-forms" />
                <span className="font-semibold text-primary">+50,000 formularios creados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-excel" />
                <span className="font-semibold text-primary">Gratis para empezar</span>
              </div>
            </div>
          </div>

          {/* Right: Promotional Images Showcase */}
          <div className="relative max-w-xl w-full mx-auto">
            <div className="relative">
              <Image
                src="/images/image.png"
                alt="Importar Excel y CSV"
                width={680}
                height={420}
                className="rounded-2xl shadow-xl border border-gray-200 bg-white"
                priority
              />
              <Image
                src="/images/image1.png"
                alt="Formulario de Google generado"
                width={520}
                height={320}
                className="rounded-2xl shadow-lg border border-gray-200 bg-white absolute -bottom-8 -right-8 hidden md:block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section - Immediate conversion */}
      <section id="upload" className="py-24 px-6 bg-white">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary">
              Sube tu archivo y genera tu formulario ahora
            </h2>
            <p className="text-lg text-muted mb-8 max-w-xl">
              Arrastra tu Excel o CSV y en segundos tendrás un Google Form listo para publicar.
            </p>
            <ul className="space-y-3 text-primary">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-excel" /> Soporta .xlsx y .csv</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-excel" /> Detección automática de tipos de preguntas</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-excel" /> Exportación directa a Google Forms</li>
            </ul>
          </div>
          <div>
            <FileUploadCard className="max-w-xl w-full mx-auto" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-velocity-light">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-primary">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl mb-8 text-muted max-w-2xl mx-auto">
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
          
          <p className="text-muted mb-8 text-lg max-w-2xl mx-auto">
            La forma más rápida de crear Google Forms desde Excel y CSV, con precisión y sin complicaciones.
          </p>
          
          <div className="pt-8 border-t border-primary/10 text-muted">
            <p className="font-medium">© 2024 FastForm. El futuro es ahora.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
