import { Subscription, SubscriptionStatus } from '@/domain/entities/subscription';
import { Plan } from '@/domain/entities/plan';
import { UserEntity, UserPlan } from '@/domain/entities/user';
import { mercadopagoService } from '@/infrastructure/mercadopago/mercadopago-service';
import { PlanService } from './plan-service';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/infrastructure/firebase/config';

export interface CreateSubscriptionParams {
  userId: string;
  planId: string;
  stripePriceId: string;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionParams {
  subscriptionId: string;
  newPlanId: string;
  newStripePriceId: string;
}

export class SubscriptionService {
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

  // Crear nueva suscripción
  static async createSubscription(params: CreateSubscriptionParams): Promise<Subscription> {
    try {
      // Obtener información del usuario
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, params.userId));
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      const user = this.documentDataToUser(userDoc.id, userData);

      // Obtener o crear cliente en Mercado Pago
      let mercadopagoCustomer = await mercadopagoService.createCustomer({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: params.userId,
          ...params.metadata,
        },
      });

      // Crear suscripción en Mercado Pago
      const mercadopagoSubscription = await mercadopagoService.createSubscription({
        customerId: params.userId,
        planId: params.planId,
        priceId: params.stripePriceId,
        metadata: {
          userId: params.userId,
          planId: params.planId,
          ...params.metadata,
        },
      });

      // Crear suscripción en Firestore
      const subscription = new Subscription(
        mercadopagoSubscription.id,
        params.userId,
        params.planId,
        mercadopagoSubscription.id,
        mercadopagoCustomer.id,
        mercadopagoService.mapSubscriptionStatus(mercadopagoSubscription.status || 'pending'),
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        false,
        undefined,
        undefined
      );

      await setDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, subscription.id), subscription.toSafeJSON());

      // Actualizar usuario con información de suscripción
      await updateDoc(doc(db, COLLECTIONS.USERS, params.userId), {
        subscriptionId: subscription.id,
        plan: params.planId,
        updatedAt: new Date(),
      });

      // Actualizar límite mensual del usuario
      await PlanService.updateUserMonthlyLimit(params.userId, params.planId);

      console.log('✅ Subscription created successfully:', subscription.id);
      return subscription;
    } catch (error) {
      console.error('❌ Error creating subscription:', error);
      throw new Error('Error al crear suscripción');
    }
  }

  // Obtener suscripción por ID
  static async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const subscriptionDoc = await getDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, subscriptionId));
      
      if (!subscriptionDoc.exists()) {
        return null;
      }

      const subscriptionData = subscriptionDoc.data();
      return Subscription.fromData(subscriptionData);
    } catch (error) {
      console.error('❌ Error getting subscription:', error);
      throw new Error('Error al obtener suscripción');
    }
  }

  // Obtener suscripción activa del usuario
  static async getUserActiveSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscriptionsRef = collection(db, COLLECTIONS.SUBSCRIPTIONS);
      const q = query(
        subscriptionsRef,
        where('userId', '==', userId),
        where('status', 'in', ['active', 'trialing'])
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      // Debería haber solo una suscripción activa por usuario
      const subscriptionData = snapshot.docs[0].data();
      return Subscription.fromData(subscriptionData);
    } catch (error) {
      console.error('❌ Error getting user active subscription:', error);
      throw new Error('Error al obtener suscripción activa del usuario');
    }
  }

  // Actualizar suscripción (cambiar plan)
  static async updateSubscription(params: UpdateSubscriptionParams): Promise<Subscription> {
    try {
      // Obtener suscripción actual
      const currentSubscription = await this.getSubscription(params.subscriptionId);
      if (!currentSubscription) {
        throw new Error('Suscripción no encontrada');
      }

      // Actualizar en Mercado Pago (crear nueva preferencia)
      const updatedMercadopagoSubscription = await mercadopagoService.createSubscription({
        customerId: currentSubscription.userId,
        planId: params.newPlanId,
        priceId: params.newStripePriceId,
      });

      // Actualizar en Firestore
      const updatedSubscription = Subscription.fromData({
        ...currentSubscription.toSafeJSON(),
        planId: params.newPlanId,
        status: mercadopagoService.mapSubscriptionStatus(updatedMercadopagoSubscription.status || 'pending'),
        updatedAt: new Date(),
      });

      await updateDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, params.subscriptionId), {
        planId: params.newPlanId,
        status: updatedSubscription.status,
        updatedAt: updatedSubscription.updatedAt,
      });

      // Actualizar usuario
      await updateDoc(doc(db, COLLECTIONS.USERS, currentSubscription.userId), {
        plan: params.newPlanId,
        updatedAt: new Date(),
      });

      // Actualizar límite mensual del usuario
      await PlanService.updateUserMonthlyLimit(currentSubscription.userId, params.newPlanId);

      console.log('✅ Subscription updated successfully:', params.subscriptionId);
      return updatedSubscription;
    } catch (error) {
      console.error('❌ Error updating subscription:', error);
      throw new Error('Error al actualizar suscripción');
    }
  }

  // Cancelar suscripción
  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<void> {
    try {
      // Obtener suscripción
      const subscription = await this.getSubscription(subscriptionId);
      if (!subscription) {
        throw new Error('Suscripción no encontrada');
      }

      // En Mercado Pago, las suscripciones se cancelan automáticamente al final del período
      // Solo actualizamos en Firestore

      // Actualizar en Firestore
      const newStatus = cancelAtPeriodEnd ? 'active' : 'canceled';
      await updateDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, subscriptionId), {
        status: newStatus,
        cancelAtPeriodEnd,
        updatedAt: new Date(),
      });

      // Si se cancela inmediatamente, actualizar usuario
      if (!cancelAtPeriodEnd) {
        await updateDoc(doc(db, COLLECTIONS.USERS, subscription.userId), {
          plan: UserPlan.FREE,
          updatedAt: new Date(),
        });

        // Actualizar límite mensual del usuario
        await PlanService.updateUserMonthlyLimit(subscription.userId, 'free');
      }

      console.log('✅ Subscription canceled successfully:', subscriptionId);
    } catch (error) {
      console.error('❌ Error canceling subscription:', error);
      throw new Error('Error al cancelar suscripción');
    }
  }

  // Reactivar suscripción cancelada
  static async reactivateSubscription(subscriptionId: string): Promise<void> {
    try {
      // Obtener suscripción
      const subscription = await this.getSubscription(subscriptionId);
      if (!subscription) {
        throw new Error('Suscripción no encontrado');
      }

      // En Mercado Pago, reactivamos creando una nueva preferencia de pago
      // Por ahora solo actualizamos en Firestore

      // Actualizar en Firestore
      await updateDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, subscriptionId), {
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      });

      console.log('✅ Subscription reactivated successfully:', subscriptionId);
    } catch (error) {
      console.error('❌ Error reactivating subscription:', error);
      throw new Error('Error al reactivar suscripción');
    }
  }

  // Procesar webhook de Mercado Pago
  static async processMercadoPagoWebhook(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment.created':
          await this.handlePaymentCreated(event.data);
          break;
        case 'payment.updated':
          await this.handlePaymentUpdated(event.data);
          break;
        case 'payment.cancelled':
          await this.handlePaymentCancelled(event.data);
          break;
        case 'subscription.created':
          await this.handleSubscriptionCreated(event.data);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(event.data);
          break;
        case 'subscription.deleted':
          await this.handleSubscriptionDeleted(event.data);
          break;
        default:
          console.log('⚠️ Unhandled webhook event type:', event.type);
      }
    } catch (error) {
      console.error('❌ Error processing Mercado Pago webhook:', error);
      throw error;
    }
  }

  // Manejadores de webhooks
  private static async handlePaymentCreated(data: any): Promise<void> {
    console.log('✅ Handling payment created:', data.id);
    // El pago se creó, no hay acción adicional necesaria
  }

  private static async handlePaymentUpdated(data: any): Promise<void> {
    console.log('✅ Handling payment updated:', data.id);
    
    const subscriptionDoc = await getDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, data.external_reference));
    if (subscriptionDoc.exists()) {
      await updateDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, data.external_reference), {
        status: mercadopagoService.mapSubscriptionStatus(data.status),
        updatedAt: new Date(),
      });
    }
  }

  private static async handlePaymentCancelled(data: any): Promise<void> {
    console.log('✅ Handling payment cancelled:', data.id);
    
    const subscriptionDoc = await getDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, data.external_reference));
    if (subscriptionDoc.exists()) {
      const subscriptionData = subscriptionDoc.data();
      
      // Actualizar usuario
      await updateDoc(doc(db, COLLECTIONS.USERS, subscriptionData.userId), {
        plan: UserPlan.FREE,
        updatedAt: new Date(),
      });

      // Actualizar límite mensual del usuario
      await PlanService.updateUserMonthlyLimit(subscriptionData.userId, 'free');
    }
  }

  private static async handleSubscriptionCreated(data: any): Promise<void> {
    console.log('✅ Handling subscription created:', data.id);
    // La suscripción ya se creó en createSubscription, solo log
  }

  private static async handleSubscriptionUpdated(data: any): Promise<void> {
    console.log('✅ Handling subscription updated:', data.id);
    
    const subscriptionDoc = await getDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, data.id));
    if (subscriptionDoc.exists()) {
      await updateDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, data.id), {
        status: mercadopagoService.mapSubscriptionStatus(data.status),
        updatedAt: new Date(),
      });
    }
  }

  private static async handleSubscriptionDeleted(data: any): Promise<void> {
    console.log('✅ Handling subscription deleted:', data.id);
    
    const subscriptionDoc = await getDoc(doc(db, COLLECTIONS.SUBSCRIPTIONS, data.id));
    if (subscriptionDoc.exists()) {
      const subscriptionData = subscriptionDoc.data();
      
      // Actualizar usuario
      await updateDoc(doc(db, COLLECTIONS.USERS, subscriptionData.userId), {
        plan: UserPlan.FREE,
        updatedAt: new Date(),
      });

      // Actualizar límite mensual del usuario
      await PlanService.updateUserMonthlyLimit(subscriptionData.userId, 'free');
    }
  }
} 