import mercadopago from 'mercadopago';

// Configuración de Mercado Pago
export const mercadopagoConfig = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '',
  webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET || '',
  currency: 'USD', // Dólar Estadounidense
  country: 'US', // Estados Unidos
};

// Validar configuración de Mercado Pago
export function validateMercadoPagoConfig(): boolean {
  const requiredKeys = [
    'MERCADOPAGO_ACCESS_TOKEN',
    'NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY',
    'MERCADOPAGO_WEBHOOK_SECRET'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    console.warn(`⚠️ Missing Mercado Pago environment variables: ${missingKeys.join(', ')}`);
    return false;
  }

  return true;
}

// Configurar Mercado Pago
export function configureMercadoPago(): void {
  if (!mercadopagoConfig.accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured');
  }

  // Mercado Pago se configura automáticamente con la variable de entorno
  // MP_ACCESS_TOKEN o se puede configurar manualmente
  process.env.MP_ACCESS_TOKEN = mercadopagoConfig.accessToken;

  console.log('✅ Mercado Pago configured successfully');
}

// Configuración de productos y precios (IDs de Mercado Pago)
export const MERCADOPAGO_PRODUCTS = {
  BASIC: {
    name: 'Basic Plan',
    priceId: process.env.MERCADOPAGO_PRICE_ID_BASIC || 'price_basic_placeholder',
    monthlyPrice: 500, // $5.00 USD (en centavos)
    annualPrice: 4800, // $48.00 USD (con descuento del 20%)
  },
  PRO: {
    name: 'Pro Plan',
    priceId: process.env.MERCADOPAGO_PRICE_ID_PRO || 'price_pro_placeholder',
    monthlyPrice: 1500, // $15.00 USD (en centavos)
    annualPrice: 14400, // $144.00 USD (con descuento del 20%)
  },
  ENTERPRISE: {
    name: 'Enterprise Plan',
    priceId: process.env.MERCADOPAGO_PRICE_ID_ENTERPRISE || 'price_enterprise_placeholder',
    monthlyPrice: 2500, // $25.00 USD (en centavos)
    annualPrice: 24000, // $240.00 USD (con descuento del 20%)
  },
} as const;

// Mapeo de planes de Mercado Pago a planes de la aplicación
export const PLAN_MAPPING = {
  [MERCADOPAGO_PRODUCTS.BASIC.priceId]: 'basic',
  [MERCADOPAGO_PRODUCTS.PRO.priceId]: 'pro',
  [MERCADOPAGO_PRODUCTS.ENTERPRISE.priceId]: 'enterprise',
} as const;

// Configuración de webhooks
export const WEBHOOK_EVENTS = [
  'subscription_created',
  'subscription_updated',
  'subscription_deleted',
  'payment.created',
  'payment.updated',
  'payment.cancelled',
] as const;

// Configuración de métodos de pago (solo tarjetas)
export const PAYMENT_METHODS = [
  'credit_card',
  'debit_card',
] as const; 