'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header de fallo */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pago No Procesado
            </h1>
            <p className="text-xl text-muted-foreground">
              Hubo un problema al procesar tu pago. No te preocupes, no se ha cobrado nada.
            </p>
          </div>

          {/* Tarjeta de información */}
          <Card className="mb-8 border-red-200 bg-red-50/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-800">
                ¿Qué pasó?
              </CardTitle>
              <CardDescription className="text-red-700">
                Posibles causas del problema
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 text-sm text-red-700">
                <p>• Fondos insuficientes en tu cuenta</p>
                <p>• Tarjeta bloqueada o vencida</p>
                <p>• Problema temporal del sistema de pagos</p>
                <p>• Datos de pago incorrectos</p>
              </div>
            </CardContent>
          </Card>

          {/* Soluciones */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">¿Cómo solucionarlo?</CardTitle>
              <CardDescription>
                Te recomendamos intentar lo siguiente:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Verifica tu método de pago</p>
                  <p className="text-sm text-muted-foreground">Asegúrate de que tu tarjeta esté activa</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Intenta con otro método</p>
                  <p className="text-sm text-muted-foreground">Tarjeta diferente o transferencia bancaria</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Contacta a soporte</p>
                  <p className="text-sm text-muted-foreground">Si el problema persiste</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/pricing">
                <RefreshCw className="w-5 h-5 mr-2" />
                Intentar Nuevamente
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ¿Necesitas ayuda con el pago?
            </p>
            <p className="text-sm text-muted-foreground">
              Contáctanos en{' '}
              <a href="mailto:soporte@fastform.pro" className="text-primary hover:underline">
                soporte@fastform.pro
              </a>
              {' '}o llama al{' '}
              <a href="tel:+5491112345678" className="text-primary hover:underline">
                +54 9 11 1234-5678
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}