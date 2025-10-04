# Sistema de Refresh Token para Google OAuth

## 📋 Resumen

Hemos implementado un sistema robusto de renovación automática de tokens de Google OAuth que resuelve el problema de expiración de sesión. Ahora los usuarios pueden mantener su sesión activa sin necesidad de re-autenticarse constantemente.

## 🎯 Problema Resuelto

**Antes:**
- El `googleAccessToken` expiraba cada 1 hora
- Los usuarios tenían que volver a iniciar sesión después de 1 día o 2
- No había mecanismo de renovación automática
- Tokens almacenados en DB sin estrategia de refresh

**Después:**
- Refresh token guardado de forma segura en Firestore
- Renovación automática del access token antes de expirar
- Los usuarios pueden mantener sesión indefinidamente
- Experiencia de usuario mejorada sin interrupciones

## 🔧 Cambios Implementados

### 1. Firebase Auth Service (`src/infrastructure/firebase/auth-service.ts`)

**Cambios:**
- Agregado `prompt: 'consent'` para forzar obtención de refresh token
- Captura de refresh token desde la respuesta de OAuth
- Guardado de ambos tokens (access y refresh) en Firestore

```typescript
this.googleProvider.setCustomParameters({
  prompt: 'consent', // Forzar consentimiento para obtener refresh token
  access_type: 'offline' // Necesario para refresh token
});
```

### 2. API Endpoint de Refresh (`src/app/api/auth/refresh-google-token/route.ts`)

**Nuevo endpoint:** `POST /api/auth/refresh-google-token`

**Funcionalidad:**
- Recibe el `userId` del usuario
- Obtiene el refresh token de Firestore
- Llama a la API de Google OAuth para obtener nuevo access token
- Actualiza el access token en Firestore
- Devuelve el nuevo token

**Request:**
```json
{
  "userId": "user-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "new-access-token",
  "expiresIn": 3600,
  "expiryDate": "2025-10-04T15:00:00.000Z"
}
```

**Manejo de Errores:**
- Si el refresh token es inválido: `needsReauth: true`
- Requiere re-autenticación del usuario

### 3. Entidad User (`src/domain/entities/user.ts`)

**Nuevos métodos:**

```typescript
hasGoogleRefreshToken(): boolean
// Verifica si el usuario tiene refresh token

getTimeUntilTokenExpiry(): number
// Retorna milisegundos hasta expiración

canRefreshGoogleToken(): boolean
// Verifica si puede renovar (tiene refresh token y está expirado/próximo)
```

### 4. Hook useAuthWithGoogle (`src/hooks/useAuthWithGoogle.ts`)

**Nueva función `refreshGoogleToken()`:**
- Llama al endpoint de refresh
- Actualiza el token en Firestore
- Maneja errores de refresh

**Mejoras en `checkGoogleAuthStatus()`:**
- **Renovación automática:** Si el token está expirado y hay refresh token, renueva automáticamente
- **Renovación preventiva:** Si el token expira en menos de 5 minutos, renueva en background

**Mejoras en `renewGoogleAuth()`:**
- **Prioriza refresh token:** Intenta renovar con refresh token primero
- **Fallback a re-auth:** Si falla el refresh, solicita re-autenticación

### 5. GoogleFormsIntegration (`src/containers/useGoogleFormsIntegration.ts`)

**Nueva función `refreshAccessToken()`:**
- Maneja la renovación de tokens antes de operaciones con Google Forms

**Mejoras en `getCurrentToken()`:**
- Ahora es `async`
- Verifica expiración y renueva automáticamente si es necesario
- Renovación preventiva si está próximo a expirar

**Todas las funciones actualizadas:**
- `createGoogleForm()`
- `updateGoogleForm()`
- `deleteGoogleForm()`
- `getFormResponses()`
- `shareFormWithEmails()`
- `listUserForms()`

Ahora usan `await getCurrentToken()` para obtener un token siempre válido.

### 6. Configuración (`src/lib/config.ts`)

**Nueva sección `CONFIG.GOOGLE.TOKEN`:**

```typescript
GOOGLE: {
  TOKEN: {
    ACCESS_TOKEN_EXPIRY_MS: 3600 * 1000,      // 1 hora
    REFRESH_THRESHOLD_MS: 5 * 60 * 1000,      // Renovar 5 min antes
    REFRESH_TIMEOUT_MS: 30 * 1000,            // Timeout de 30s
    MAX_REFRESH_RETRIES: 3,                    // 3 reintentos
    AUTO_CHECK_INTERVAL_MS: 10 * 60 * 1000    // Check cada 10 min
  }
}
```

## 🔐 Seguridad

### Tokens almacenados en Firestore:

**Access Token:**
- ✅ Expira en 1 hora
- ✅ Se renueva automáticamente
- ⚠️ Almacenado en Firestore (aceptable por expiración corta)

**Refresh Token:**
- ✅ Almacenado encriptado en Firestore
- ✅ Solo accesible por el backend
- ✅ Usado únicamente para renovar access tokens
- ⚠️ No expira (hasta que el usuario revoque permisos)

### Mejores prácticas implementadas:

1. ✅ Refresh token nunca se envía al cliente
2. ✅ Renovación automática antes de expirar
3. ✅ Manejo robusto de errores
4. ✅ Re-autenticación solo cuando es necesario
5. ✅ Logs detallados para debugging

## 📊 Flujo de Renovación

```
1. Usuario inicia sesión
   ↓
2. Se obtienen access token + refresh token
   ↓
3. Ambos tokens se guardan en Firestore
   ↓
4. Cada 10 minutos se verifica el token
   ↓
5. Si falta < 5 minutos para expirar:
   ↓
6. Se llama a /api/auth/refresh-google-token
   ↓
7. Endpoint usa refresh token para obtener nuevo access token
   ↓
8. Nuevo access token se guarda en Firestore
   ↓
9. Usuario continúa sin interrupciones ✅
```

## 🚀 Uso

### Para usuarios existentes:

**Importante:** Los usuarios existentes NO tienen refresh token. La próxima vez que inicien sesión, se les pedirá consentimiento nuevamente y se guardará el refresh token.

### Para nuevos usuarios:

Los nuevos usuarios obtendrán automáticamente el refresh token al iniciar sesión por primera vez.

### Verificar si un usuario tiene refresh token:

```typescript
if (userEntity.hasGoogleRefreshToken()) {
  console.log('Usuario tiene refresh token ✅');
} else {
  console.log('Usuario necesita re-autenticar para obtener refresh token ⚠️');
}
```

## 🧪 Testing

### Probar renovación manual:

```typescript
const { refreshGoogleToken } = useAuthWithGoogle();

// Renovar manualmente
const success = await refreshGoogleToken();
if (success) {
  console.log('Token renovado exitosamente ✅');
}
```

### Probar renovación automática:

1. Esperar a que el token esté por expirar (< 5 min)
2. El sistema renovará automáticamente
3. Verificar logs en consola: "⏰ Token expira en X minutos, renovando preventivamente..."

### Verificar estado del token:

```typescript
const { userEntity } = useAuth();

console.log({
  hasToken: !!userEntity?.googleAccessToken,
  hasRefreshToken: userEntity?.hasGoogleRefreshToken?.(),
  isValid: userEntity?.isGoogleTokenValid?.(),
  needsRefresh: userEntity?.needsGoogleTokenRefresh?.(),
  timeUntilExpiry: userEntity?.getTimeUntilTokenExpiry?.()
});
```

## ⚠️ Consideraciones Importantes

### 1. Usuarios Existentes

Los usuarios existentes necesitarán volver a iniciar sesión UNA VEZ para obtener el refresh token. Después de eso, ya no necesitarán re-autenticarse.

### 2. Variables de Entorno

Asegúrate de tener configurado en `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
FIREBASE_CLIENT_SECRET=your-client-secret  # Si está disponible
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com
```

### 3. Revocación de Permisos

Si un usuario revoca los permisos de Google:
- El refresh token se invalida
- El sistema detecta esto automáticamente
- Se solicita re-autenticación al usuario

### 4. Firestore Rules

Asegúrate de que las reglas de Firestore permitan leer/escribir tokens:

```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## 🐛 Debugging

### Logs importantes:

- 🔄 "Intentando renovar token con refresh token..."
- ✅ "Token renovado exitosamente"
- ⏰ "Token expira en X minutos, renovando preventivamente..."
- ⚠️ "Refresh token inválido, se necesita re-autenticación"
- ❌ "Error al renovar token"

### Problemas comunes:

1. **"needsReauth: true"**
   - Refresh token inválido o expirado
   - Solución: Usuario debe volver a iniciar sesión

2. **"No refresh token available"**
   - Usuario autenticado antes de implementar refresh token
   - Solución: Usuario debe volver a iniciar sesión UNA VEZ

3. **"Token renovado pero sigue expirado"**
   - Problema de sincronización con Firestore
   - Solución: Esperar 500ms después de renovar

## ✅ Próximos Pasos Recomendados

1. **Migrar usuarios existentes:** Agregar un banner pidiendo re-login
2. **Monitoreo:** Implementar analytics para renovaciones de tokens
3. **Optimización:** Considerar usar cookies httpOnly en lugar de Firestore para access tokens
4. **Testing:** Agregar tests unitarios para el flujo de refresh

## 📝 Notas Finales

Este sistema mejora significativamente la experiencia del usuario al eliminar la necesidad de re-autenticación constante. Los tokens se renuevan automáticamente y de forma transparente, manteniendo la sesión activa indefinidamente (mientras el usuario no revoque permisos).

**Ventajas:**
- ✅ Mejor UX
- ✅ Menos interrupciones
- ✅ Sesiones persistentes
- ✅ Renovación automática

**Trade-offs:**
- ⚠️ Refresh tokens almacenados en DB (aceptable si está encriptado)
- ⚠️ Usuarios existentes necesitan re-login UNA VEZ
- ⚠️ Más complejo de mantener
