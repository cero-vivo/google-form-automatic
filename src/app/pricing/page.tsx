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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { pricingPlans, faqData, type PricingPlan } from '@/data/pricing';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Sparkles className="w-6 h-6" />;
      case 'pro': return <Zap className="w-6 h-6" />;
      case 'business': return <Users className="w-6 h-6" />;
      case 'enterprise': return <Crown className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getAnnualDiscount = (price: number) => {
    if (price === 0) return 0;
    return Math.round(price * 12 * 0.83); // 2 meses gratis = ~17% descuento
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Planes que escalan con tu creatividad
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Elige cuántos formularios necesitas crear por mes. Todas las funcionalidades incluidas en todos los planes.
            Sin compromisos, cancela cuando quieras.
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`font-medium ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              Anual
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              2 meses gratis
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan: PricingPlan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-2 border-primary shadow-xl scale-105' 
                  : 'border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-velocity text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  plan.popular 
                  ? 'bg-velocity text-white' 
                  : 'bg-muted text-muted-foreground'
                }`}>
                  {getPlanIcon(plan.id)}
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      {isAnnual && plan.price > 0 
                        ? `$${getAnnualDiscount(plan.price)}`
                        : plan.price === 0 
                          ? 'Gratis'
                          : `$${plan.price}`
                      }
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground ml-2">
                        /{isAnnual ? 'año' : 'mes'}
                      </span>
                    )}
                  </div>
                  
                  {isAnnual && plan.price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">${plan.price * 12}</span>
                      <span className="text-green-600 font-semibold ml-2">
                        Ahorras ${(plan.price * 12) - getAnnualDiscount(plan.price)}
                      </span>
                    </div>
                  )}
                </div>
                
                                 <CardDescription className="text-2xl font-bold text-primary mb-4">
                   {plan.formsPerMonth} formularios/mes
                 </CardDescription>
               </CardHeader>
 
               <CardContent className="space-y-6">
                 <div className="text-center space-y-2">
                   <p className="text-sm text-muted-foreground">
                     Funcionalidad completa incluida:
                   </p>
                   <div className="flex flex-wrap justify-center gap-1">
                     <Badge variant="outline" className="text-xs">Excel/CSV</Badge>
                     <Badge variant="outline" className="text-xs">Google Forms</Badge>
                     <Badge variant="outline" className="text-xs">Todos los tipos</Badge>
                   </div>
                 </div>
                 
                 <Button 
                   className={`w-full ${
                     plan.popular 
                       ? 'bg-velocity hover:opacity-90' 
                       : ''
                                      }`}
                    variant={plan.ctaVariant}
                   size="lg"
                 >
                   {plan.ctaText}
                 </Button>
               </CardContent>
            </Card>
          ))}
        </div>



        {/* Simple Comparison */}
        <div className="bg-white rounded-2xl p-8 mb-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Todos los planes incluyen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Creación desde Excel/CSV</h4>
              <p className="text-sm text-muted-foreground">Sube tus archivos y convierte automáticamente</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Todos los tipos de preguntas</h4>
              <p className="text-sm text-muted-foreground">Texto, múltiple opción, escalas, fechas y más</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Exportación a Google Forms</h4>
              <p className="text-sm text-muted-foreground">Formularios listos en tu cuenta de Google</p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>La única diferencia entre planes es la cantidad de formularios que puedes crear por mes.</strong>
              <br />
              Todas las funcionalidades están disponibles en todos los planes.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="cursor-pointer" onClick={() => toggleFaq(index)}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{faq.question}</h4>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                
                {expandedFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 bg-velocity-light rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">¿Listo para empezar?</h3>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de usuarios que ya están creando formularios más rápido
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Link href="/dashboard">
                Comenzar Gratis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">
                Hablar con Ventas
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 