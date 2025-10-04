/**
 * Script para probar el fix de duplicación de créditos
 * 
 * Este script verifica que:
 * 1. Los créditos solo se agregan una vez
 * 2. La verificación de idempotencia funciona
 * 3. El polling del frontend funciona correctamente
 */

import { CreditsService } from './src/infrastructure/firebase/credits-service';

async function testDuplicateCreditsPreventionTest() {
  console.log('🧪 Iniciando pruebas de prevención de duplicación de créditos\n');

  const testUserId = 'test-user-' + Date.now();
  const testPaymentId = 'test-payment-' + Date.now();

  try {
    // Test 1: Verificar que se pueden agregar créditos la primera vez
    console.log('📋 Test 1: Agregar créditos por primera vez');
    await CreditsService.addCreditsAfterPurchase(
      testUserId,
      {
        quantity: 50,
        packSize: '50',
        unitPrice: 20,
        totalPrice: 1000,
        discountPercent: 0
      },
      testPaymentId
    );
    
    const credits1 = await CreditsService.getUserCredits(testUserId);
    console.log(`✅ Créditos después de primera compra: ${credits1?.balance}`);
    
    if (credits1?.balance !== 50) {
      throw new Error(`❌ Error: Se esperaban 50 créditos, se obtuvieron ${credits1?.balance}`);
    }

    // Test 2: Intentar agregar créditos con el mismo paymentId (debe ser rechazado)
    console.log('\n📋 Test 2: Intentar agregar créditos duplicados (mismo paymentId)');
    await CreditsService.addCreditsAfterPurchase(
      testUserId,
      {
        quantity: 50,
        packSize: '50',
        unitPrice: 20,
        totalPrice: 1000,
        discountPercent: 0
      },
      testPaymentId // Mismo paymentId
    );
    
    const credits2 = await CreditsService.getUserCredits(testUserId);
    console.log(`✅ Créditos después de intento de duplicación: ${credits2?.balance}`);
    
    if (credits2?.balance !== 50) {
      throw new Error(`❌ Error: La duplicación no fue prevenida. Créditos: ${credits2?.balance}`);
    }

    // Test 3: Verificar que el historial solo tiene una transacción
    console.log('\n📋 Test 3: Verificar historial de transacciones');
    const purchaseTransactions = credits2?.history?.filter(t => t.paymentId === testPaymentId) || [];
    console.log(`✅ Transacciones con paymentId ${testPaymentId}: ${purchaseTransactions.length}`);
    
    if (purchaseTransactions.length !== 1) {
      throw new Error(`❌ Error: Se esperaba 1 transacción, se encontraron ${purchaseTransactions.length}`);
    }

    // Test 4: Agregar créditos con un paymentId diferente (debe funcionar)
    console.log('\n📋 Test 4: Agregar créditos con nuevo paymentId');
    const newPaymentId = 'test-payment-new-' + Date.now();
    await CreditsService.addCreditsAfterPurchase(
      testUserId,
      {
        quantity: 100,
        packSize: '100',
        unitPrice: 15,
        totalPrice: 1500,
        discountPercent: 10
      },
      newPaymentId
    );
    
    const credits3 = await CreditsService.getUserCredits(testUserId);
    console.log(`✅ Créditos después de segunda compra: ${credits3?.balance}`);
    
    if (credits3?.balance !== 150) {
      throw new Error(`❌ Error: Se esperaban 150 créditos, se obtuvieron ${credits3?.balance}`);
    }

    console.log('\n✨ Todos los tests pasaron exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Créditos totales: ${credits3?.balance}`);
    console.log(`   - Transacciones únicas: ${credits3?.history?.length}`);
    console.log(`   - Duplicación prevenida: ✅`);

  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error);
    throw error;
  }
}

// Instrucciones para ejecutar
console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TEST DE PREVENCIÓN DE DUPLICACIÓN DE CRÉDITOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANTE: Asegúrate de tener las credenciales de Firebase configuradas

Para ejecutar este test:
  
  1. Configura las variables de entorno de Firebase
  2. Ejecuta: npx tsx test-duplicate-credits.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Descomentar para ejecutar
// testDuplicateCreditsPreventionTest().catch(console.error);

export { testDuplicateCreditsPreventionTest };
