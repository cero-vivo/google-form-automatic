'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
// Removed useSearchParams as it's not needed for this page

export default function SubscriptionSuccessPage() {
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del plan
    setTimeout(() => {
      setPlanDetails({
        name: 'Pro Plan',
        features: [
          '100 formularios por mes',
          'Exportar datos',
          'Personalizar marca',
          'Soporte prioritario',
          'Analytics avanzados'
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu suscripción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Suscripción Activada!
            </h1>
            <p className="text-xl text-gray-600">
              Tu pago se ha procesado correctamente y tu plan está ahora activo
            </p>
          </div>

          {/* Plan Details Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Crown className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                {planDetails?.name}
              </CardTitle>
              <CardDescription className="text-lg">
                Tu nuevo plan está activo desde ahora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {planDetails?.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Próximos pasos
              </CardTitle>
              <CardDescription>
                Comienza a aprovechar tu nuevo plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Crear tu primer formulario</h4>
                  <p className="text-sm text-gray-600">
                    Sube un archivo Excel o CSV para comenzar
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Explorar características</h4>
                  <p className="text-sm text-gray-600">
                    Descubre todas las funcionalidades de tu plan
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Configurar preferencias</h4>
                  <p className="text-sm text-gray-600">
                    Personaliza tu experiencia de usuario
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">
                Ir al Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/create">
                Crear Formulario
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p className="mb-2">
              Recibirás un email de confirmación con los detalles de tu suscripción
            </p>
            <p>
              ¿Tienes preguntas?{' '}
              <a href="mailto:soporte@fastform.com" className="text-blue-600 hover:underline">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 