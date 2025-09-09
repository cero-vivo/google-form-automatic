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
      // Validar que todos los campos requeridos estén presentes
      if (!userId) {
        throw new Error('User ID es requerido');
      }
      if (!draftData.title) {
        throw new Error('El título del formulario es requerido');
      }
      if (!Array.isArray(draftData.questions)) {
        throw new Error('Las preguntas deben ser un array');
      }
      if (typeof draftData.collectEmail !== 'boolean') {
        throw new Error('collectEmail debe ser un valor booleano');
      }
      if (!['ai', 'manual', 'excel'].includes(draftData.creationMethod)) {
        throw new Error('creationMethod debe ser "ai", "manual" o "excel"');
      }

      const draftId = doc(collection(db, this.DRAFTS_COLLECTION)).id;
      
      const draft: Omit<FormDraft, 'id'> = {
        userId,
        title: draftData.title.trim(),
        description: draftData.description?.trim() || '',
        questions: draftData.questions,
        collectEmail: draftData.collectEmail,
        creationMethod: draftData.creationMethod,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Limpiar cualquier campo undefined antes de guardar
      const cleanDraft = JSON.parse(JSON.stringify(draft, (key, value) => 
        value === undefined ? null : value
      ));

      await setDoc(doc(db, this.DRAFTS_COLLECTION, draftId), {
        ...cleanDraft,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return draftId;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error; // Re-lanzar el error original para mejor debugging
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
      // Validar campos requeridos
      if (!userId) throw new Error('User ID es requerido');
      if (!draftId) throw new Error('Draft ID es requerido');
      if (!draftData.title) throw new Error('El título del formulario es requerido');
      if (!Array.isArray(draftData.questions)) throw new Error('Las preguntas deben ser un array');
      if (typeof draftData.collectEmail !== 'boolean') throw new Error('collectEmail debe ser un valor booleano');
      if (!['ai', 'manual', 'excel'].includes(draftData.creationMethod)) throw new Error('creationMethod debe ser "ai", "manual" o "excel"');

      const draft = {
        userId,
        title: draftData.title.trim(),
        description: draftData.description?.trim() || '',
        questions: draftData.questions,
        collectEmail: draftData.collectEmail,
        creationMethod: draftData.creationMethod,
        updatedAt: serverTimestamp()
      };

      // Limpiar campos undefined
      const cleanDraft = JSON.parse(JSON.stringify(draft, (key, value) => 
        value === undefined ? null : value
      ));

      await setDoc(doc(db, this.DRAFTS_COLLECTION, draftId), cleanDraft, { merge: true });
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
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