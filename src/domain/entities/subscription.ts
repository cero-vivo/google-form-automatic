export type SubscriptionStatus = 
  | 'active' 
  | 'canceled' 
  | 'past_due' 
  | 'unpaid' 
  | 'trialing' 
  | 'incomplete' 
  | 'incomplete_expired';

export class Subscription {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly planId: string,
    public readonly stripeSubscriptionId: string,
    public readonly stripeCustomerId: string,
    public readonly status: SubscriptionStatus,
    public readonly currentPeriodStart: Date,
    public readonly currentPeriodEnd: Date,
    public readonly cancelAtPeriodEnd: boolean = false,
    public readonly trialStart?: Date,
    public readonly trialEnd?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Verificar si la suscripción está activa
  isActive(): boolean {
    return ['active', 'trialing'].includes(this.status);
  }

  // Verificar si está en período de prueba
  isTrialing(): boolean {
    return this.status === 'trialing' && this.trialEnd ? this.trialEnd > new Date() : false;
  }

  // Verificar si la suscripción está cancelada
  isCanceled(): boolean {
    return this.status === 'canceled' || this.cancelAtPeriodEnd;
  }

  // Obtener fecha de expiración
  getExpirationDate(): Date {
    if (this.isTrialing() && this.trialEnd) {
      return this.trialEnd;
    }
    return this.currentPeriodEnd;
  }

  // Verificar si la suscripción expira pronto (en los próximos 7 días)
  expiresSoon(): boolean {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return this.getExpirationDate() <= sevenDaysFromNow;
  }

  // Días restantes hasta la expiración
  getDaysUntilExpiration(): number {
    const now = new Date();
    const expiration = this.getExpirationDate();
    const diffTime = expiration.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Convertir a objeto seguro para almacenar
  toSafeJSON() {
    return {
      id: this.id,
      userId: this.userId,
      planId: this.planId,
      stripeSubscriptionId: this.stripeSubscriptionId,
      stripeCustomerId: this.stripeCustomerId,
      status: this.status,
      currentPeriodStart: this.currentPeriodStart,
      currentPeriodEnd: this.currentPeriodEnd,
      cancelAtPeriodEnd: this.cancelAtPeriodEnd,
      trialStart: this.trialStart,
      trialEnd: this.trialEnd,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Método estático para crear suscripción desde datos
  static fromData(data: any): Subscription {
    return new Subscription(
      data.id,
      data.userId,
      data.planId,
      data.stripeSubscriptionId,
      data.stripeCustomerId,
      data.status,
      new Date(data.currentPeriodStart),
      new Date(data.currentPeriodEnd),
      data.cancelAtPeriodEnd || false,
      data.trialStart ? new Date(data.trialStart) : undefined,
      data.trialEnd ? new Date(data.trialEnd) : undefined,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
} 