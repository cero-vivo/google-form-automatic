import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  Timestamp,
  writeBatch,
  increment,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { UserCredits, CreditTransaction, CreditPurchase, CreditUsage } from '@/types/credits';

const COLLECTION_NAME = 'userCredits';

export class CreditsService {
  /**
   * Obtener créditos del usuario
   */
  static async getUserCredits(userId: string): Promise<UserCredits | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          userId,
          balance: data.balance ?? 0,
          updatedAt: data.updatedAt?.toDate() || new Date(),
          history: data.history?.map((item: any) => ({
            ...item,
            date: item.date?.toDate() || new Date()
          })) || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user credits:', error);
      throw new Error('Error al obtener créditos del usuario');
    }
  }

  /**
   * Crear o inicializar créditos del usuario
   */
  static async initializeUserCredits(userId: string): Promise<UserCredits> {
    try {
      // Importar CONFIG dinámicamente para evitar ciclos de importación
      const { CONFIG } = await import('@/lib/config');
      
      const signupBonus = CONFIG.CREDITS.SIGNUP_BONUS;
      const bonusTransaction = {
        id: `signup_${Date.now()}`,
        type: 'bonus' as const,
        amount: signupBonus,
        date: new Date(),
        description: 'Bono de bienvenida',
        status: 'completed' as const
      };

      const userCredits: UserCredits = {
        userId,
        balance: signupBonus,
        updatedAt: new Date(),
        history: [bonusTransaction]
      };

      await setDoc(doc(db, COLLECTION_NAME, userId), {
        userId,
        balance: signupBonus,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        totalEarned: signupBonus,
        totalPurchased: 0,
        totalUsed: 0,
        history: [{
          ...bonusTransaction,
          date: Timestamp.fromDate(bonusTransaction.date)
        }]
      });

      console.log(`✅ Créditos inicializados para usuario ${userId}: ${signupBonus} créditos`);
      return userCredits;
    } catch (error) {
      console.error('Error initializing user credits:', error);
      throw new Error('Error al inicializar créditos del usuario');
    }
  }

  /**
   * Agregar créditos después de una compra exitosa
   * IMPORTANTE: Esta función debe ser llamada solo por el webhook de MercadoPago
   * Incluye verificación de idempotencia para evitar duplicación de créditos
   */
  static async addCreditsAfterPurchase(
    userId: string, 
    purchase: CreditPurchase, 
    paymentId: string
  ): Promise<void> {
    try {
      const userCreditsRef = doc(db, COLLECTION_NAME, userId);

      // Verificar PRIMERO si el pago ya fue procesado (doble verificación de idempotencia)
      const docSnap = await getDoc(userCreditsRef);
      if (docSnap.exists()) {
        const existingHistory = docSnap.data().history || [];
        const alreadyProcessed = existingHistory.some(
          (transaction: any) => transaction.paymentId === paymentId
        );
        
        if (alreadyProcessed) {
          console.warn(`⚠️ Pago ${paymentId} ya fue procesado - evitando duplicación`);
          return; // Salir sin agregar créditos
        }
      }

      const batch = writeBatch(db);

      // Crear transacción de compra
      const purchaseTransaction: CreditTransaction = {
        id: `purchase_${Date.now()}`,
        type: 'purchase',
        amount: purchase.quantity,
        date: new Date(),
        paymentId,
        description: `Compra de ${purchase.quantity} créditos${purchase.packSize ? ` - Pack ${purchase.packSize}` : ''}`,
        status: 'completed'
      };

      // Si el documento no existe, crearlo
      if (!docSnap.exists()) {
        batch.set(userCreditsRef, {
          userId,
          balance: purchase.quantity,
          totalEarned: purchase.quantity,
          totalPurchased: purchase.quantity,
          totalUsed: 0,
          updatedAt: serverTimestamp(),
          history: [{
            ...purchaseTransaction,
            date: Timestamp.fromDate(purchaseTransaction.date)
          }]
        });
      } else {
        // Actualizar créditos y agregar al historial
        batch.update(userCreditsRef, {
          balance: increment(purchase.quantity),
          totalEarned: increment(purchase.quantity),
          totalPurchased: increment(purchase.quantity),
          updatedAt: serverTimestamp(),
          history: arrayUnion({
            ...purchaseTransaction,
            date: Timestamp.fromDate(purchaseTransaction.date)
          })
        });
      }

      await batch.commit();
      console.log(`✅ Créditos agregados para usuario ${userId}: ${purchase.quantity} créditos (Payment ID: ${paymentId})`);
    } catch (error) {
      console.error('Error adding credits after purchase:', error);
      throw new Error('Error al agregar créditos después de la compra');
    }
  }

  /**
   * Consumir créditos al crear un formulario
   */
  static async consumeCredits(
    userId: string, 
    usage: CreditUsage
  ): Promise<boolean> {
    try {
      const userCreditsRef = doc(db, COLLECTION_NAME, userId);
      
      // Verificar si el usuario tiene créditos suficientes
      const currentCredits = await this.getUserCredits(userId);
      if (!currentCredits || currentCredits.balance < usage.amount) {
        throw new Error('Créditos insuficientes');
      }

      // Crear transacción de uso
      const usageTransaction: CreditTransaction = {
        id: `usage_${Date.now()}`,
        type: 'use',
        amount: usage.amount,
        date: new Date(),
        description: `Formulario: ${usage.formTitle || 'Sin título'}`,
        status: 'completed'
      };

      // Actualizar créditos y agregar al historial
      await updateDoc(userCreditsRef, {
        balance: increment(-usage.amount),
        totalUsed: increment(usage.amount),
        updatedAt: serverTimestamp(),
        history: arrayUnion({
          ...usageTransaction,
          date: Timestamp.fromDate(usageTransaction.date)
        })
      });

      console.log(`✅ Créditos consumidos para usuario ${userId}: ${usage.amount}`);
      return true;
    } catch (error) {
      console.error('Error consuming credits:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario tiene créditos suficientes
   */
  static async hasEnoughCredits(userId: string, requiredAmount: number = 1): Promise<boolean> {
    try {
      const userCredits = await this.getUserCredits(userId);
      return userCredits ? userCredits.balance >= requiredAmount : false;
    } catch (error) {
      console.error('Error checking credits availability:', error);
      return false;
    }
  }

  /**
   * Escuchar cambios en tiempo real en los créditos del usuario
   */
  static subscribeToUserCredits(
    userId: string, 
    callback: (credits: UserCredits | null) => void
  ): () => void {
    const docRef = doc(db, COLLECTION_NAME, userId);
    
    // Configurar opciones para evitar múltiples snapshots
    const unsubscribe = onSnapshot(docRef, {
      next: (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const userCredits: UserCredits = {
            userId,
            balance: data.balance ?? 0,
            updatedAt: data.updatedAt?.toDate() || new Date(),
            history: data.history?.map((item: any) => ({
              ...item,
              date: item.date?.toDate() || new Date()
            })) || []
          };
          callback(userCredits);
        } else {
          callback(null);
        }
      },
      error: (error) => {
        callback(null);
      }
    });
    
    return unsubscribe;
  }

  /**
   * Obtener estadísticas de créditos del usuario
   */
  static async getCreditsStats(userId: string): Promise<{
    totalPurchased: number;
    totalUsed: number;
    currentCredits: number;
    usagePercentage: number;
  }> {
    try {
      const userCredits = await this.getUserCredits(userId);
      if (!userCredits) {
        return {
          totalPurchased: 0,
          totalUsed: 0,
          currentCredits: 0,
          usagePercentage: 0
        };
      }

      const totalPurchased = userCredits.history
        .filter(t => t.type === 'purchase' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalUsed = userCredits.history
        .filter(t => t.type === 'use' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const currentCredits = userCredits.balance;
      const usagePercentage = totalPurchased > 0 ? (totalUsed / totalPurchased) * 100 : 0;

      return {
        totalPurchased,
        totalUsed,
        currentCredits,
        usagePercentage: Math.round(usagePercentage)
      };
    } catch (error) {
      console.error('Error getting credits stats:', error);
      throw new Error('Error al obtener estadísticas de créditos');
    }
  }
}