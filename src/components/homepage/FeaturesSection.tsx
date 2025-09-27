'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileSpreadsheet, FormInput, Sparkles, Upload, Target, Zap } from "lucide-react";
import Link from "next/link";

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-velocity/10 text-velocity border-velocity/30 px-4 py-2 font-semibold">
            3 Formas de Crear
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary">
            FastForm: Tu plataforma todo-en-uno
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres métodos diseñados para adaptarse a tu flujo de trabajo. Desde archivos hasta IA, crea formularios como prefieras.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* File Upload Method */}
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
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
            <CardContent className="p-6 sm:p-8">
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
            <CardContent className="p-6 sm:p-8">
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
  );
};