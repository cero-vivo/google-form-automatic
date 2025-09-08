import { db, COLLECTIONS } from './config';
import { doc, setDoc, getDocs, getDoc, collection, query, where, orderBy, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Question } from '@/domain/entities/question';

export interface FormDraft {
  id: string;
  userId: string;
  title: string;
  description: string;
  questions: Question[];
  collectEmail: boolean;
  creationMethod: "ai" | "manual" | "excel";
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveDraftRequest {
  title: string;
  description: string;
  questions: Question[];
  collectEmail: boolean;
  creationMethod: "ai" | "manual" | "excel";
}

export class DraftService {
  private static readonly DRAFTS_COLLECTION = 'userDrafts';

  static async saveDraft(userId: string, draftData: SaveDraftRequest): Promise<string> {
    try {
      const draftId = doc(collection(db, this.DRAFTS_COLLECTION)).id;
      
      const draft: Omit<FormDraft, 'id'> = {
        userId,
        title: draftData.title,
        description: draftData.description,
        questions: draftData.questions,
        collectEmail: draftData.collectEmail,
        creationMethod: draftData.creationMethod,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, this.DRAFTS_COLLECTION, draftId), {
        ...draft,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return draftId;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('No se pudo guardar el borrador');
    }
  }

  static async getUserDrafts(userId: string): Promise<FormDraft[]> {
    try {
      const draftsQuery = query(
        collection(db, this.DRAFTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(draftsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FormDraft));
    } catch (error) {
      console.error('Error getting drafts:', error);
      throw new Error('No se pudieron cargar los borradores');
    }
  }

  static async deleteDraft(draftId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.DRAFTS_COLLECTION, draftId));
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw new Error('No se pudo eliminar el borrador');
    }
  }

  static async updateDraft(userId: string, draftId: string, draftData: SaveDraftRequest): Promise<void> {
    try {
      await setDoc(doc(db, this.DRAFTS_COLLECTION, draftId), {
        userId,
        title: draftData.title,
        description: draftData.description,
        questions: draftData.questions,
        collectEmail: draftData.collectEmail,
        creationMethod: draftData.creationMethod,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating draft:', error);
      throw new Error('No se pudo actualizar el borrador');
    }
  }

  static async getDraftById(userId: string, draftId: string): Promise<FormDraft | null> {
    try {
      const draftDoc = doc(db, this.DRAFTS_COLLECTION, draftId);
      const snapshot = await getDoc(draftDoc);
      
      if (snapshot.exists() && snapshot.data().userId === userId) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as FormDraft;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting draft by ID:', error);
      throw new Error('No se pudo obtener el borrador');
    }
  }
}