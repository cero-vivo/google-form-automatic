'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionFailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Failure Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pago No Procesado
            </h1>
            <p className="text-xl text-gray-600">
              Hubo un problema al procesar tu pago. No te preocupes, no se ha cobrado nada.
            </p>
          </div>

          {/* Error Details Card */}
          <Card className="mb-8 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                ¿Qué pasó?
              </CardTitle>
              <CardDescription className="text-red-700">
                Posibles causas del problema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Tarjeta declinada:</strong> Tu banco rechazó la transacción
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Fondos insuficientes:</strong> No hay saldo disponible en tu cuenta
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Datos incorrectos:</strong> Información de pago incompleta o errónea
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Problema temporal:</strong> Error en el sistema de pagos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solutions Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
                Soluciones
              </CardTitle>
              <CardDescription>
                Pasos para resolver el problema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Verifica tu información:</strong> Asegúrate de que los datos de pago sean correctos
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Contacta a tu banco:</strong> Confirma que tu tarjeta esté habilitada para compras online
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Intenta con otro método:</strong> Usa una tarjeta diferente o transferencia bancaria
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Espera unos minutos:</strong> A veces los problemas se resuelven solos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/pricing">
                Intentar de Nuevo
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>

          {/* Help Section */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <HelpCircle className="w-5 h-5 mr-2" />
                ¿Necesitas ayuda?
              </CardTitle>
              <CardDescription className="text-blue-700">
                Nuestro equipo está aquí para ayudarte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-blue-800">
                  Si continúas teniendo problemas, no dudes en contactarnos:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-blue-800">Email:</span>
                    <a 
                      href="mailto:soporte@fastform.com" 
                      className="text-blue-600 hover:underline ml-2"
                    >
                      soporte@fastform.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-blue-800">WhatsApp:</span>
                    <span className="text-blue-800 ml-2">+54 9 11 1234-5678</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-blue-800">Horario:</span>
                    <span className="text-blue-800 ml-2">Lun-Vie 9:00-18:00 (GMT-3)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              ¿Prefieres usar otro método de pago?{' '}
              <Link href="/pricing" className="text-blue-600 hover:underline">
                Ver opciones disponibles
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 