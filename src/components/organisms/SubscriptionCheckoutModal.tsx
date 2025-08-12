'use client';

import React, { useState } from 'react';
import { Plan } from '@/domain/entities/plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Banknote, X, Loader2 } from 'lucide-react';
import { mercadopagoService } from '@/infrastructure/mercadopago/mercadopago-service';

interface SubscriptionCheckoutModalProps {
  plan: Plan;
  isAnnual: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  plan,
  isAnnual,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Crear sesión de checkout en Mercado Pago
      const checkoutSession = await mercadopagoService.createCheckoutSession({
        customerId: 'user@example.com', // Esto debería venir del usuario autenticado
        planId: plan.id,
        priceId: plan.stripePriceId,
        isAnnual,
        metadata: {
          source: 'web_checkout',
          planId: plan.id,
          billingCycle: isAnnual ? 'annual' : 'monthly',
        },
      });

      setCheckoutUrl(checkoutSession.init_point);
      
      // Redirigir al usuario al checkout de Mercado Pago
      if (checkoutSession.init_point) {
        window.location.href = checkoutSession.init_point;
      }

    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      setError('Error al crear la sesión de checkout. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = () => {
    if (plan.price === 0) return 'Gratis';
    
    if (isAnnual) {
      return plan.getAnnualPriceDisplay();
    }
    
    return plan.getPriceDisplay();
  };

  const getBillingText = () => {
    if (plan.price === 0) return '';
    
    if (isAnnual) {
      return '/mes, facturado anualmente';
    }
    
    return '/mes';
  };

  const getSavings = () => {
    if (plan.price === 0 || !isAnnual) return null;
    
    const monthlyPrice = plan.price;
    const annualPrice = plan.getAnnualPrice();
    const savings = monthlyPrice * 12 - annualPrice;
    
    return `Ahorra $${(savings / 100).toFixed(2)} al año`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmar Suscripción
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Summary */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {getPriceDisplay()}
                </span>
                <span className="text-gray-500 ml-1">
                  {getBillingText()}
                </span>
              </div>
              
              {getSavings() && (
                <div className="text-center">
                  <Badge variant="secondary" className="text-green-600 bg-green-100">
                    {getSavings()}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Características incluidas:</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm">
                  {plan.features.monthlyFormLimit === -1 
                    ? 'Formularios ilimitados' 
                    : `${plan.features.monthlyFormLimit} formularios por mes`
                  }
                </span>
              </div>
              
              {plan.features.canExportData && (
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Exportar datos</span>
                </div>
              )}
              
              {plan.features.canCustomizeBranding && (
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Personalizar marca</span>
                </div>
              )}
              
              {plan.features.prioritySupport && (
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Soporte prioritario</span>
                </div>
              )}
              
              {plan.features.advancedAnalytics && (
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Analytics avanzados</span>
                </div>
              )}
              
              {plan.features.apiAccess && (
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Acceso a API</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Métodos de pago aceptados:</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                `Continuar con ${plan.name}`
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Al continuar, aceptas nuestros{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              términos de servicio
            </a>{' '}
            y{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}; 