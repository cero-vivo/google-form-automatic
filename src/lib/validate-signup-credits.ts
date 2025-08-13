import { doc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/infrastructure/firebase/config';
import { CONFIG } from './config';

/**
 * Función de utilidad para verificar que un usuario tiene créditos asignados
 * @param userId - ID del usuario
 * @returns Información de créditos del usuario
 */
export async function validateUserCredits(userId: string) {
  try {
    const creditsDoc = await getDoc(doc(db, COLLECTIONS.USER_CREDITS, userId));
    
    if (!creditsDoc.exists()) {
      console.warn('⚠️ No se encontraron créditos para el usuario:', userId);
      return null;
    }

    const creditsData = creditsDoc.data();
    console.log('✅ Créditos del usuario:', {
      balance: creditsData.balance,
      totalEarned: creditsData.totalEarned,
      transactionCount: creditsData.transactions?.length || 0
    });

    // Validar que el balance inicial sea correcto
    if (creditsData.balance !== CONFIG.CREDITS.SIGNUP_BONUS) {
      console.warn('⚠️ El balance no coincide con la bonificación de registro:', {
        expected: CONFIG.CREDITS.SIGNUP_BONUS,
        actual: creditsData.balance
      });
    }

    return creditsData;
  } catch (error) {
    console.error('❌ Error validando créditos:', error);
    return null;
  }
}

/**
 * Función para verificar todos los usuarios y sus créditos
 * Solo para debugging en desarrollo
 */
export async function validateAllUsersCredits() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('⚠️ Esta función solo está disponible en desarrollo');
    return;
  }

  try {
    // Esta función requeriría una consulta más compleja
    // Por ahora solo imprime la configuración actual
    console.log('📊 Configuración de créditos:', {
      signupBonus: CONFIG.CREDITS.SIGNUP_BONUS,
      collections: COLLECTIONS.USER_CREDITS
    });
  } catch (error) {
    console.error('❌ Error en validación:', error);
  }
}