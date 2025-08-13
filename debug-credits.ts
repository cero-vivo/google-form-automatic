// Script para ejecutar en la consola del navegador
// Abre la consola (F12) y ejecuta este código

// Función para debug de créditos desde el navegador
async function debugCreditsFromBrowser() {
  try {
    console.log('🔍 Debug de créditos desde el navegador...');
    
    // Importar los módulos necesarios
    const { db } = await import('./src/infrastructure/firebase/config');
    const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');
    
    // Obtener el usuario actual
    const { auth } = await import('./src/infrastructure/firebase/config');
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.log('❌ No hay usuario autenticado');
      return;
    }
    
    console.log('👤 Usuario actual:', currentUser.uid);
    
    // Verificar créditos del usuario actual
    const creditsDocRef = doc(db, 'userCredits', currentUser.uid);
    const creditsDoc = await getDoc(creditsDocRef);
    
    if (creditsDoc.exists()) {
      const data = creditsDoc.data();
      console.log('✅ Créditos encontrados:', {
        balance: data.balance,
        updatedAt: data.updatedAt?.toDate?.(),
        history: data.history?.length || 0,
        fullData: data
      });
    } else {
      console.log('❌ Usuario no tiene créditos, inicializando...');
      
      // Inicializar créditos
      const { CONFIG } = await import('./src/lib/config');
      const signupBonus = CONFIG.CREDITS.SIGNUP_BONUS;
      
      const bonusTransaction = {
        id: `signup_${Date.now()}`,
        type: 'bonus',
        amount: signupBonus,
        date: new Date(),
        description: 'Bono de bienvenida',
        status: 'completed'
      };
      
      const userCredits = {
        userId: currentUser.uid,
        balance: signupBonus,
        totalEarned: signupBonus,
        totalPurchased: 0,
        totalUsed: 0,
        updatedAt: new Date(),
        history: [bonusTransaction]
      };
      
      const { setDoc } = await import('firebase/firestore');
      await setDoc(creditsDocRef, userCredits);
      console.log(`✅ Créditos inicializados: ${signupBonus} créditos`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Hacer disponible globalmente
(window as any).debugCredits = debugCreditsFromBrowser;

console.log('🎯 Script cargado. Ejecuta: debugCredits() en la consola');