import { Plan, PlanFeatures } from '@/domain/entities/plan';
import { UserEntity, UserPlan } from '@/domain/entities/user';
import { doc, getDoc, getDocs, collection, query, where, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/infrastructure/firebase/config';

export class PlanService {
  // Planes predefinidos
  private static readonly DEFAULT_PLANS: Plan[] = [
    new Plan(
      'free',
      'Free',
      'Plan gratuito para empezar',
      0,
      'price_free',
      {
        monthlyFormLimit: 5,
        canExportData: false,
        canCustomizeBranding: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
      },
      false,
      true
    ),
    new Plan(
      'basic',
      'Basic',
      'Plan básico para usuarios regulares',
      999, // $9.99
      'price_basic',
      {
        monthlyFormLimit: 25,
        canExportData: true,
        canCustomizeBranding: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
      },
      false,
      true
    ),
    new Plan(
      'pro',
      'Pro',
      'Plan profesional para equipos',
      1999, // $19.99
      'price_pro',
      {
        monthlyFormLimit: 100,
        canExportData: true,
        canCustomizeBranding: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: false,
      },
      true, // Popular
      true
    ),
    new Plan(
      'enterprise',
      'Enterprise',
      'Plan empresarial sin límites',
      4999, // $49.99
      'price_enterprise',
      {
        monthlyFormLimit: -1, // Ilimitado
        canExportData: true,
        canCustomizeBranding: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
      },
      false,
      true
    ),
  ];

  // Helper method to convert Firestore DocumentData to User
  private static documentDataToUser(docId: string, data: any): UserEntity {
    return UserEntity.fromJSON({
      id: docId,
      email: data.email || '',
      displayName: data.displayName || '',
      emailVerified: data.emailVerified || false,
      photoURL: data.photoURL,
      phoneNumber: data.phoneNumber,
      preferences: data.preferences || {
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
      plan: data.plan || UserPlan.FREE,
      totalForms: data.totalForms || 0,
      totalResponses: data.totalResponses || 0,
      googleAccessToken: data.googleAccessToken,
      googleRefreshToken: data.googleRefreshToken,
      googleTokenExpiry: data.googleTokenExpiry ? new Date(data.googleTokenExpiry) : undefined,
      subscriptionId: data.subscriptionId,
      subscriptionExpiry: data.subscriptionExpiry ? new Date(data.subscriptionExpiry) : undefined,
      formsCreatedThisMonth: data.formsCreatedThisMonth || 0,
      monthlyFormLimit: data.monthlyFormLimit || 5,
      lastBillingCycleReset: data.lastBillingCycleReset ? new Date(data.lastBillingCycleReset) : new Date(),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined
    });
  }

  // Obtener todos los planes activos
  static async getActivePlans(): Promise<Plan[]> {
    try {
      // Por ahora retornamos los planes predefinidos
      // En el futuro esto podría venir de Firestore
      return this.DEFAULT_PLANS.filter(plan => plan.isActive);
    } catch (error) {
      console.error('❌ Error getting active plans:', error);
      throw new Error('Error al obtener planes activos');
    }
  }

  // Obtener plan por ID
  static async getPlan(planId: string): Promise<Plan | null> {
    try {
      const plans = await this.getActivePlans();
      return plans.find(plan => plan.id === planId) || null;
    } catch (error) {
      console.error('❌ Error getting plan by ID:', error);
      throw new Error('Error al obtener plan por ID');
    }
  }

  // Obtener plan por precio de Stripe
  static async getPlanByStripePrice(stripePriceId: string): Promise<Plan | null> {
    try {
      const plans = await this.getActivePlans();
      return plans.find(plan => plan.stripePriceId === stripePriceId) || null;
    } catch (error) {
      console.error('❌ Error getting plan by Stripe price:', error);
      throw new Error('Error al obtener plan por precio de Stripe');
    }
  }

  // Verificar si usuario puede crear formulario
  static async canCreateForm(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      
      if (!userDoc.exists()) {
        return false;
      }

      const userData = userDoc.data();
      const user = this.documentDataToUser(userDoc.id, userData);
      
      return user.canCreateMoreFormsThisMonth();
    } catch (error) {
      console.error('❌ Error checking if user can create form:', error);
      return false;
    }
  }

  // Incrementar contador de formularios del usuario
  static async incrementFormCount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      
      await updateDoc(userRef, {
        formsCreatedThisMonth: increment(1),
        updatedAt: new Date(),
      });

      console.log('✅ Form count incremented for user:', userId);
    } catch (error) {
      console.error('❌ Error incrementing form count:', error);
      throw new Error('Error al incrementar contador de formularios');
    }
  }

  // Resetear contadores mensuales (llamado por cron job o webhook)
  static async resetMonthlyCounters(): Promise<void> {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const usersSnapshot = await getDocs(usersRef);
      
      const batch = writeBatch(db);
      const now = new Date();
      
      usersSnapshot.forEach((userDoc) => {
        const userRef = doc(db, COLLECTIONS.USERS, userDoc.id);
        batch.update(userRef, {
          formsCreatedThisMonth: 0,
          lastBillingCycleReset: now,
          updatedAt: now,
        });
      });
      
      await batch.commit();
      console.log('✅ Monthly counters reset for all users');
    } catch (error) {
      console.error('❌ Error resetting monthly counters:', error);
      throw new Error('Error al resetear contadores mensuales');
    }
  }

  // Actualizar límite mensual del usuario según su plan
  static async updateUserMonthlyLimit(userId: string, planId: string): Promise<void> {
    try {
      const plan = await this.getPlan(planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      
      await updateDoc(userRef, {
        monthlyFormLimit: plan.features.monthlyFormLimit,
        updatedAt: new Date(),
      });

      console.log('✅ Monthly limit updated for user:', userId, 'to:', plan.features.monthlyFormLimit);
    } catch (error) {
      console.error('❌ Error updating user monthly limit:', error);
      throw new Error('Error al actualizar límite mensual del usuario');
    }
  }

  // Obtener estadísticas de uso del usuario
  static async getUserUsageStats(userId: string): Promise<{
    formsCreatedThisMonth: number;
    monthlyFormLimit: number;
    percentage: number;
    canCreateMore: boolean;
  }> {
    try {
      // Si no hay userId, retornar valores por defecto
      if (!userId) {
        return {
          formsCreatedThisMonth: 0,
          monthlyFormLimit: 5,
          percentage: 0,
          canCreateMore: true,
        };
      }

      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      
      if (!userDoc.exists()) {
        // Si el usuario no existe, retornar valores por defecto
        return {
          formsCreatedThisMonth: 0,
          monthlyFormLimit: 5,
          percentage: 0,
          canCreateMore: true,
        };
      }

      const userData = userDoc.data();
      const user = this.documentDataToUser(userDoc.id, userData);
      
      const usage = user.getMonthlyFormUsage();
      
      return {
        formsCreatedThisMonth: usage.used,
        monthlyFormLimit: usage.limit,
        percentage: usage.percentage,
        canCreateMore: user.canCreateMoreFormsThisMonth(),
      };
    } catch (error) {
      console.error('❌ Error getting user usage stats:', error);
      // En caso de error, retornar valores por defecto
      return {
        formsCreatedThisMonth: 0,
        monthlyFormLimit: 5,
        percentage: 0,
        canCreateMore: true,
      };
    }
  }

  // Verificar si usuario necesita upgrade
  static async needsUpgrade(userId: string): Promise<{
    needsUpgrade: boolean;
    currentPlan: string;
    recommendedPlan: string;
    reason: string;
  }> {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      
      if (!userDoc.exists()) {
        return {
          needsUpgrade: false,
          currentPlan: 'free',
          recommendedPlan: 'free',
          reason: 'Usuario no encontrado',
        };
      }

      const userData = userDoc.data();
      const user = this.documentDataToUser(userDoc.id, userData);
      
      // Si ya es enterprise, no necesita upgrade
      if (user.plan === UserPlan.ENTERPRISE) {
        return {
          needsUpgrade: false,
          currentPlan: user.plan,
          recommendedPlan: user.plan,
          reason: 'Ya tienes el plan más alto',
        };
      }

      const usage = user.getMonthlyFormUsage();
      
      // Si está usando más del 80% de su límite, recomendar upgrade
      if (usage.percentage >= 80) {
        let recommendedPlan = 'basic';
        
        if (user.plan === UserPlan.FREE) {
          recommendedPlan = 'basic';
        } else if (user.plan === UserPlan.PRO) {
          recommendedPlan = 'enterprise';
        }

        return {
          needsUpgrade: true,
          currentPlan: user.plan,
          recommendedPlan,
          reason: `Estás usando el ${usage.percentage}% de tu límite mensual`,
        };
      }

      return {
        needsUpgrade: false,
        currentPlan: user.plan,
        recommendedPlan: user.plan,
        reason: 'No necesitas upgrade por ahora',
      };
    } catch (error) {
      console.error('❌ Error checking if user needs upgrade:', error);
      return {
        needsUpgrade: false,
        currentPlan: 'free',
        recommendedPlan: 'free',
        reason: 'Error al verificar necesidad de upgrade',
      };
    }
  }
} 