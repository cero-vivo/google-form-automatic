'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header de pendiente */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pago en Proceso
            </h1>
            <p className="text-xl text-muted-foreground">
              Tu pago está siendo procesado. Esto puede tomar unos minutos.
            </p>
          </div>

          {/* Tarjeta de información */}
          <Card className="mb-8 border-yellow-200 bg-yellow-50/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-yellow-800">
                ¿Qué significa esto?
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Tu pago está siendo verificado
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 text-sm text-yellow-700">
                <p>• El pago se está procesando en tu banco</p>
                <p>• Puede tomar entre 5 minutos y 24 horas</p>
                <p>• Recibirás una notificación cuando se complete</p>
                <p>• Los créditos se agregarán automáticamente</p>
              </div>
            </CardContent>
          </Card>

          {/* Métodos de pago que pueden estar pendientes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Métodos de pago que pueden estar pendientes</CardTitle>
              <CardDescription>
                Algunos métodos de pago requieren verificación adicional:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">💳</span>
                </div>
                <div>
                  <p className="font-medium">Tarjetas de crédito</p>
                  <p className="text-sm text-muted-foreground">Verificación del banco emisor</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">🏦</span>
                </div>
                <div>
                  <p className="font-medium">Transferencias bancarias</p>
                  <p className="text-sm text-muted-foreground">Procesamiento interbancario</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">💰</span>
                </div>
                <div>
                  <p className="font-medium">Efectivo en puntos de pago</p>
                  <p className="text-sm text-muted-foreground">Confirmación del operador</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qué hacer mientras esperas */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">¿Qué puedes hacer mientras esperas?</CardTitle>
              <CardDescription>
                Aprovecha este tiempo para prepararte:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Prepara tus archivos</p>
                  <p className="text-sm text-muted-foreground">Organiza tus Excel o CSV con las preguntas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">📋</span>
                </div>
                <div>
                  <p className="font-medium">Revisa la documentación</p>
                  <p className="text-sm text-muted-foreground">Aprende sobre los tipos de preguntas disponibles</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">🎯</span>
                </div>
                <div>
                  <p className="font-medium">Planifica tus formularios</p>
                  <p className="text-sm text-muted-foreground">Define la estructura y flujo de tus encuestas</p>
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
                <RefreshCw className="w-5 h-5 mr-2" />
                Ver Estado del Pago
              </Link>
            </Button>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ¿Tienes dudas sobre el estado de tu pago?
            </p>
            <p className="text-sm text-muted-foreground">
              Contáctanos en{' '}
              <a href="mailto:soporte@fastform.pro" className="text-primary hover:underline">
                soporte@fastform.pro
              </a>
              {' '}o revisa tu email para actualizaciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}