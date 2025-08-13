import { db } from '@/infrastructure/firebase/config';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';

export class CreditService {
  async getUserCredits(userId: string): Promise<number> {
    try {
      const userDoc = await getDoc(doc(db, 'userCredits', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Handle both old and new format
        if (data.credits !== undefined) {
          return data.credits;
        } else if (data.remaining !== undefined) {
          return data.remaining;
        } else {
          return 0;
        }
      } else {
        // Initialize user credits if doesn't exist
        const initialCredits = 50;
        await setDoc(doc(db, 'userCredits', userId), {
          credits: initialCredits,
          total: initialCredits,
          used: 0,
          remaining: initialCredits,
          lastUpdated: new Date()
        });
        console.log(`Initialized credits for user ${userId}: ${initialCredits}`);
        return initialCredits;
      }
    } catch (error) {
      console.error('Error getting user credits:', error);
      return 0;
    }
  }

  async deductCredits(userId: string, amount: number): Promise<boolean> {
    try {
      const userRef = doc(db, 'userCredits', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return false;
      }

      const currentCredits = userDoc.data().credits || 0;
      
      if (currentCredits < amount) {
        return false;
      }

      await updateDoc(userRef, {
        credits: increment(-amount),
        lastUpdated: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      return false;
    }
  }

  async addCredits(userId: string, amount: number): Promise<boolean> {
    try {
      const userRef = doc(db, 'userCredits', userId);
      
      await updateDoc(userRef, {
        credits: increment(amount),
        lastUpdated: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      return false;
    }
  }

  async getCreditHistory(userId: string): Promise<any[]> {
    try {
      const historyRef = doc(db, 'userCredits', userId, 'history', 'transactions');
      const historyDoc = await getDoc(historyRef);
      
      return historyDoc.exists() ? historyDoc.data().transactions || [] : [];
    } catch (error) {
      console.error('Error getting credit history:', error);
      return [];
    }
  }

  async initializeUserCredits(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'userCredits', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const initialCredits = 50;
        await setDoc(userRef, {
          credits: initialCredits,
          total: initialCredits,
          used: 0,
          remaining: initialCredits,
          lastUpdated: new Date()
        });
        console.log(`Initialized credits for user ${userId}: ${initialCredits}`);
      }
    } catch (error) {
      console.error('Error initializing user credits:', error);
    }
  }
}