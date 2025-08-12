import { UserId } from '../types';

export interface User {
  id: UserId;
  email: string;
  displayName: string;
  photoURL?: string;
  
  // Información de la cuenta
  emailVerified: boolean;
  phoneNumber?: string;
  
  // Configuraciones del usuario
  preferences: UserPreferences;
  
  // Metadatos de Google
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenExpiry?: Date;
  
  // Estadísticas
  totalForms: number;
  totalResponses: number;
  
  // Plan y subscripción
  plan: UserPlan;
  subscriptionId?: string;
  subscriptionExpiry?: Date;
  
  // Límites mensuales
  formsCreatedThisMonth: number;
  monthlyFormLimit: number;
  lastBillingCycleReset: Date;
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  autoSaveInterval: number; // en segundos
  defaultFormSettings: {
    allowAnonymous: boolean;
    showProgressBar: boolean;
    collectEmailAddresses: boolean;
  };
}

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export class UserEntity implements User {
  constructor(
    public id: UserId,
    public email: string,
    public displayName: string,
    public emailVerified: boolean = false,
    public photoURL?: string,
    public phoneNumber?: string,
    public preferences: UserPreferences = {
      language: 'es',
      timezone: 'America/Mexico_City',
      theme: 'system',
      emailNotifications: true,
      autoSaveInterval: 30,
      defaultFormSettings: {
        allowAnonymous: true,
        showProgressBar: true,
        collectEmailAddresses: false
      }
    },
    public plan: UserPlan = UserPlan.FREE,
    public totalForms: number = 0,
    public totalResponses: number = 0,
    public googleAccessToken?: string,
    public googleRefreshToken?: string,
    public googleTokenExpiry?: Date,
    public subscriptionId?: string,
    public subscriptionExpiry?: Date,
    public formsCreatedThisMonth: number = 0,
    public monthlyFormLimit: number = 5,
    public lastBillingCycleReset: Date = new Date(),
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public lastLoginAt?: Date
  ) {}

  // Métodos de dominio
  updateDisplayName(newDisplayName: string): void {
    if (!newDisplayName.trim()) {
      throw new Error('El nombre no puede estar vacío');
    }
    this.displayName = newDisplayName.trim();
    this.updatedAt = new Date();
  }

  updateEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Email inválido');
    }
    this.email = newEmail.toLowerCase().trim();
    this.emailVerified = false; // Requerir verificación del nuevo email
    this.updatedAt = new Date();
  }

  verifyEmail(): void {
    this.emailVerified = true;
    this.updatedAt = new Date();
  }

  updatePhoneNumber(phoneNumber?: string): void {
    this.phoneNumber = phoneNumber?.trim() || undefined;
    this.updatedAt = new Date();
  }

  updatePhotoURL(photoURL?: string): void {
    this.photoURL = photoURL?.trim() || undefined;
    this.updatedAt = new Date();
  }

  // Métodos de preferencias
  updatePreferences(newPreferences: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.updatedAt = new Date();
  }

  updateLanguage(language: string): void {
    this.preferences.language = language;
    this.updatedAt = new Date();
  }

  updateTimezone(timezone: string): void {
    this.preferences.timezone = timezone;
    this.updatedAt = new Date();
  }

  updateTheme(theme: 'light' | 'dark' | 'system'): void {
    this.preferences.theme = theme;
    this.updatedAt = new Date();
  }

  // Métodos de Google OAuth
  updateGoogleTokens(accessToken: string, refreshToken?: string, expiryDate?: Date): void {
    this.googleAccessToken = accessToken;
    if (refreshToken) {
      this.googleRefreshToken = refreshToken;
    }
    this.googleTokenExpiry = expiryDate;
    this.updatedAt = new Date();
  }

  clearGoogleTokens(): void {
    this.googleAccessToken = undefined;
    this.googleRefreshToken = undefined;
    this.googleTokenExpiry = undefined;
    this.updatedAt = new Date();
  }

  isGoogleTokenValid(): boolean {
    if (!this.googleAccessToken || !this.googleTokenExpiry) {
      return false;
    }
    return this.googleTokenExpiry > new Date();
  }

  needsGoogleTokenRefresh(): boolean {
    if (!this.googleTokenExpiry) return true;
    // Considera que necesita refresh si expira en los próximos 5 minutos
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return this.googleTokenExpiry <= fiveMinutesFromNow;
  }

  // Métodos de plan y subscripción
  upgradePlan(newPlan: UserPlan, subscriptionId?: string, subscriptionExpiry?: Date): void {
    this.plan = newPlan;
    this.subscriptionId = subscriptionId;
    this.subscriptionExpiry = subscriptionExpiry;
    this.updatedAt = new Date();
  }

  downgradeToFree(): void {
    this.plan = UserPlan.FREE;
    this.subscriptionId = undefined;
    this.subscriptionExpiry = undefined;
    this.updatedAt = new Date();
  }

  isPremiumUser(): boolean {
    return this.plan === UserPlan.PRO || this.plan === UserPlan.ENTERPRISE;
  }

  isSubscriptionActive(): boolean {
    if (!this.subscriptionExpiry || this.plan === UserPlan.FREE) {
      return this.plan === UserPlan.FREE;
    }
    return this.subscriptionExpiry > new Date();
  }

  // Métodos de estadísticas
  incrementFormCount(): void {
    this.totalForms += 1;
    this.updatedAt = new Date();
  }

  decrementFormCount(): void {
    if (this.totalForms > 0) {
      this.totalForms -= 1;
      this.updatedAt = new Date();
    }
  }

  incrementResponseCount(): void {
    this.totalResponses += 1;
    this.updatedAt = new Date();
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  // Límites según el plan
  getMaxForms(): number {
    switch (this.plan) {
      case UserPlan.FREE:
        return 5;
      case UserPlan.PRO:
        return 100;
      case UserPlan.ENTERPRISE:
        return -1; // Ilimitado
      default:
        return 5;
    }
  }

  // Métodos para límites mensuales
  canCreateMoreFormsThisMonth(): boolean {
    return this.monthlyFormLimit === -1 || this.formsCreatedThisMonth < this.monthlyFormLimit;
  }

  incrementMonthlyFormCount(): void {
    this.formsCreatedThisMonth += 1;
    this.updatedAt = new Date();
  }

  resetMonthlyFormCount(): void {
    this.formsCreatedThisMonth = 0;
    this.lastBillingCycleReset = new Date();
    this.updatedAt = new Date();
  }

  updateMonthlyFormLimit(newLimit: number): void {
    this.monthlyFormLimit = newLimit;
    this.updatedAt = new Date();
  }

  getMonthlyFormUsage(): { used: number; limit: number; percentage: number } {
    if (this.monthlyFormLimit === -1) {
      return { used: this.formsCreatedThisMonth, limit: -1, percentage: 0 };
    }
    
    const percentage = Math.round((this.formsCreatedThisMonth / this.monthlyFormLimit) * 100);
    return {
      used: this.formsCreatedThisMonth,
      limit: this.monthlyFormLimit,
      percentage: Math.min(percentage, 100)
    };
  }

  getMaxQuestionsPerForm(): number {
    switch (this.plan) {
      case UserPlan.FREE:
        return 20;
      case UserPlan.PRO:
        return 100;
      case UserPlan.ENTERPRISE:
        return -1; // Ilimitado
      default:
        return 20;
    }
  }

  getMaxResponsesPerForm(): number {
    switch (this.plan) {
      case UserPlan.FREE:
        return 100;
      case UserPlan.PRO:
        return 10000;
      case UserPlan.ENTERPRISE:
        return -1; // Ilimitado
      default:
        return 100;
    }
  }

  canCreateMoreForms(): boolean {
    const maxForms = this.getMaxForms();
    return maxForms === -1 || this.totalForms < maxForms;
  }

  // Validaciones de dominio
  validate(): string[] {
    const errors: string[] = [];

    if (!this.email.trim()) {
      errors.push('El email es requerido');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('El email no es válido');
    }

    if (!this.displayName.trim()) {
      errors.push('El nombre es requerido');
    }

    return errors;
  }

  isValid(): boolean {
    return this.validate().length === 0;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Métodos para serialización
  toJSON(): User {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      emailVerified: this.emailVerified,
      phoneNumber: this.phoneNumber,
      preferences: this.preferences,
      googleAccessToken: this.googleAccessToken,
      googleRefreshToken: this.googleRefreshToken,
      googleTokenExpiry: this.googleTokenExpiry,
      totalForms: this.totalForms,
      totalResponses: this.totalResponses,
      plan: this.plan,
      subscriptionId: this.subscriptionId,
      subscriptionExpiry: this.subscriptionExpiry,
      formsCreatedThisMonth: this.formsCreatedThisMonth,
      monthlyFormLimit: this.monthlyFormLimit,
      lastBillingCycleReset: this.lastBillingCycleReset,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt
    };
  }

  // Método para serialización sin datos sensibles
  toSafeJSON(): Omit<User, 'googleAccessToken' | 'googleRefreshToken'> {
    const { googleAccessToken, googleRefreshToken, ...safeData } = this.toJSON();
    return safeData;
  }

  static fromJSON(data: User): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.displayName,
      data.emailVerified,
      data.photoURL,
      data.phoneNumber,
      data.preferences,
      data.plan,
      data.totalForms,
      data.totalResponses,
      data.googleAccessToken,
      data.googleRefreshToken,
      data.googleTokenExpiry ? new Date(data.googleTokenExpiry) : undefined,
      data.subscriptionId,
      data.subscriptionExpiry ? new Date(data.subscriptionExpiry) : undefined,
      data.formsCreatedThisMonth,
      data.monthlyFormLimit,
      new Date(data.lastBillingCycleReset),
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.lastLoginAt ? new Date(data.lastLoginAt) : undefined
    );
  }
} 