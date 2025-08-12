'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { PlanService } from '@/application/services/plan-service';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';
import { Plan } from '@/domain/entities/plan';

interface SubscriptionManagementProps {
  userId: string;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ userId }) => {
  const [usageStats, setUsageStats] = useState<any>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas de uso
      const usage = await PlanService.getUserUsageStats(userId);
      setUsageStats(usage);
      
      // Verificar si necesita upgrade
      const upgrade = await PlanService.needsUpgrade(userId);
      setUpgradeInfo(upgrade);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Error al cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: Plan, annual: boolean) => {
    setSelectedPlan(plan);
    setIsAnnual(annual);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckoutModal(false);
    loadUserData(); // Recargar datos
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Settings className="w-5 h-5" />;
      case 'basic':
        return <CreditCard className="w-5 h-5" />;
      case 'pro':
        return <Crown className="w-5 h-5" />;
      case 'enterprise':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadUserData} variant="outline">
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                {getPlanIcon(upgradeInfo?.currentPlan || 'free')}
                <span className="ml-2">Tu Plan Actual</span>
              </CardTitle>
              <CardDescription>
                Gestiona tu suscripción y límites de uso
              </CardDescription>
            </div>
            <Badge className={getPlanColor(upgradeInfo?.currentPlan || 'free')}>
              {upgradeInfo?.currentPlan?.toUpperCase() || 'FREE'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Detalles del Plan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Próxima facturación:</span>
                  <span className="text-gray-900">15 de Enero, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="text-gray-900">Tarjeta Visa ****1234</span>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Uso del Mes</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Formularios creados</span>
                    <span className="text-gray-900">
                      {usageStats?.formsCreatedThisMonth || 0} / {usageStats?.monthlyFormLimit === -1 ? '∞' : usageStats?.monthlyFormLimit || 0}
                    </span>
                  </div>
                  <Progress 
                    value={usageStats?.percentage || 0} 
                    className="h-2"
                  />
                </div>
                
                {usageStats?.canCreateMore === false && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Has alcanzado el límite mensual
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Recommendation */}
      {upgradeInfo?.needsUpgrade && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Recomendación de Upgrade
            </CardTitle>
            <CardDescription className="text-amber-700">
              {upgradeInfo.reason}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-800 mb-2">
                  Te recomendamos actualizar a <strong>{upgradeInfo.recommendedPlan}</strong>
                </p>
                <p className="text-amber-700 text-sm">
                  Obtendrás más formularios y características adicionales
                </p>
              </div>
              <Button
                onClick={() => handleUpgrade({ id: upgradeInfo.recommendedPlan } as Plan, false)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Ver Plan {upgradeInfo.recommendedPlan}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones del Plan</CardTitle>
          <CardDescription>
            Gestiona tu suscripción y accede a más opciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => window.location.href = '/pricing'}
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <Crown className="w-5 h-5 mb-2" />
              <span className="font-semibold">Ver todos los planes</span>
              <span className="text-sm text-gray-600 mt-1">
                Compara características y precios
              </span>
            </Button>
            
            <Button
              onClick={() => window.open('https://ayuda.mercadopago.com', '_blank')}
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <CreditCard className="w-5 h-5 mb-2" />
              <span className="font-semibold">Gestionar pagos</span>
              <span className="text-sm text-gray-600 mt-1">
                Cambiar método de pago
              </span>
            </Button>
            
            <Button
              onClick={() => window.open('https://ayuda.mercadopago.com', '_blank')}
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <Calendar className="w-5 h-5 mb-2" />
              <span className="font-semibold">Historial de facturas</span>
              <span className="text-sm text-gray-600 mt-1">
                Ver transacciones anteriores
              </span>
            </Button>
            
            <Button
              onClick={() => window.open('https://ayuda.mercadopago.com', '_blank')}
              variant="outline"
              className="h-auto p-4 flex-col items-start"
            >
              <Settings className="w-5 h-5 mb-2" />
              <span className="font-semibold">Configuración</span>
              <span className="text-sm text-gray-600 mt-1">
                Preferencias de facturación
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Checkout Modal */}
      {selectedPlan && (
        <SubscriptionCheckoutModal
          plan={selectedPlan}
          isAnnual={isAnnual}
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}; 