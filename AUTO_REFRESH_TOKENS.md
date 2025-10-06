# 🔄 Auto-Refresh de Tokens de Google - Implementación

## ✅ Objetivo

Implementar un sistema de **refresh automático de tokens** que mantenga la sesión activa sin necesidad de que el usuario se vuelva a loguear.

**Resultado:** Cuando el token de Google esté próximo a expirar (menos de 10 minutos), el sistema automáticamente:
1. Intenta refrescar el token usando el refresh token
2. Si no hay refresh token, intenta re-autenticar silenciosamente
3. Solo cierra sesión si ambos métodos fallan

## 🛠️ Componentes Implementados

### 1. Endpoint de Refresh Token

**Archivo:** `/src/app/api/auth/refresh-google-token/route.ts`

```typescript
POST /api/auth/refresh-google-token
Body: { userId: string }

Response Success:
{
  success: true,
  accessToken: string,
  expiresIn: number,
  expiryDate: string
}

Response Error:
{
  error: string,
  requiresReauth?: boolean
}
```

**Funcionalidad:**
- Obtiene el refresh token del usuario desde Firestore
- Llama a la API de Google OAuth2 para obtener un nuevo access token
- Actualiza el token en Firestore
- Retorna el nuevo token o error

**Ventajas:**
✅ Proceso transparente para el usuario  
✅ No requiere interacción del usuario  
✅ Mantiene la sesión activa automáticamente  

### 2. Silent Re-Authentication

**Archivo:** `/src/infrastructure/firebase/auth-service.ts`

```typescript
async silentReauth(): Promise<boolean> {
  // Intenta re-autenticar con popup usando prompt='none'
  // Pre-selecciona la cuenta del usuario
  // Obtiene nuevos tokens sin fricción
}
```

**Funcionalidad:**
- Se ejecuta cuando no hay refresh token disponible
- Abre un popup de Google con `prompt: 'none'`
- Pre-selecciona la cuenta del usuario actual
- Obtiene nuevos tokens de acceso
- Actualiza tokens en Firestore

**Ventajas:**
✅ Menos intrusivo que login completo  
✅ Mantiene la sesión sin pedir credenciales  
✅ Fallback cuando refresh token no está disponible  

### 3. Verificación y Refresh Automático

**Archivo:** `/src/infrastructure/firebase/auth-service.ts`

```typescript
async checkAndRefreshGoogleToken(userId: string): Promise<boolean> {
  // 1. Verifica expiración del token
  // 2. Si expira en < 10 min, intenta refresh
  // 3. Si refresh falla, intenta re-auth silenciosa
  // 4. Si todo falla, cierra sesión
}
```

**Lógica de decisión:**
```
¿Token expira en < 10 min?
        ↓
      ┌─┴─┐
     SÍ  NO
      │   │
      │  ✅ Token válido
      │   
      ↓
Intentar refresh con endpoint
      ↓
  ¿Exitoso?
      ↓
  ┌───┴───┐
 SÍ      NO
  │       │
 ✅      ¿Requiere re-auth?
  │       │
  │      ┌┴┐
  │     SÍ NO
  │      │  │
  │  Silent │
  │  Re-auth│
  │      │  ❌
  │   ¿Exitoso?
  │      │
  │   ┌──┴──┐
  │  SÍ    NO
  │   │     │
  │  ✅    ❌
  │        Logout
  │
  └────────┘
```

### 4. Monitoreo Periódico en useAuth

**Archivo:** `/src/containers/useAuth.ts`

```typescript
useEffect(() => {
  const checkAndRefreshToken = async () => {
    const isValid = await firebaseAuthService.checkAndRefreshGoogleToken(user.id);
    
    if (isValid) {
      // Recargar entidad del usuario con token actualizado
      const entity = await loadUserEntity(user.id);
      setUserEntity(entity);
    }
  };

  // Verificar inmediatamente
  checkAndRefreshToken();

  // Verificar cada 5 minutos
  const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

  return () => clearInterval(intervalId);
}, [user]);
```

**Ventajas:**
✅ Verificación automática cada 5 minutos  
✅ Actualiza el userEntity con nuevo token  
✅ Transparente para el usuario  

### 5. Refresh en useGoogleFormsIntegration

**Archivo:** `/src/containers/useGoogleFormsIntegration.ts`

```typescript
const refreshAccessToken = useCallback(async (): Promise<string | null> => {
  // Llama al endpoint de refresh
  const response = await fetch('/api/auth/refresh-google-token', {
    method: 'POST',
    body: JSON.stringify({ userId: userEntity.id }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.accessToken;
  }
  
  // Si falla, solicita re-autenticación
  return null;
}, [userEntity]);
```

## 📊 Flujo Completo

```
Usuario logueado
      ↓
Usa la aplicación
      ↓
Token con expiración: 09:00 + 1h = 10:00
      ↓
Verificación periódica (cada 5 min)
      ↓
09:50 - Verificación detecta: token expira en 10 min
      ↓
Intenta Refresh Automático
      ↓
┌─────────────────────────────┐
│ Endpoint: refresh-google-token│
│ 1. Busca refresh token       │
│ 2. Llama API de Google       │
│ 3. Obtiene nuevo access token│
│ 4. Actualiza Firestore       │
└──────────┬──────────────────┘
           ↓
    ¿Exitoso?
           ↓
      ┌────┴────┐
     SÍ        NO
      │         │
 ✅ Token      ¿Requiere
   refrescado   re-auth?
      │         │
      │      ┌──┴──┐
      │     SÍ    NO
      │      │     │
      │  Silent   Error
      │  Re-auth   │
      │      │     ❌
      │   ¿Exitoso?
      │      │
      │   ┌──┴──┐
      │  SÍ    NO
      │   │     │
      │  ✅    ❌
      │        Logout
      │
Usuario sigue usando la app
sin interrupciones ✅
```

## 🔑 Configuración Requerida

### Variables de Entorno

Agregar al archivo `.env.local`:

```bash
# Google OAuth Client Secret (necesario para refresh tokens)
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui

# Ya existentes (confirmar que están)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
```

### Obtener Google Client Secret

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Seleccionar tu proyecto
3. Ir a **APIs & Services** > **Credentials**
4. Buscar tu **OAuth 2.0 Client ID**
5. Ver/Copiar el **Client Secret**
6. Agregarlo a `.env.local`

## 📝 Configuración de Google OAuth

Para que el refresh funcione, el OAuth de Google debe estar configurado con:

```typescript
// Ya configurado en auth-service.ts
googleProvider.setCustomParameters({
  prompt: 'consent',       // Forzar consentimiento
  access_type: 'offline'   // Obtener refresh token
});
```

**Importante:** Con `access_type: 'offline'`, Google devuelve un refresh token la primera vez que el usuario hace login.

## ⚙️ Parámetros Configurables

| Parámetro | Valor Actual | Descripción |
|-----------|--------------|-------------|
| Tiempo de refresh anticipado | 10 minutos | Tiempo antes de expirar para refrescar |
| Intervalo de verificación | 5 minutos | Frecuencia de verificación automática |
| Duración de access token | 1 hora | Configurado por Google |
| Silent reauth prompt | `none` | Intenta sin mostrar pantalla |

## 🎯 Casos de Uso

### ✅ Caso 1: Refresh Exitoso (Ideal)
```
09:00 - Login (token válido hasta 10:00)
09:50 - Verificación detecta: expira en 10 min
09:50 - Refresh automático exitoso
09:50 - Nuevo token válido hasta 10:50
       Usuario NO se entera, sigue usando la app ✅
10:45 - Nueva verificación, nuevo refresh
       Ciclo continúa...
```

### ✅ Caso 2: Silent Re-Auth (Fallback)
```
09:00 - Login (sin refresh token)
09:50 - Verificación detecta expiración
09:50 - No hay refresh token
09:50 - Intenta silent re-auth
09:50 - Popup rápido (pre-selecciona cuenta)
09:50 - Nuevos tokens obtenidos ✅
       Usuario ve popup breve pero no necesita hacer nada
```

### ⚠️ Caso 3: Falla Total (Excepcional)
```
09:00 - Login
09:50 - Verificación detecta expiración
09:50 - Refresh falla (refresh token revocado)
09:50 - Silent re-auth falla (usuario cerró popup)
09:50 - Logout automático ❌
       Usuario debe volver a loguearse
```

### ✅ Caso 4: Durante Creación de Formulario
```
Usuario creando formulario
       ↓
Token próximo a expirar
       ↓
Refresh automático en background
       ↓
Usuario sigue editando sin interrupciones ✅
       ↓
Formulario se crea con nuevo token
```

## 🔒 Seguridad

**Protecciones implementadas:**

1. ✅ **Refresh token nunca se expone al cliente**
   - Almacenado solo en Firestore (backend)
   - Endpoint usa server-side request a Google

2. ✅ **Validación de usuario**
   - Solo el usuario propietario puede refrescar su token
   - userId validado en cada request

3. ✅ **Manejo de revocación**
   - Detecta cuando usuario revoca permisos
   - Solicita re-autenticación completa

4. ✅ **Timeout y límites**
   - Verificación cada 5 min (no sobrecarga)
   - Refresh solo cuando necesario (< 10 min)

## 📊 Comparación: Antes vs Ahora

| Aspecto | ANTES | AHORA |
|---------|-------|-------|
| **Token expira** | ❌ Logout forzado | ✅ Refresh automático |
| **UX** | ⚠️ Usuario debe re-loguearse | ✅ Sin interrupciones |
| **Sesión larga** | ❌ Máximo 1 hora | ✅ Indefinida (con refreshes) |
| **Cierre de pestaña** | ❌ Pierde sesión | ⚠️ Sigue perdiendo (sessionPersistence) |
| **Revocación permisos** | ❌ Error en APIs | ✅ Detectado y maneja |

## ⚠️ Limitaciones

1. **SessionPersistence activo**
   - Sesión se pierde al cerrar pestaña
   - Refresh solo funciona mientras pestaña abierta

2. **Primer login**
   - Refresh token se obtiene en primer login
   - Usuarios antiguos podrían no tenerlo

3. **Popup en Silent Re-Auth**
   - Puede aparecer popup breve
   - Usuario puede cerrar lo (fallará)

## 🚀 Mejoras Futuras

- [ ] Notificar al usuario cuando se refresque token
- [ ] Agregar indicador de "refrescando sesión..."
- [ ] Migrar a local persistence con refresh automático
- [ ] Implementar refresh proactivo (antes de 10 min)
- [ ] Agregar analytics de refreshes exitosos/fallidos

---

**Fecha:** 6 de octubre de 2025  
**Estado:** ✅ Implementado  
**Prioridad:** 🟢 Alta (Mejora UX significativa)
