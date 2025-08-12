'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga para mostrar la animación
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Procesando tu pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header de éxito */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-xl text-muted-foreground">
              Tu compra ha sido procesada correctamente. Los créditos ya están disponibles en tu cuenta.
            </p>
          </div>

          {/* Tarjeta de confirmación */}
          <Card className="mb-8 border-green-200 bg-green-50/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800">
                Créditos Agregados a tu Cuenta
              </CardTitle>
              <CardDescription className="text-green-700">
                Ya puedes comenzar a crear formularios
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FileText className="w-6 h-6 text-green-600" />
                <span className="text-lg font-semibold text-green-800">
                  Los créditos están listos para usar
                </span>
              </div>
              <p className="text-sm text-green-700">
                Recibirás un email de confirmación con los detalles de tu compra.
              </p>
            </CardContent>
          </Card>

          {/* Próximos pasos */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">¿Qué sigue?</CardTitle>
              <CardDescription>
                Ahora que tienes tus créditos, puedes:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Subir tu archivo Excel o CSV</p>
                  <p className="text-sm text-muted-foreground">Con las preguntas que quieres convertir</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Revisar la previsualización</p>
                  <p className="text-sm text-muted-foreground">Ver cómo se verá tu formulario</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Crear el formulario en Google Forms</p>
                  <p className="text-sm text-muted-foreground">Listo para usar en segundos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard">
                <FileText className="w-5 h-5 mr-2" />
                Ir al Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">
                Comprar Más Créditos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ¿Tienes alguna pregunta sobre tu compra?
            </p>
            <p className="text-sm text-muted-foreground">
              Contáctanos en{' '}
              <a href="mailto:soporte@fastform.com" className="text-primary hover:underline">
                soporte@fastform.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 