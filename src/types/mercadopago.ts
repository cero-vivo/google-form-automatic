// Tipos para la integración con Mercado Pago

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  external_reference: string;
  expires: boolean;
  expiration_date_to: string;
  items: MercadoPagoItem[];
  back_urls: MercadoPagoBackUrls;
  auto_return: string;
  notification_url: string;
  statement_descriptor: string;
  binary_mode: boolean;
}

export interface MercadoPagoItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description: string;
}

export interface MercadoPagoBackUrls {
  success: string;
  failure: string;
  pending: string;
}

export interface MercadoPagoWebhook {
  type: string;
  data: {
    id: string;
  };
}

export interface MercadoPagoPayment {
  id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  transaction_amount: number;
  currency_id: string;
  date_created: string;
  date_last_updated: string;
}

export interface CreatePreferenceRequest {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  packSize?: number;
  discountPercent?: number;
}

export interface CreatePreferenceResponse {
  id: string;
  initPoint: string;
  sandboxInitPoint: string;
}

// Tipos para el sistema de créditos
export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  mercadopagoPaymentId?: string;
  userId: string;
}

export interface UserCredits {
  userId: string;
  currentCredits: number;
  totalCreditsPurchased: number;
  totalCreditsUsed: number;
  lastUpdated: Date;
}

export interface CreditPurchase {
  id: string;
  userId: string;
  amount: number;
  totalPrice: number;
  packSize?: number;
  discountPercent?: number;
  mercadopagoPreferenceId: string;
  mercadopagoPaymentId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
} 