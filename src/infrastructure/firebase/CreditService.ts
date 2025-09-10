import { doc, getDoc, updateDoc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface UserCredits {
  total: number;
  used: number;
  remaining: number;
  lastUpdated: Date;
}

export interface CreditUsage {
  type: 'chat_message' | 'form_creation' | 'form_publish';
  amount: number;
  timestamp: Date;
  userId: string;
  metadata?: any;
}

export class CreditService {
  static async getUserCredits(userId: string): Promise<UserCredits> {
    try {
      const creditsRef = doc(db, 'userCredits', userId);
      const creditsSnap = await getDoc(creditsRef);
      
      if (creditsSnap.exists()) {
        const data = creditsSnap.data();
        return {
          total: data.total || 0,
          used: data.used || 0,
          remaining: data.remaining || 0,
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        };
      } else {
        const initialCredits = {
          total: 50,
          used: 0,
          remaining: 50,
          lastUpdated: new Date(),
        };
        
        await setDoc(creditsRef, {
          ...initialCredits,
          lastUpdated: Timestamp.now(),
        });
        
        return initialCredits;
      }
    } catch (error) {
      console.error('Error getting user credits:', error);
      throw error;
    }
  }

  static async deductCredits(userId: string, amount: number, type: string, metadata?: any): Promise<boolean> {
    try {
      const creditsRef = doc(db, 'userCredits', userId);
      const creditsSnap = await getDoc(creditsRef);
      
      if (!creditsSnap.exists()) {
        throw new Error('User credits not found');
      }
      
      const currentCredits = creditsSnap.data();
      const remaining = currentCredits.remaining || 0;
      
      if (remaining < amount) {
        return false;
      }
      
      await updateDoc(creditsRef, {
        used: (currentCredits.used || 0) + amount,
        remaining: remaining - amount,
        lastUpdated: Timestamp.now(),
      });
      
      await this.logCreditUsage(userId, {
        type: type as any,
        amount,
        timestamp: new Date(),
        userId,
        metadata,
      });
      
      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      throw error;
    }
  }

  static async logCreditUsage(userId: string, usage: CreditUsage): Promise<void> {
    try {
      await addDoc(collection(db, 'creditUsage'), {
        ...usage,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error logging credit usage:', error);
    }
  }

  static async initializeUserCredits(userId: string): Promise<void> {
    try {
      const creditsRef = doc(db, 'userCredits', userId);
      const creditsSnap = await getDoc(creditsRef);
      
      if (!creditsSnap.exists()) {
        await setDoc(creditsRef, {
          total: 50,
          used: 0,
          remaining: 50,
          lastUpdated: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error initializing user credits:', error);
    }
  }
}