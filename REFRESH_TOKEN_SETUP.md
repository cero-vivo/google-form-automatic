# 🚀 Guía de Implementación del Sistema de Refresh Token

## ✅ Verificación de Implementación

Todos los componentes del sistema de refresh token han sido implementados:

- [x] Firebase Auth Service actualizado para capturar refresh token
- [x] API endpoint `/api/auth/refresh-google-token` creado
- [x] Entidad User con métodos de refresh token
- [x] Hook `useAuthWithGoogle` con renovación automática
- [x] `useGoogleFormsIntegration` actualizado
- [x] Configuración en `config.ts`
- [x] Documentación completa
- [x] Script de análisis de migración
- [x] Componentes UI para migración

## 📋 Pasos Siguientes

### 1. Verificar Variables de Entorno

Asegúrate de tener estas variables en tu `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_SECRET=your-client-secret  # Opcional pero recomendado
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com
```

### 2. Analizar Usuarios Existentes

Ejecuta el script de análisis para ver cuántos usuarios necesitan re-autenticación:

```bash
# Con bun
bun scripts/analyze-google-tokens.ts

# Con Node
npx ts-node scripts/analyze-google-tokens.ts
```

El script te dirá:
- ✅ Cuántos usuarios tienen refresh token
- ⚠️ Cuántos necesitan re-autenticación
- 💡 Recomendaciones basadas en los resultados

### 3. Implementar Banner de Migración

Agrega el banner en tu layout principal para usuarios que necesiten re-autenticación:

```tsx
// src/app/layout.tsx o donde tengas tu layout principal
import { RefreshTokenMigrationBanner } from '@/components/RefreshTokenMigrationBanner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Banner para solicitar re-autenticación */}
        <RefreshTokenMigrationBanner />
        
        {children}
      </body>
    </html>
  );
}
```

### 4. (Opcional) Implementar Modal Crítico

Si quieres forzar re-autenticación cuando sea crítico:

```tsx
import { RefreshTokenMigrationModal } from '@/components/RefreshTokenMigrationBanner';

export default function DashboardLayout({ children }) {
  return (
    <>
      <RefreshTokenMigrationModal />
      {children}
    </>
  );
}
```

### 5. Probar el Flujo

#### A. Probar con Usuario Nuevo

1. Cierra sesión completamente
2. Inicia sesión con Google
3. Verifica en consola: "✅ Refresh Token guardado"
4. Espera 5 minutos (o ajusta `REFRESH_THRESHOLD_MS` para testing)
5. Verifica renovación automática en logs

#### B. Probar con Usuario Existente

1. Inicia sesión con cuenta existente
2. Deberías ver el banner de migración
3. Haz click en "Reconectar ahora"
4. Verifica que el banner desaparezca
5. El usuario ahora tiene refresh token ✅

#### C. Probar Expiración

Para testing rápido, modifica temporalmente en `config.ts`:

```typescript
TOKEN: {
  ACCESS_TOKEN_EXPIRY_MS: 2 * 60 * 1000, // 2 minutos en lugar de 1 hora
  REFRESH_THRESHOLD_MS: 1 * 60 * 1000,   // 1 minuto en lugar de 5
}
```

Ahora podrás ver la renovación automática en 1-2 minutos.

### 6. Monitorear en Producción

Agrega logging para monitorear renovaciones:

```typescript
// En tu sistema de analytics
analytics.track('google_token_renewed', {
  userId: userEntity.id,
  method: 'refresh_token', // o 're_auth'
  timestamp: new Date()
});
```

## 🐛 Solución de Problemas

### Problema: "No refresh token available"

**Causa:** Usuario autenticado antes de implementar refresh token.

**Solución:** 
1. Usuario debe ver el banner de migración
2. Hacer click en "Reconectar ahora"
3. Una vez re-autenticado, tendrá refresh token

### Problema: "needsReauth: true" en endpoint

**Causa:** Refresh token inválido o revocado.

**Solución:**
1. Usuario debe volver a iniciar sesión
2. Verificar que `prompt: 'consent'` esté en GoogleAuthProvider
3. Verificar que `access_type: 'offline'` esté configurado

### Problema: Renovación no automática

**Causa:** Configuración de intervalos incorrecta.

**Solución:**
1. Verificar `AUTO_CHECK_INTERVAL_MS` en config
2. Verificar que `GoogleAuthProvider` está envolviendo la app
3. Verificar logs en consola para detectar errores

### Problema: "Invalid client" en Google OAuth

**Causa:** Credenciales de OAuth incorrectas.

**Solución:**
1. Verificar `NEXT_PUBLIC_FIREBASE_API_KEY`
2. Verificar `FIREBASE_CLIENT_SECRET`
3. Verificar configuración en Google Cloud Console

## 📊 Métricas Recomendadas

Implementa estas métricas para monitorear el sistema:

```typescript
// Renovaciones exitosas
analytics.track('token_refresh_success', {
  userId,
  timeUntilExpiry,
  method: 'automatic' | 'manual'
});

// Renovaciones fallidas
analytics.track('token_refresh_failed', {
  userId,
  error,
  needsReauth
});

// Re-autenticaciones
analytics.track('user_reauthenticated', {
  userId,
  reason: 'no_refresh_token' | 'invalid_refresh_token'
});
```

## 🎯 Checklist de Implementación

- [ ] Variables de entorno configuradas
- [ ] Script de análisis ejecutado
- [ ] Banner de migración agregado al layout
- [ ] Flujo de re-autenticación probado
- [ ] Renovación automática verificada
- [ ] Logs de debug revisados
- [ ] Sistema funcionando en staging
- [ ] Documentación revisada por el equipo
- [ ] Plan de comunicación a usuarios definido
- [ ] Métricas de monitoreo implementadas

## 📧 Comunicación a Usuarios

Si más del 20% de usuarios necesitan re-autenticación, considera enviar un email:

**Asunto:** Mejoras en tu cuenta de FastForm

**Cuerpo:**
```
Hola [Nombre],

Hemos implementado mejoras importantes en la seguridad y estabilidad de tu cuenta.

A partir de ahora, tu sesión permanecerá activa automáticamente sin necesidad
de volver a iniciar sesión constantemente.

Para activar esta mejora, solo necesitas:
1. Ir a FastForm
2. Hacer click en "Reconectar con Google" cuando lo solicite
3. ¡Listo! Solo necesitas hacerlo una vez.

Después de esto, podrás usar FastForm sin interrupciones.

Gracias por tu confianza,
El equipo de FastForm
```

## 🔒 Seguridad

### Consideraciones Importantes

1. **Refresh tokens en Firestore:**
   - Son seguros si Firestore está bien configurado
   - Solo el usuario propietario puede leerlos
   - No están expuestos al cliente directamente

2. **Access tokens:**
   - Expiran cada 1 hora
   - Se renuevan automáticamente
   - Aceptable almacenarlos temporalmente

3. **Re-autenticación:**
   - Necesaria si refresh token es revocado
   - Buena práctica pedirlo periódicamente (cada 6-12 meses)

### Firestore Rules Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Solo el usuario puede leer/escribir sus propios datos
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tu sistema de refresh token estará completamente operativo.

Los usuarios disfrutarán de:
- ✅ Sesiones persistentes sin re-autenticación constante
- ✅ Renovación automática transparente
- ✅ Mejor experiencia de usuario
- ✅ Mayor seguridad

Si tienes problemas, revisa:
1. La documentación en `GOOGLE_OAUTH_REFRESH_TOKEN.md`
2. Los logs en consola del navegador
3. Los logs del servidor Next.js
4. Las reglas de Firestore

¿Necesitas ayuda? Revisa la sección de "Solución de Problemas" arriba.
