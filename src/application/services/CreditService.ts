import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/infrastructure/firebase/config';

export interface CreditUsage {
  type: 'form_creation' | 'ai_chat' | 'ai_publish';
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface ChatInteraction {
  userId: string;
  messages: number;
  creditsUsed: number;
  timestamp: Date;
  formId?: string;
}

export class CreditService {
  async getUserCredits(userId: string): Promise<number> {
    try {
      const creditsDoc = await getDoc(doc(db, COLLECTIONS.USER_CREDITS, userId));
      if (!creditsDoc.exists()) {
        // Initialize credits if not exists
        await this.initializeUserCredits(userId);
        return 0;
      }
      return creditsDoc.data().balance || 0;
    } catch (error) {
      console.error('Error getting user credits:', error);
      return 0;
    }
  }

  async deductCredits(userId: string, amount: number): Promise<void> {
    try {
      const creditsRef = doc(db, COLLECTIONS.USER_CREDITS, userId);
      const creditsDoc = await getDoc(creditsRef);
      
      if (!creditsDoc.exists()) {
        await this.initializeUserCredits(userId);
      }

      const currentBalance = creditsDoc.data()?.balance || 0;
      
      if (currentBalance < amount) {
        throw new Error('Créditos insuficientes');
      }

      await updateDoc(creditsRef, {
        balance: increment(-amount),
        totalUsed: increment(amount),
        updatedAt: new Date()
      });

      // Log the transaction
      await this.logCreditUsage(userId, {
        type: 'ai_chat',
        amount,
        description: 'Uso de créditos en chat IA'
      });
    } catch (error) {
      console.error('Error deducting credits:', error);
      throw error;
    }
  }

  async logCreditUsage(userId: string, usage: CreditUsage): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.USER_CREDITS, userId, 'transactions'), {
        ...usage,
        timestamp: new Date(),
        balanceAfter: increment(0) // Will be calculated on the client
      });
    } catch (error) {
      console.error('Error logging credit usage:', error);
    }
  }

  async logChatInteraction(userId: string, interaction: ChatInteraction): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.USER_CREDITS, userId, 'chat_history'), {
        messages: interaction.messages,
        creditsUsed: interaction.creditsUsed,
        timestamp: interaction.timestamp,
        formId: interaction.formId || null
      });
    } catch (error) {
      console.error('Error logging chat interaction:', error);
    }
  }

  async initializeUserCredits(userId: string): Promise<void> {
    try {
      const creditsRef = doc(db, COLLECTIONS.USER_CREDITS, userId);
      const creditsDoc = await getDoc(creditsRef);
      
      if (!creditsDoc.exists()) {
        await updateDoc(creditsRef, {
          userId,
          balance: 0,
          totalPurchased: 0,
          totalUsed: 0,
          totalEarned: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error initializing user credits:', error);
    }
  }

  async getCreditHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const transactionsRef = collection(db, COLLECTIONS.USER_CREDITS, userId, 'transactions');
      const query = transactionsRef;
      // In a real implementation, you would use query constraints
      // For now, return empty array as this would need server-side pagination
      return [];
    } catch (error) {
      console.error('Error getting credit history:', error);
      return [];
    }
  }

  async getChatHistory(userId: string, limit: number = 20): Promise<ChatInteraction[]> {
    try {
      const chatHistoryRef = collection(db, COLLECTIONS.USER_CREDITS, userId, 'chat_history');
      // In a real implementation, you would use query constraints
      // For now, return empty array as this would need server-side pagination
      return [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}