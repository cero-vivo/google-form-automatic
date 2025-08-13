export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'use' | 'bonus';
  amount: number;
  date: Date;
  paymentId?: string;
  description?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserCredits {
  userId: string;
  credits: number;
  updatedAt: Date;
  history: CreditTransaction[];
}

export interface CreditPurchase {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  packSize?: string;
  discountPercent?: number;
}

export interface CreditUsage {
  formId?: string;
  formTitle?: string;
  amount: number;
}