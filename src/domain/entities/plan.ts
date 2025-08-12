export interface PlanFeatures {
  monthlyFormLimit: number;
  canExportData: boolean;
  canCustomizeBranding: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  apiAccess: boolean;
}

export class Plan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number, // Precio mensual en centavos
    public readonly stripePriceId: string,
    public readonly features: PlanFeatures,
    public readonly isPopular: boolean = false,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Método para obtener el precio en formato legible
  getPriceDisplay(): string {
    return `$${(this.price / 100).toFixed(2)}`;
  }

  // Método para obtener el precio anual (con descuento del 20%)
  getAnnualPrice(): number {
    return Math.round(this.price * 12 * 0.8); // 20% descuento anual
  }

  getAnnualPriceDisplay(): string {
    return `$${(this.getAnnualPrice() / 100).toFixed(2)}`;
  }

  // Método para verificar si el plan tiene una característica específica
  hasFeature(feature: keyof PlanFeatures): boolean {
    return Boolean(this.features[feature]);
  }

  // Método para convertir a objeto seguro para almacenar
  toSafeJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stripePriceId: this.stripePriceId,
      features: this.features,
      isPopular: this.isPopular,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Método estático para crear plan desde datos
  static fromData(data: any): Plan {
    return new Plan(
      data.id,
      data.name,
      data.description,
      data.price,
      data.stripePriceId,
      data.features,
      data.isPopular || false,
      data.isActive !== false,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
} 