'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Check, 
  Star, 
  Zap, 
  Users, 
  Crown,
  Sparkles,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  formsPerMonth: number;
  popular?: boolean;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    formsPerMonth: 5,
    features: [
      '5 formularios por mes',
      'Creación desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación a Google Forms'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 5,
    formsPerMonth: 25,
    features: [
      '25 formularios por mes',
      'Creación desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación a Google Forms',
      'Soporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15,
    formsPerMonth: 100,
    popular: true,
    features: [
      '100 formularios por mes',
      'Creación desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación a Google Forms',
      'Soporte prioritario',
      'Analytics básicos'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 25,
    formsPerMonth: -1, // Ilimitado
    features: [
      'Formularios ilimitados',
      'Creación desde Excel/CSV',
      'Todos los tipos de preguntas',
      'Exportación a Google Forms',
      'Soporte prioritario 24/7',
      'Analytics avanzados',
      'API access'
    ]
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Sparkles className="w-6 h-6" />;
      case 'basic': return <Zap className="w-6 h-6" />;
      case 'pro': return <Users className="w-6 h-6" />;
      case 'enterprise': return <Crown className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * 0.8); // 20% descuento anual
  };

  const handlePlanSelect = (plan: PricingPlan) => {
    if (plan.price === 0) {
      // Plan gratuito - ir al dashboard
      window.location.href = '/dashboard';
    } else {
      // Plan de pago - abrir modal de checkout
      console.log('Plan seleccionado:', plan.name, 'Precio:', plan.price);
      // Aquí abrirías el modal de checkout
      alert(`Seleccionaste ${plan.name} por $${plan.price}/mes`);
    }
  };

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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Precios</h1>
                <p className="text-sm text-muted-foreground">Elige el plan perfecto para ti</p>
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

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Planes que escalan con tu creatividad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Elige cuántos formularios necesitas crear por mes. Todas las funcionalidades incluidas en todos los planes.
            Sin compromisos, cancela cuando quieras.
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`font-medium ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
              Anual
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              20% descuento
            </Badge>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Solo tarjetas de crédito/débito
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  plan.popular 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
                }`}>
                  {getPlanIcon(plan.id)}
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 
                        ? 'Gratis'
                        : isAnnual 
                          ? `$${getAnnualPrice(plan.price)}`
                          : `$${plan.price}`
                      }
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-2">
                        /{isAnnual ? 'año' : 'mes'}
                      </span>
                    )}
                  </div>
                  
                  {isAnnual && plan.price > 0 && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">${plan.price * 12}</span>
                      <span className="text-green-600 font-semibold ml-2">
                        Ahorras ${(plan.price * 12) - getAnnualPrice(plan.price)}
                      </span>
                    </div>
                  )}
                </div>
                
                <CardDescription className="text-lg font-semibold text-blue-600 mb-4">
                  {plan.formsPerMonth === -1 
                    ? 'Formularios ilimitados'
                    : `${plan.formsPerMonth} formularios/mes`
                  }
                </CardDescription>
              </CardHeader>
 
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : plan.price === 0
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  size="lg"
                >
                  {plan.price === 0 ? 'Comenzar gratis' : `Seleccionar ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simple Comparison */}
        <div className="bg-white rounded-2xl p-8 mb-16 text-center border">
          <h3 className="text-2xl font-bold mb-4">Todos los planes incluyen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Creación desde Excel/CSV</h4>
              <p className="text-sm text-gray-600">Sube tus archivos y convierte automáticamente</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Todos los tipos de preguntas</h4>
              <p className="text-sm text-gray-600">Texto, múltiple opción, escalas, fechas y más</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Exportación a Google Forms</h4>
              <p className="text-sm text-gray-600">Formularios listos en tu cuenta de Google</p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>La única diferencia entre planes es la cantidad de formularios que puedes crear por mes.</strong>
              <br />
              Todas las funcionalidades están disponibles en todos los planes.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h4 className="font-semibold">¿Puedo cambiar de plan en cualquier momento?</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sí, puedes cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h4 className="font-semibold">¿Qué métodos de pago aceptan?</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Solo aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express).
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h4 className="font-semibold">¿Los formularios existentes se mantienen?</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sí, todos tus formularios y datos se mantienen intactos al cambiar o cancelar tu plan.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h4 className="font-semibold">¿Ofrecen reembolsos?</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ofrecemos reembolsos completos dentro de los primeros 30 días de tu suscripción.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-blue-50 rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">¿Listo para empezar?</h3>
          <p className="text-xl mb-8 text-gray-600">
            Únete a miles de usuarios que ya están creando formularios más rápido
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">
                Comenzar Gratis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 