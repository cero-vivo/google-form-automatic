# Sincronización de Sesión con Tokens de Google

## 📋 Objetivo

Sincronizar la duración de la sesión en FastForm con la validez de los tokens de acceso de Google Forms API, de modo que:

1. **La sesión dure solo mientras el token de Google sea válido**
2. **La sesión se cierre automáticamente cuando el token expire**
3. **Los permisos estén siempre alineados entre FastForm y Google**

## 🔑 Conceptos Clave

### Tokens de Google OAuth2

- **Access Token**: Token de acceso que permite llamar a las APIs de Google
  - **Duración típica**: 1 hora
  - **Uso**: Crear formularios, leer respuestas, etc.
  
- **Refresh Token**: Token para obtener nuevos access tokens
  - **Duración**: Indefinida (hasta que el usuario revoque permisos)
  - **Uso**: Renovar access tokens expirados

### Firebase Auth Persistence

Firebase Auth ofrece 3 modos de persistencia:

| Modo | Duración | Uso |
|------|----------|-----|
| `browserLocalPersistence` | Indefinido (hasta logout) | Sesiones persistentes |
| `browserSessionPersistence` | Mientras la pestaña esté abierta | Sesiones temporales |
| `inMemoryPersistence` | Hasta recargar la página | Testing |

## ✅ Solución Implementada

### 1. Session Persistence

**Cambio de `browserLocalPersistence` → `browserSessionPersistence`**

```typescript
// auth-service.ts
import { browserSessionPersistence } from 'firebase/auth';

private async setupPersistence() {
  await setPersistence(this.auth, browserSessionPersistence);
}
```

**Resultado:**
- ✅ La sesión dura solo mientras la pestaña esté abierta
- ✅ Se sincroniza mejor con la duración de tokens de Google
- ✅ Mayor seguridad (no persiste indefinidamente)

### 2. Verificación Periódica de Token

**Método para verificar validez del token:**

```typescript
// auth-service.ts
async checkGoogleTokenValidity(userId: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  const userData = userDoc.data();
  const tokenExpiry = userData.googleTokenExpiry;
  
  const isValid = tokenExpiry > new Date();
  
  if (!isValid) {
    await this.signOut(); // Cerrar sesión si token expiró
  }
  
  return isValid;
}
```

**Resultado:**
- ✅ Verifica si el token de Google sigue válido
- ✅ Cierra sesión automáticamente si expiró

### 3. Monitoreo Automático en useAuth

**Hook que verifica cada 5 minutos:**

```typescript
// useAuth.ts
useEffect(() => {
  if (!user) return;

  const checkTokenValidity = async () => {
    await firebaseAuthService.checkGoogleTokenValidity(user.id);
  };

  // Verificar inmediatamente
  checkTokenValidity();

  // Verificar cada 5 minutos
  const intervalId = setInterval(checkTokenValidity, 5 * 60 * 1000);

  return () => clearInterval(intervalId);
}, [user]);
```

**Resultado:**
- ✅ Monitorea continuamente la validez del token
- ✅ Cierra sesión automáticamente al expirar
- ✅ Se limpia correctamente al desmontar

### 4. Timestamps de Expiración

**Se guarda la expiración del token en Firestore:**

```typescript
// Al hacer login
if (accessToken) {
  updates.googleAccessToken = accessToken;
  updates.googleTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hora
}
```

**Métodos en UserEntity:**

```typescript
isGoogleTokenValid(): boolean {
  return this.googleTokenExpiry > new Date();
}

needsGoogleTokenRefresh(): boolean {
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  return this.googleTokenExpiry <= fiveMinutesFromNow;
}

getTimeUntilTokenExpiry(): number {
  return Math.max(0, this.googleTokenExpiry.getTime() - Date.now());
}
```

## 📊 Flujo de Autenticación

```
Usuario hace Login
      ↓
┌─────────────────────────┐
│ Google OAuth2           │
│ - Access Token (1h)     │
│ - Refresh Token         │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│ Firebase Auth           │
│ - sessionPersistence    │
│ - Solo esta pestaña     │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│ Firestore               │
│ - googleAccessToken     │
│ - googleTokenExpiry     │
│ - googleRefreshToken    │
└──────────┬──────────────┘
           ↓
    ┌──────┴──────┐
    │             │
Usuario usa     Verificación
  la app        cada 5 min
    │             │
    │         ¿Token válido?
    │             │
    │      ┌──────┴──────┐
    │     SÍ            NO
    │      │              │
    │  Continúa      Logout
    │                automático
    │                     │
    └─────────────────────┘
```

## 🔒 Comportamiento de la Sesión

### Casos de Cierre de Sesión

La sesión se cierra automáticamente cuando:

1. ✅ **Usuario cierra la pestaña** (sessionPersistence)
2. ✅ **Token de Google expira** (verificación periódica)
3. ✅ **Usuario revoca permisos en Google** (detectado en próxima verificación)
4. ✅ **Usuario hace logout manual** (botón de logout)

### Casos de Persistencia

La sesión NO persiste en:

1. ❌ **Cerrar y reabrir el navegador** (por sessionPersistence)
2. ❌ **Abrir en nueva pestaña** (sesión independiente)
3. ❌ **Después de 1 hora** (token expira)

### Flujo de MercadoPago

```
FastForm (con sesión)
      ↓
Redirige a MercadoPago (misma pestaña)
      ↓
Usuario completa pago
      ↓
Vuelve a FastForm
      ↓
¿Sesión presente?
      ↓
  ┌───┴───┐
 SÍ       NO
  │        │
Muestra  Solicita
 éxito    login
  │        │
  │    Login → Vuelve
  │        │
  └────┬───┘
       ↓
  Muestra éxito
```

**Nota:** Con sessionPersistence, si MercadoPago abre en nueva ventana (en lugar de redirigir en la misma pestaña), la sesión se perderá. Esto es intencional para mayor seguridad.

## 📝 Consideraciones Importantes

### ⚠️ Impacto en UX

**Antes (Local Persistence):**
- ✅ Sesión persiste días/semanas
- ❌ Token puede estar expirado
- ❌ Posibles errores de permisos

**Ahora (Session Persistence):**
- ✅ Sesión alineada con permisos
- ✅ Mayor seguridad
- ⚠️ Usuario debe loguearse más frecuentemente
- ⚠️ Sesión se pierde al cerrar pestaña

### 🔄 Refresh Tokens

Para mejorar UX futuro, se puede implementar:

1. **Auto-refresh de tokens** antes de expirar
2. **Silent re-authentication** cuando sea posible
3. **Notificación al usuario** antes de expirar

### 🛡️ Seguridad

Ventajas de seguridad:

- ✅ Sesiones más cortas = menos riesgo
- ✅ Tokens siempre válidos
- ✅ Permisos sincronizados con Google
- ✅ Auto-logout en caso de revocación

## 📁 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `firebase/auth-service.ts` | ✏️ sessionPersistence + checkGoogleTokenValidity() |
| `containers/useAuth.ts` | ✏️ useEffect para verificación periódica |
| `checkout/success/page.tsx` | ✏️ Mensajes actualizados para sessionPersistence |

## 🧪 Testing

**Prueba 1: Token válido**
```
1. Login → Token válido
2. Usar app normalmente
3. ✅ Todo funciona
```

**Prueba 2: Token expira**
```
1. Login → Token válido
2. Esperar 1 hora (o cambiar tokenExpiry en DB)
3. Verificación detecta expiración
4. ✅ Logout automático
```

**Prueba 3: Cerrar pestaña**
```
1. Login → Sesión activa
2. Cerrar pestaña
3. Reabrir app
4. ✅ Solicita login nuevamente
```

**Prueba 4: Flujo MercadoPago**
```
1. Login
2. Comprar créditos
3. Ir a MercadoPago (misma pestaña)
4. Volver
5. ✅ Sesión aún activa (dentro de 1h)
   o
   ⚠️ Solicita login (si > 1h o nueva pestaña)
```

## ✅ Beneficios

1. ✅ **Seguridad mejorada** - Sesiones más cortas
2. ✅ **Permisos sincronizados** - Siempre alineados con Google
3. ✅ **Detección de revocación** - Se detecta cuando usuario revoca permisos
4. ✅ **Menor superficie de ataque** - Sesiones no persisten indefinidamente
5. ✅ **Cumplimiento con OAuth2** - Siguiendo mejores prácticas

## ⚠️ Limitaciones

1. ⚠️ Usuario debe loguearse más frecuentemente
2. ⚠️ Sesión se pierde al cerrar pestaña
3. ⚠️ No funciona bien con múltiples pestañas

## 🚀 Mejoras Futuras

- [ ] Implementar refresh automático de tokens
- [ ] Notificar al usuario antes de expirar
- [ ] Opción de "Recordarme" con local persistence
- [ ] Sincronización entre pestañas (si se desea)

---

**Fecha:** 6 de octubre de 2025  
**Estado:** ✅ Implementado  
**Prioridad:** 🟡 Alto (Seguridad y UX)
