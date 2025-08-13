/**
 * Utilidad para inicializar créditos de usuarios existentes
 * 
 * Este script debe ejecutarse una sola vez para dar créditos de bienvenida
 * a usuarios que se registraron antes de implementar el sistema de créditos
 */

import { db } from '@/infrastructure/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { CONFIG } from './config';

interface UserCredits {
  userId: string;
  balance: number;
  updatedAt: Date;
  totalEarned?: number;
  totalPurchased?: number;
  totalUsed?: number;
  history: Array<{
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    status: string;
  }>;
}

/**
 * Inicializa créditos para todos los usuarios que no los tienen
 * @returns Promise con estadísticas de la operación
 */
export async function initializeExistingUsersCredits(): Promise<{
  totalUsers: number;
  usersWithCredits: number;
  usersWithoutCredits: number;
  creditsInitialized: number;
  errors: string[];
}> {
  const stats = {
    totalUsers: 0,
    usersWithCredits: 0,
    usersWithoutCredits: 0,
    creditsInitialized: 0,
    errors: [] as string[]
  };

  try {
    console.log('🚀 Iniciando proceso de inicialización de créditos...');

    // Obtener todos los usuarios de la colección users
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    stats.totalUsers = usersSnapshot.size;
    console.log(`📊 Total de usuarios encontrados: ${stats.totalUsers}`);

    // Verificar cada usuario
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      try {
        // Verificar si el usuario ya tiene créditos
        const creditsDocRef = doc(db, 'userCredits', userId);
        const creditsDoc = await getDoc(creditsDocRef);
        
        if (creditsDoc.exists()) {
          stats.usersWithCredits++;
          console.log(`✅ Usuario ${userId} ya tiene créditos`);
        } else {
          stats.usersWithoutCredits++;
          console.log(`🆕 Usuario ${userId} necesita inicialización de créditos`);
          
          // Inicializar créditos con bono de bienvenida
          const signupBonus = CONFIG.CREDITS.SIGNUP_BONUS;
          const bonusTransaction = {
            id: `signup_existing_${Date.now()}_${userId}`,
            type: 'bonus',
            amount: signupBonus,
            date: new Date(),
            description: 'Bono de bienvenida (retrospectivo)',
            status: 'completed'
          };

          const userCredits: UserCredits = {
            userId,
            balance: signupBonus,
            updatedAt: new Date(),
            totalEarned: signupBonus,
            totalPurchased: 0,
            totalUsed: 0,
            history: [bonusTransaction]
          };

          await setDoc(creditsDocRef, userCredits);
          stats.creditsInitialized++;
          console.log(`✅ Créditos inicializados para usuario ${userId}: ${signupBonus} créditos`);
        }
      } catch (userError) {
        const errorMsg = `Error procesando usuario ${userId}: ${userError}`;
        console.error(`❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
    }

    console.log('📈 Estadísticas finales:', stats);
    return stats;
    
  } catch (error) {
    const errorMsg = `Error general: ${error}`;
    console.error(`❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
    return stats;
  }
}

/**
 * Inicializa créditos para un usuario específico
 * @param userId ID del usuario
 * @returns true si se inicializaron créditos, false si ya los tenía
 */
export async function initializeUserCredits(userId: string): Promise<boolean> {
  try {
    const creditsDocRef = doc(db, 'userCredits', userId);
    const creditsDoc = await getDoc(creditsDocRef);
    
    if (creditsDoc.exists()) {
      console.log(`✅ Usuario ${userId} ya tiene créditos`);
      return false;
    }

    const signupBonus = CONFIG.CREDITS.SIGNUP_BONUS;
    const bonusTransaction = {
      id: `signup_single_${Date.now()}_${userId}`,
      type: 'bonus',
      amount: signupBonus,
      date: new Date(),
      description: 'Bono de bienvenida',
      status: 'completed'
    };

    const userCredits: UserCredits = {
        userId,
        balance: signupBonus,
        updatedAt: new Date(),
        totalEarned: signupBonus,
        totalPurchased: 0,
        totalUsed: 0,
        history: [bonusTransaction]
      };

    await setDoc(creditsDocRef, userCredits);
    console.log(`✅ Créditos inicializados para usuario ${userId}: ${signupBonus} créditos`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error inicializando créditos para usuario ${userId}:`, error);
    throw error;
  }
}

// Script de ejecución (descomentar para usar)
// if (typeof window !== 'undefined') {
//   // @ts-ignore
//   window.initializeExistingUsersCredits = initializeExistingUsersCredits;
//   // @ts-ignore
//   window.initializeUserCredits = initializeUserCredits;
// }

// Para ejecutar en la consola del navegador:
// import { initializeExistingUsersCredits } from '@/lib/initialize-existing-users-credits';
// await initializeExistingUsersCredits();