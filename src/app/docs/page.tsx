'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import FormInstructions from '@/components/organisms/FormInstructions';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-velocity rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Documentación</h1>
                <p className="text-sm text-muted-foreground">Todo lo que necesitas saber</p>
              </div>
            </div>
          </div>
          
          <Button asChild>
            <Link href="/dashboard">
              Ir al Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Documentación de FastForm
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aprende a crear formularios profesionales en Google Forms desde archivos Excel y CSV de manera sencilla y eficiente.
          </p>
        </div>

        {/* Main Instructions */}
        <FormInstructions />

        {/* Additional Information */}
        <div className="mt-12 space-y-8">
          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes</h3>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">¿Qué tipos de preguntas puedo crear?</h4>
                <p className="text-muted-foreground text-sm">
                  FastForm soporta todos los tipos principales de preguntas de Google Forms: respuestas cortas y largas, 
                  opción múltiple, casillas de verificación, listas desplegables, escalas lineales, fechas, horas, emails, 
                  números y teléfonos.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">¿Hay límite en el número de preguntas?</h4>
                <p className="text-muted-foreground text-sm">
                  No hay límite específico en FastForm, aunque Google Forms tiene sus propias limitaciones. 
                  Recomendamos mantener formularios de menos de 100 preguntas para una mejor experiencia del usuario.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">¿Necesito conocimientos técnicos?</h4>
                <p className="text-muted-foreground text-sm">
                  No, FastForm está diseñado para ser usado por cualquier persona. Solo necesitas saber organizar 
                  datos en Excel o CSV, lo cual es muy similar a crear una tabla básica.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">¿Los formularios creados son míos?</h4>
                <p className="text-muted-foreground text-sm">
                  Sí, completamente. Los formularios se crean directamente en tu cuenta de Google Drive y tú mantienes 
                  el control total sobre ellos. FastForm solo actúa como facilitador del proceso de creación.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">¿Puedo editar el formulario después de crearlo?</h4>
                <p className="text-muted-foreground text-sm">
                  Por supuesto. Una vez creado, recibirás enlaces para ver y editar el formulario directamente en Google Forms, 
                  donde podrás hacer todos los ajustes que necesites.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">¿Qué pasa si mi archivo no se procesa correctamente?</h4>
                <p className="text-muted-foreground text-sm">
                  FastForm validará tu archivo y te mostrará una vista previa antes de crear el formulario. 
                  Si hay errores, recibirás mensajes específicos sobre qué ajustar. También puedes descargar nuestro 
                  archivo de ejemplo como plantilla.
                </p>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda adicional?</h3>
            <p className="text-muted-foreground mb-6">
              Si tienes preguntas específicas o necesitas soporte técnico, no dudes en contactarnos.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="mailto:luis.espinoza.nav@outlook.com?subject=Support%20FastForm">
                  Soporte Técnico
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">
                  Comenzar Ahora
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 