'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import FormInstructions from '@/components/organisms/FormInstructions';
import AdvancedQuestionPreview from '@/components/molecules/AdvancedQuestionPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdvancedQuestionExamples } from '@/components/molecules/AdvancedQuestionExamples';
import FileUploadCard from '@/components/molecules/FileUploadCard';

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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre las 3 formas de crear formularios profesionales en Google Forms: con IA, importando archivos, o construyendo manualmente. 
            Sin importar tu nivel técnico, tenemos la solución perfecta para ti.
          </p>
        </div>

        {/* Quick Start Guide */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Assistant Method */}
            <Card className="border-2 hover:border-purple-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Asistente IA</CardTitle>
                <CardDescription>Crea formularios conversando con inteligencia artificial</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>Conversación natural</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>Detección automática de tipos</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>Sugerencias inteligentes</li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/create/ai">Crear con IA</Link>
                </Button>
              </CardContent>
            </Card>

            {/* File Import Method */}
            <Card className="border-2 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">Importar Archivo</CardTitle>
                <CardDescription>Convierte Excel/CSV en formularios automáticamente</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Excel, CSV, Google Sheets</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Mapeo automático</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Validación inteligente</li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/create/import">Importar Archivo</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Manual Builder Method */}
            <Card className="border-2 hover:border-orange-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Constructor Manual</CardTitle>
                <CardDescription>Construye formularios paso a paso con editor visual</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>Editor drag & drop</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>Plantillas profesionales</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>Personalización total</li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/create/manual">Crear Manualmente</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Methods Guide */}
        <section className="max-w-6xl mx-auto mb-16 space-y-12">
          {/* AI Assistant Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Método 1: Asistente IA</h3>
                <p className="text-muted-foreground mb-6">
                  Nuestro asistente de IA más avanzado. Simplemente describe lo que necesitas y la IA generará un formulario profesional. 
                  Perfecto para usuarios que quieren resultados rápidos sin complicaciones técnicas.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Cómo funciona:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Inicia una conversación describiendo tu formulario</li>
                      <li>2. La IA analiza tus necesidades y sugiere estructura</li>
                      <li>3. Revisa y ajusta las preguntas en tiempo real</li>
                      <li>4. Publica directamente a Google Forms</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Ejemplos de prompts:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• "Necesito un formulario de evaluación de desempeño para empleados"</li>
                      <li>• "Crea una encuesta de satisfacción del cliente para restaurante"</li>
                      <li>• "Formulario de registro para evento corporativo con 100 asistentes"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Import Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Método 2: Importar Archivo</h3>
                <p className="text-muted-foreground mb-6">
                  Convierte archivos existentes en formularios completos. Ideal si ya tienes datos en Excel, CSV o Google Sheets. 
                  El sistema detecta automáticamente tipos de preguntas y validaciones.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Formatos soportados:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Excel (.xlsx, .xls)</li>
                      <li>• CSV (.csv)</li>
                      <li>• Google Sheets</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Detección automática:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Tipos de preguntas</li>
                      <li>• Validaciones requeridas</li>
                      <li>• Opciones de respuesta</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Estructura del archivo:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Columna 1: Pregunta</li>
                      <li>• Columna 2: Tipo</li>
                      <li>• Columna 3: Opciones (si aplica)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">Plantilla de ejemplo:</h4>
                  <div className="text-xs font-mono bg-gray-50 p-3 rounded">
                    Pregunta | Tipo | Opciones | Requerido<br/>
                    ¿Cuál es tu nombre? | texto_corto | | SÍ<br/>
                    ¿Edad tienes? | numero | | SÍ<br/>
                    ¿Estado civil? | opcion_multiple | Soltero,Casado,Otro | NO
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Builder Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Método 3: Constructor Manual</h3>
                <p className="text-muted-foreground mb-6">
                  El editor visual más intuitivo. Crea formularios desde cero con drag & drop, plantillas profesionales, 
                  y personalización completa. Ideal para usuarios que quieren control total sobre cada detalle.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Características principales:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Editor drag & drop intuitivo</li>
                      <li>• Plantillas predefinidas profesionales</li>
                      <li>• Personalización completa de cada pregunta</li>
                      <li>• Vista previa en tiempo real</li>
                      <li>• Validaciones avanzadas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Tipos de preguntas disponibles:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Texto corto y largo</li>
                      <li>• Opción múltiple y checkboxes</li>
                      <li>• Listas desplegables</li>
                      <li>• Escalas lineales</li>
                      <li>• Fecha y hora</li>
                      <li>• Email y número</li>
                      <li>• Archivos adjuntos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Question Types & Validation */}
        <section className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Tipos de Preguntas y Validaciones</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                type: "texto_corto",
                name: "Texto Corto",
                description: "Respuestas de una línea",
                validation: "Longitud mínima/máxima",
                icon: "T"
              },
              {
                type: "texto_largo",
                name: "Texto Largo",
                description: "Respuestas de párrafo",
                validation: "Contador de caracteres",
                icon: "¶"
              },
              {
                type: "opcion_multiple",
                name: "Opción Múltiple",
                description: "Una sola selección",
                validation: "Obligatoria/opcional",
                icon: "○"
              },
              {
                type: "checkboxes",
                name: "Casillas",
                description: "Múltiples selecciones",
                validation: "Mínimo/máximo opciones",
                icon: "☐"
              },
              {
                type: "dropdown",
                name: "Lista Desplegable",
                description: "Menú desplegable",
                validation: "Valor por defecto",
                icon: "▼"
              },
              {
                type: "escala_lineal",
                name: "Escala Lineal",
                description: "Rating numérico",
                validation: "Rango personalizable",
                icon: "★"
              },
              {
                type: "fecha",
                name: "Fecha",
                description: "Selector de fecha",
                validation: "Rango de fechas",
                icon: "📅"
              },
              {
                type: "hora",
                name: "Hora",
                description: "Selector de tiempo",
                validation: "Formato 12/24 horas",
                icon: "🕐"
              },
              {
                type: "email",
                name: "Email",
                description: "Validación de email",
                validation: "Formato email correcto",
                icon: "@"
              }
            ].map((q) => (
              <Card key={q.type} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold">{q.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{q.name}</CardTitle>
                  <CardDescription>{q.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{q.validation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <FileUploadCard hideTemplate={true} />
        </div>

        {/* Advanced Question Examples */}
        <div className="max-w-4xl mx-auto mt-12">
          <AdvancedQuestionExamples />
        </div>

        {/* Advanced Question Types */}
        <div className="max-w-4xl mx-auto mt-12">
          <AdvancedQuestionPreview />
        </div>

        {/* Additional Information */}
        <div className="mt-12 space-y-8">
          {/* FAQ Section - Updated */}
          <section className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Preguntas Frecuentes</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">¿Cuál método debo elegir?</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>IA:</strong> Para crear rápido sin experiencia.<br/>
                    <strong>Archivo:</strong> Si tienes datos existentes.<br/>
                    <strong>Manual:</strong> Para control total.
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">¿Qué tipos de preguntas soporta?</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos los tipos de Google Forms: texto, opción múltiple, casillas, listas, escalas, fecha, hora, email, número y más.
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">¿Cómo funcionan los créditos?</h4>
                  <p className="text-sm text-muted-foreground">
                    • IA: 2 créditos por formulario<br/>
                    • Archivo: 1 crédito<br/>
                    • Manual: 1 crédito<br/>
                    Créditos gratuitos al registrarte.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">¿Puedo combinar métodos?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sí. Puedes empezar con IA o archivo y luego editar manualmente. Todos los métodos usan el mismo editor visual.
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">¿Los formularios son realmente míos?</h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutamente. Se crean en tu Google Drive con tu cuenta. FastForm solo facilita el proceso de creación.
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">¿Puedo editar después de crear?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sí. Recibes enlaces para ver y editar directamente en Google Forms. Puedes hacer cualquier cambio.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda adicional?</h3>
            <p className="text-muted-foreground mb-6">
              Si tienes preguntas específicas sobre cualquier método o necesitas soporte técnico, no dudes en contactarnos.
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