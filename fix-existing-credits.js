// Script para ejecutar en la consola del navegador
// Abre la consola (F12) y ejecuta este código para fixear créditos existentes

// Función para fixear créditos de usuario actual
async function fixExistingUserCredits() {
  try {
    console.log('🔧 Fix de créditos para usuarios existentes...');
    
    // Importar dinámicamente los módulos necesarios
    const { db } = await import('./src/infrastructure/firebase/config');
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    
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
      console.log('📊 Datos actuales:', data);
      
      // Verificar si hay inconsistencias en la estructura
      const currentCredits = data.credits ?? data.balance ?? 0;
      console.log('💰 Créditos actuales:', currentCredits);
      
      // Si tiene 0 créditos o no tiene el campo credits correctamente, actualizar
      const hasBonus = data.history?.some(h => h.type === 'bonus') || false;
      
      if (currentCredits === 0 && !hasBonus) {
        console.log('🆕 Aplicando bono de bienvenida...');
        
        const { CONFIG } = await import('./src/lib/config');
        const signupBonus = CONFIG.CREDITS.SIGNUP_BONUS;
        
        const bonusTransaction = {
          id: `signup_${Date.now()}`,
          type: 'bonus',
          amount: signupBonus,
          date: new Date(),
          description: 'Bono de bienvenida (fix retrospectivo)',
          status: 'completed'
        };
        
        const updatedCredits = {
          ...data,
          credits: signupBonus,
          updatedAt: new Date(),
          history: [
            ...(data.history || []),
            bonusTransaction
          ]
        };
        
        await setDoc(creditsDocRef, updatedCredits);
        console.log(`✅ Créditos actualizados: ${signupBonus} créditos`);
      } else {
        console.log('✅ Créditos ya están correctos');
      }
    } else {
      console.log('❌ Usuario no tiene documento de créditos');
      
      // Crear documento con bono de bienvenida
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
        credits: signupBonus,
        updatedAt: new Date(),
        history: [bonusTransaction]
      };
      
      await setDoc(creditsDocRef, userCredits);
      console.log(`✅ Documento creado con ${signupBonus} créditos`);
    }
    
    console.log('🔄 Recargando la página...');
    setTimeout(() => window.location.reload(), 1000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Hacer disponible globalmente
window.fixExistingUserCredits = fixExistingUserCredits;

console.log('🎯 Script cargado. Ejecuta: fixExistingUserCredits() en la consola');
console.log('📍 Abre la consola (F12) y ejecuta: fixExistingUserCredits()');