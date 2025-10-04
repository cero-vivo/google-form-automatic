/**
 * Script de Migración para Usuarios Existentes
 * 
 * Este script ayuda a identificar usuarios que NO tienen refresh token
 * y necesitan volver a iniciar sesión para obtenerlo.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

interface UserStats {
  total: number;
  withRefreshToken: number;
  withoutRefreshToken: number;
  withExpiredToken: number;
  needsReauth: number;
}

/**
 * Analiza el estado de los tokens de todos los usuarios
 */
async function analyzeUserTokens(): Promise<UserStats> {
  console.log('🔍 Analizando tokens de usuarios...\n');

  const stats: UserStats = {
    total: 0,
    withRefreshToken: 0,
    withoutRefreshToken: 0,
    withExpiredToken: 0,
    needsReauth: 0,
  };

  try {
    // Obtener todos los usuarios
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    stats.total = usersSnapshot.size;
    console.log(`📊 Total de usuarios: ${stats.total}\n`);

    const usersNeedingReauth: string[] = [];
    const now = new Date();

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const userId = doc.id;
      const email = userData.email;
      
      // Verificar refresh token
      const hasRefreshToken = !!userData.googleRefreshToken;
      const hasAccessToken = !!userData.googleAccessToken;
      const tokenExpiry = userData.googleTokenExpiry?.toDate();
      const isExpired = tokenExpiry ? tokenExpiry < now : true;

      if (hasRefreshToken) {
        stats.withRefreshToken++;
      } else {
        stats.withoutRefreshToken++;
      }

      if (isExpired) {
        stats.withExpiredToken++;
      }

      // Usuario necesita re-autenticación si:
      // 1. Tiene access token pero NO tiene refresh token
      // 2. O su access token está expirado y no tiene refresh token
      if (hasAccessToken && !hasRefreshToken) {
        stats.needsReauth++;
        usersNeedingReauth.push(`${email} (${userId})`);
      }
    });

    // Mostrar resultados
    console.log('📈 Resultados del análisis:');
    console.log('─────────────────────────────────────');
    console.log(`✅ Con refresh token:     ${stats.withRefreshToken} (${((stats.withRefreshToken / stats.total) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Sin refresh token:     ${stats.withoutRefreshToken} (${((stats.withoutRefreshToken / stats.total) * 100).toFixed(1)}%)`);
    console.log(`🔴 Con token expirado:    ${stats.withExpiredToken} (${((stats.withExpiredToken / stats.total) * 100).toFixed(1)}%)`);
    console.log(`🔄 Necesitan re-auth:     ${stats.needsReauth} (${((stats.needsReauth / stats.total) * 100).toFixed(1)}%)`);
    console.log('─────────────────────────────────────\n');

    if (usersNeedingReauth.length > 0) {
      console.log('👥 Usuarios que necesitan re-autenticación:');
      usersNeedingReauth.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user}`);
      });
      console.log('');
    }

    return stats;

  } catch (error) {
    console.error('❌ Error al analizar usuarios:', error);
    throw error;
  }
}

/**
 * Genera recomendaciones basadas en el análisis
 */
function generateRecommendations(stats: UserStats) {
  console.log('💡 Recomendaciones:');
  console.log('═════════════════════════════════════\n');

  const percentNeedingReauth = (stats.needsReauth / stats.total) * 100;

  if (percentNeedingReauth > 50) {
    console.log('🔴 ALTA PRIORIDAD: Más del 50% de usuarios necesitan re-autenticación');
    console.log('   Acciones recomendadas:');
    console.log('   1. Mostrar banner global pidiendo re-login');
    console.log('   2. Enviar email a todos los usuarios afectados');
    console.log('   3. Considerar implementar migración automática en próximo login\n');
  } else if (percentNeedingReauth > 20) {
    console.log('🟡 PRIORIDAD MEDIA: Entre 20-50% de usuarios necesitan re-autenticación');
    console.log('   Acciones recomendadas:');
    console.log('   1. Mostrar modal informativo al detectar token expirado');
    console.log('   2. Enviar email a usuarios activos en los últimos 7 días\n');
  } else if (percentNeedingReauth > 0) {
    console.log('🟢 PRIORIDAD BAJA: Menos del 20% de usuarios necesitan re-autenticación');
    console.log('   Acciones recomendadas:');
    console.log('   1. Manejar re-autenticación caso por caso');
    console.log('   2. Mostrar mensaje al intentar crear formularios\n');
  } else {
    console.log('✅ EXCELENTE: Todos los usuarios tienen refresh token');
    console.log('   No se requiere acción adicional\n');
  }

  console.log('📋 Checklist de implementación:');
  console.log('   □ Verificar que el endpoint /api/auth/refresh-google-token funciona');
  console.log('   □ Probar flujo de renovación automática');
  console.log('   □ Implementar UI para solicitar re-login');
  console.log('   □ Configurar monitoring de renovaciones');
  console.log('   □ Documentar proceso para el equipo\n');
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando análisis de tokens de Google OAuth\n');
  console.log('Este script analiza el estado de los tokens de todos los usuarios');
  console.log('y proporciona recomendaciones para la migración al nuevo sistema.\n');
  console.log('═════════════════════════════════════════════════════════════\n');

  try {
    const stats = await analyzeUserTokens();
    generateRecommendations(stats);

    console.log('═════════════════════════════════════════════════════════════');
    console.log('✅ Análisis completado exitosamente\n');

  } catch (error) {
    console.error('\n❌ Error durante el análisis:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { analyzeUserTokens, generateRecommendations };
