import { doc, setDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { db, COLLECTIONS } from './config';

export interface FormMetadata {
  title: string;
  questions: any[];
  googleFormId?: string;
  googleFormUrl?: string;
  createdVia: 'ai-chat' | 'manual' | 'csv';
  creditsUsed: number;
  timestamp: Date;
  userId: string;
}

export interface ChatInteraction {
  userId: string;
  messages: number;
  creditsUsed: number;
  timestamp: Date;
  formId?: string;
  conversation?: any[];
}

export class FirebaseRepository {
  static async saveForm(userId: string, formMetadata: FormMetadata): Promise<string> {
    try {
      const formRef = doc(collection(db, COLLECTIONS.FORMS));
      const formData = {
        ...formMetadata,
        userId,
        id: formRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(formRef, formData);
      return formRef.id;
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  }

  static async logChatInteraction(userId: string, interaction: ChatInteraction): Promise<string> {
    try {
      const chatRef = collection(db, COLLECTIONS.USER_CREDITS, userId, 'chat_history');
      const interactionData = {
        ...interaction,
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(chatRef, interactionData);
      return docRef.id;
    } catch (error) {
      console.error('Error logging chat interaction:', error);
      throw error;
    }
  }

  static async updateUserFormCount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await setDoc(userRef, {
        formCount: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user form count:', error);
    }
  }

  static async createFormAnalytics(formId: string, analyticsData: any): Promise<void> {
    try {
      const analyticsRef = doc(collection(db, COLLECTIONS.ANALYTICS));
      await setDoc(analyticsRef, {
        formId,
        ...analyticsData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating form analytics:', error);
    }
  }
}