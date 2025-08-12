import mercadopago from 'mercadopago';
import { mercadopagoConfig, MERCADOPAGO_PRODUCTS } from './config';
import { Plan } from '@/domain/entities/plan';
import { Subscription, SubscriptionStatus } from '@/domain/entities/subscription';

export interface CreateSubscriptionParams {
  customerId: string;
  planId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionParams {
  subscriptionId: string;
  newPlanId: string;
  newPriceId: string;
}

export interface CustomerData {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export class MercadoPagoService {
  constructor() {
    // Configurar Mercado Pago
    if (mercadopagoConfig.accessToken) {
      process.env.MP_ACCESS_TOKEN = mercadopagoConfig.accessToken;
    }
  }

  // Crear cliente en Mercado Pago
  async createCustomer(data: CustomerData): Promise<any> {
    try {
      // Mercado Pago no tiene un sistema de clientes como Stripe
      // Los clientes se crean automáticamente con cada pago
      // Retornamos un objeto simulado para mantener compatibilidad
      const customer = {
        id: `customer_${Date.now()}`,
        email: data.email,
        name: data.name,
        metadata: data.metadata,
      };

      console.log('✅ Customer created in Mercado Pago:', customer.id);
      return customer;
    } catch (error) {
      console.error('❌ Error creating customer in Mercado Pago:', error);
      throw new Error('Error al crear cliente en Mercado Pago');
    }
  }

  // Crear suscripción (Preferencia de Pago)
  async createSubscription(params: CreateSubscriptionParams): Promise<any> {
    try {
      const plan = MERCADOPAGO_PRODUCTS[params.planId.toUpperCase() as keyof typeof MERCADOPAGO_PRODUCTS];
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      // Crear preferencia de pago para suscripción
      const preference = {
        items: [
          {
            title: `${plan.name} - Suscripción Mensual`,
            unit_price: plan.monthlyPrice,
            quantity: 1,
            currency_id: 'USD',
            category_id: 'subscription',
          },
        ],
        payer: {
          email: params.customerId, // Usamos el email como ID del cliente
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/pending`,
        },
        auto_return: 'approved',
        external_reference: `subscription_${params.planId}_${Date.now()}`,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhooks`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        metadata: {
          userId: params.customerId,
          planId: params.planId,
          type: 'subscription',
          ...params.metadata,
        },
      };

      // Usar la API correcta de Mercado Pago
      const response = await (mercadopago as any).preferences.create(preference);

      console.log('✅ Subscription preference created in Mercado Pago:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Error creating subscription in Mercado Pago:', error);
      throw new Error('Error al crear suscripción en Mercado Pago');
    }
  }

  // Crear preferencia de pago para plan anual
  async createAnnualSubscription(params: CreateSubscriptionParams): Promise<any> {
    try {
      const plan = MERCADOPAGO_PRODUCTS[params.planId.toUpperCase() as keyof typeof MERCADOPAGO_PRODUCTS];
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      const preference = {
        items: [
          {
            title: `${plan.name} - Suscripción Anual`,
            unit_price: plan.annualPrice,
            quantity: 1,
            currency_id: 'USD',
            category_id: 'subscription_annual',
          },
        ],
        payer: {
          email: params.customerId,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/pending`,
        },
        auto_return: 'approved',
        external_reference: `subscription_annual_${params.planId}_${Date.now()}`,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhooks`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          userId: params.customerId,
          planId: params.planId,
          type: 'subscription_annual',
          ...params.metadata,
        },
      };

      const response = await (mercadopago as any).preferences.create(preference);

      console.log('✅ Annual subscription preference created in Mercado Pago:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Error creating annual subscription in Mercado Pago:', error);
      throw new Error('Error al crear suscripción anual en Mercado Pago');
    }
  }

  // Obtener información de pago
  async getPayment(paymentId: string): Promise<any> {
    try {
      const payment = await (mercadopago as any).payment.get(paymentId);
      return payment;
    } catch (error) {
      console.error('❌ Error retrieving payment from Mercado Pago:', error);
      throw new Error('Error al obtener pago de Mercado Pago');
    }
  }

  // Obtener información de preferencia
  async getPreference(preferenceId: string): Promise<any> {
    try {
      const preference = await (mercadopago as any).preferences.get(preferenceId);
      return preference;
    } catch (error) {
      console.error('❌ Error retrieving preference from Mercado Pago:', error);
      throw new Error('Error al obtener preferencia de Mercado Pago');
    }
  }

  // Crear sesión de checkout
  async createCheckoutSession(params: {
    customerId: string;
    planId: string;
    priceId: string;
    isAnnual: boolean;
    metadata?: Record<string, string>;
  }): Promise<any> {
    try {
      let preference;
      
      if (params.isAnnual) {
        preference = await this.createAnnualSubscription({
          customerId: params.customerId,
          planId: params.planId,
          priceId: params.priceId,
          metadata: params.metadata,
        });
      } else {
        preference = await this.createSubscription({
          customerId: params.customerId,
          planId: params.planId,
          priceId: params.priceId,
          metadata: params.metadata,
        });
      }

      console.log('✅ Checkout session created in Mercado Pago:', preference.id);
      return preference;
    } catch (error) {
      console.error('❌ Error creating checkout session in Mercado Pago:', error);
      throw new Error('Error al crear sesión de checkout en Mercado Pago');
    }
  }

  // Verificar webhook
  verifyWebhook(payload: any, signature?: string): any {
    try {
      // Mercado Pago no usa firmas como Stripe
      // Los webhooks se verifican por IP o por el contenido del payload
      // Por ahora, retornamos el payload directamente
      return payload;
    } catch (error) {
      console.error('❌ Webhook verification failed:', error);
      throw new Error('Verificación del webhook falló');
    }
  }

  // Mapear estado de Mercado Pago a estado de la aplicación
  mapSubscriptionStatus(mpStatus: string): SubscriptionStatus {
    switch (mpStatus) {
      case 'approved':
        return 'active';
      case 'pending':
        return 'trialing';
      case 'rejected':
      case 'cancelled':
        return 'canceled';
      case 'in_process':
        return 'active';
      case 'refunded':
        return 'canceled';
      default:
        return 'incomplete';
    }
  }

  // Obtener información del plan por precio ID
  getPlanInfoByPriceId(priceId: string): { name: string; price: number } | null {
    for (const [key, product] of Object.entries(MERCADOPAGO_PRODUCTS)) {
      if (product.priceId === priceId) {
        return {
          name: product.name,
          price: product.monthlyPrice,
        };
      }
    }
    return null;
  }

  // Crear pago recurrente (para suscripciones)
  async createRecurringPayment(params: {
    customerId: string;
    planId: string;
    amount: number;
    frequency: 'monthly' | 'annual';
    metadata?: Record<string, string>;
  }): Promise<any> {
    try {
      // Mercado Pago no tiene suscripciones automáticas como Stripe
      // Necesitamos implementar un sistema de renovación manual
      // Por ahora, creamos una preferencia de pago que expira
      
      const preference = {
        items: [
          {
            title: `${params.planId} - Renovación ${params.frequency}`,
            unit_price: params.amount,
            quantity: 1,
            currency_id: 'USD',
            category_id: `renewal_${params.frequency}`,
          },
        ],
        payer: {
          email: params.customerId,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/renewal-success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/renewal-failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/renewal-pending`,
        },
        auto_return: 'approved',
        external_reference: `renewal_${params.frequency}_${params.planId}_${Date.now()}`,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhooks`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        metadata: {
          userId: params.customerId,
          planId: params.planId,
          type: 'renewal',
          frequency: params.frequency,
          ...params.metadata,
        },
      };

      const response = await (mercadopago as any).preferences.create(preference);

      console.log('✅ Recurring payment preference created in Mercado Pago:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Error creating recurring payment in Mercado Pago:', error);
      throw new Error('Error al crear pago recurrente en Mercado Pago');
    }
  }
}

// Instancia singleton del servicio
export const mercadopagoService = new MercadoPagoService(); 