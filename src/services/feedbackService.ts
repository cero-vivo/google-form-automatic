import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/config';

export interface FeedbackData {
  type: 'bug' | 'suggestion' | 'feature' | 'general';
  description: string;
  email: string | null;
  userAgent: string;
  url: string;
  timestamp: string;
  userId?: string;
  status?: 'new' | 'reviewed' | 'resolved' | 'closed';
}

export interface FeedbackSubmission extends Omit<FeedbackData, 'timestamp'> {
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

/**
 * Submit feedback to Firebase
 * @param feedbackData - The feedback data to submit
 * @returns Promise with the document reference
 */
export async function submitFeedback(feedbackData: FeedbackData): Promise<string> {
  try {
    const feedbackCollection = collection(db, 'feedback');
    
    const submissionData: FeedbackSubmission = {
      ...feedbackData,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(feedbackCollection, submissionData);
    
    console.log('Feedback submitted successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
}

/**
 * Get feedback statistics
 * @returns Promise with feedback statistics
 */
export async function getFeedbackStats(): Promise<{
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}> {
  try {
    // This would typically involve a Firestore query
    // For now, return empty stats as this is mainly for admin use
    return {
      total: 0,
      byType: {},
      byStatus: {},
    };
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    return {
      total: 0,
      byType: {},
      byStatus: {},
    };
  }
}

/**
 * Validate feedback data before submission
 * @param data - The feedback data to validate
 * @returns Validation result
 */
export function validateFeedbackData(data: Partial<FeedbackData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.type || !['bug', 'suggestion', 'feature', 'general'].includes(data.type)) {
    errors.push('Tipo de feedback inválido');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('La descripción es requerida');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}