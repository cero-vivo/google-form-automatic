'use client';

import React, { useState, useEffect } from 'react';
import { Plan } from '@/domain/entities/plan';
import { PlanService } from '@/application/services/plan-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, CreditCard, Banknote } from 'lucide-react';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';

interface PricingSectionProps {
  onPlanSelect?: (plan: Plan, isAnnual: boolean) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelect }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const activePlans = await PlanService.getActivePlans();
      setPlans(activePlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      setError('Error al cargar los planes');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    if (onPlanSelect) {
      onPlanSelect(plan, billingCycle === 'annual');
    }
    
    // Abrir modal de checkout
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const getPriceDisplay = (plan: Plan) => {
    if (plan.price === 0) return 'Gratis';
    
    if (billingCycle === 'annual') {
      return plan.getAnnualPriceDisplay();
    }
    
    return plan.getPriceDisplay();
  };

  const getBillingText = (plan: Plan) => {
    if (plan.price === 0) return '';
    
    if (billingCycle === 'annual') {
      return '/mes, facturado anualmente';
    }
    
    return '/mes';
  };

  const getSavings = (plan: Plan) => {
    if (plan.price === 0 || billingCycle === 'monthly') return null;
    
    const monthlyPrice = plan.price;
    const annualPrice = plan.getAnnualPrice();
    const savings = monthlyPrice * 12 - annualPrice;
    
    return `Ahorra $${(savings / 100).toFixed(2)} al año`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadPlans} variant="outline">
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Elige el plan perfecto para ti
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Comienza gratis y actualiza cuando lo necesites
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensual
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Anual
              <Badge variant="secondary" className="ml-2">
                Ahorra 20%
              </Badge>
            </span>
          </div>

          {/* Métodos de Pago */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Tarjetas
            </div>
            <div className="flex items-center">
              <Banknote className="w-4 h-4 mr-2" />
              Transferencias
            </div>
            <div className="flex items-center">
              <Banknote className="w-4 h-4 mr-2" />
              Efectivo
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.isPopular 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:shadow-lg transition-shadow'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPriceDisplay(plan)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {getBillingText(plan)}
                  </span>
                </div>
                
                {getSavings(plan) && (
                  <p className="text-sm text-green-600 mb-4 font-medium">
                    {getSavings(plan)}
                  </p>
                )}
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">
                      {plan.features.monthlyFormLimit === -1 
                        ? 'Formularios ilimitados' 
                        : `${plan.features.monthlyFormLimit} formularios por mes`
                      }
                    </span>
                  </div>
                  
                  {plan.features.canExportData && (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm">Exportar datos</span>
                    </div>
                  )}
                  
                  {plan.features.canCustomizeBranding && (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm">Personalizar marca</span>
                    </div>
                  )}
                  
                  {plan.features.prioritySupport && (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm">Soporte prioritario</span>
                    </div>
                  )}
                  
                  {plan.features.advancedAnalytics && (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm">Analytics avanzados</span>
                    </div>
                  )}
                  
                  {plan.features.apiAccess && (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm">Acceso a API</span>
                    </div>
                  )}
                  
                  {/* Mostrar características no incluidas */}
                  {!plan.features.canExportData && (
                    <div className="flex items-center text-gray-400">
                      <X className="w-5 h-5 mr-3" />
                      <span className="text-sm">Exportar datos</span>
                    </div>
                  )}
                  
                  {!plan.features.canCustomizeBranding && (
                    <div className="flex items-center text-gray-400">
                      <X className="w-5 h-5 mr-3" />
                      <span className="text-sm">Personalizar marca</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${
                    plan.isPopular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  size="lg"
                >
                  {plan.price === 0 ? 'Comenzar gratis' : 'Seleccionar plan'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Preguntas frecuentes
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h4>
              <p className="text-gray-600">
                Sí, puedes cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Qué métodos de pago aceptan?
              </h4>
              <p className="text-gray-600">
                Aceptamos tarjetas de crédito/débito, transferencias bancarias, Rapipago y Pago Fácil.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Los formularios existentes se mantienen?
              </h4>
              <p className="text-gray-600">
                Sí, todos tus formularios y datos se mantienen intactos al cambiar o cancelar tu plan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Ofrecen reembolsos?
              </h4>
              <p className="text-gray-600">
                Ofrecemos reembolsos completos dentro de los primeros 30 días de tu suscripción.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      {selectedPlan && (
        <SubscriptionCheckoutModal
          plan={selectedPlan}
          isAnnual={billingCycle === 'annual'}
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setShowCheckoutModal(false);
            // Aquí podrías redirigir al dashboard o mostrar un mensaje de éxito
          }}
        />
      )}
    </section>
  );
}; 