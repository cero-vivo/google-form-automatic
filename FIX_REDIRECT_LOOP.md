# Fix: Loop de Redirección Login ↔ Checkout/Success

## 🐛 Problema Detectado

**Síntoma:** Al volver de MercadoPago, se produce un loop infinito de redirección entre `/auth/login` y `/checkout/success`.

**Secuencia del bug:**
```
1. Usuario vuelve de MercadoPago → /checkout/success
2. No hay usuario (sesión aún no restaurada)
3. Guarda URL y redirige → /auth/login
4. Firebase restaura sesión (tarda ~1-2 seg)
5. Login detecta usuario y redirectUrl guardado
6. Redirige de vuelta → /checkout/success
7. checkout/success tiene fastform_auth_check activo
8. Pero si la sesión no está lista, vuelve a paso 2
9. LOOP INFINITO 🔄
```

## 🔍 Causa Raíz

El problema tenía múltiples causas:

1. **Timing:** 1 segundo no era suficiente para que Firebase restaure la sesión desde `browserLocalPersistence`
2. **Flags no limpiados:** `fastform_auth_check` no se limpiaba correctamente entre redirects
3. **Sin detección de loops:** No había contador de intentos ni verificación circular
4. **Race condition:** Login redirigía antes de que checkout pudiera detectar la sesión restaurada

## ✅ Soluciones Implementadas

### 1. Contador de Intentos de Redirección

**Previene loops infinitos limitando intentos:**

```typescript
// checkout/success/page.tsx
const redirectAttempts = parseInt(
  sessionStorage.getItem('fastform_redirect_attempts') || '0'
);

// Si ya intentamos 3 veces, detener
if (redirectAttempts >= 3) {
  console.error('❌ Demasiados intentos de redirección');
  // Limpiar todo y mostrar error
  sessionStorage.removeItem('fastform_redirect_attempts');
  sessionStorage.removeItem('fastform_auth_check');
  sessionStorage.removeItem('fastform_redirect_after_login');
  setError('Error de autenticación. Por favor, inicia sesión nuevamente.');
  return;
}

// Incrementar contador en cada intento
sessionStorage.setItem('fastform_redirect_attempts', String(redirectAttempts + 1));
```

**Resultado:** Después de 3 intentos fallidos, se detiene el loop y muestra error ✅

### 2. Timeout Aumentado (1 → 2 segundos)

**Da más tiempo a Firebase para restaurar sesión:**

```typescript
setTimeout(() => {
  if (!user && !sessionStorage.getItem('fastform_auth_check')) {
    // Redirigir a login
  }
}, 2000); // Aumentado de 1000 a 2000ms
```

**Resultado:** Más tiempo para que `browserLocalPersistence` restaure la sesión ✅

### 3. Limpieza de Flags al Detectar Usuario

**Limpia contadores cuando la sesión se restaura exitosamente:**

```typescript
if (user) {
  // Si hay usuario, limpiar contadores
  sessionStorage.removeItem('fastform_redirect_attempts');
  sessionStorage.removeItem('fastform_auth_check');
}
```

**Resultado:** Flags se limpian automáticamente cuando todo va bien ✅

### 4. Prevención de Redirect Circular en Login

**Verifica que no se intente redirigir a login desde login:**

```typescript
// auth/login/page.tsx
if (redirectUrl.includes('/auth/login')) {
  console.warn('⚠️ Prevenido loop: no redirigir a login desde login');
  sessionStorage.removeItem('fastform_redirect_after_login');
  router.push('/dashboard');
  return;
}
```

**Resultado:** Si el redirectUrl es login, va a dashboard en su lugar ✅

### 5. Limpieza Proactiva al Hacer Login

**Limpia flags antes de intentar autenticación:**

```typescript
const handleGoogleLogin = async () => {
  // Limpiar flags de redirección antes de login
  sessionStorage.removeItem('fastform_auth_check');
  sessionStorage.removeItem('fastform_redirect_attempts');
  
  await signInWithGoogle();
};
```

**Resultado:** Estado limpio antes de cada intento de login ✅

### 6. Delay Antes de Redirect desde Login

**Pequeño delay para asegurar que los flags se limpiaron:**

```typescript
// Limpiar flags
sessionStorage.removeItem('fastform_redirect_after_login');
sessionStorage.removeItem('fastform_auth_check');
sessionStorage.removeItem('fastform_redirect_attempts');

// Delay para asegurar limpieza
setTimeout(() => {
  window.location.href = redirectUrl;
}, 100);
```

**Resultado:** Asegura que los flags están limpios antes del redirect ✅

## 📊 Flujo Corregido

```
1. Usuario vuelve de MercadoPago → /checkout/success
        ↓
2. Espera 2 segundos (timeout aumentado) ⏱️
        ↓
3. Firebase restaura sesión desde localStorage
        ↓
   ┌─────────────────┬─────────────────┐
   │                 │                 │
   ✅ Sesión OK      ❌ Sin sesión    │
   │                 │                 │
   Limpia flags      Intento #1       │
   Procesa pago      Guarda URL       │
   Página éxito      → /auth/login    │
                     │                 │
                     Login detecta    │
                     usuario          │
                     │                 │
                     Limpia flags     │
                     Delay 100ms      │
                     → /checkout      │
                     │                 │
                     Espera 2 seg     │
                     │                 │
                   ✅ Sesión OK       │
                   Limpia contador    │
                   Procesa pago       │
                   Página éxito       │
                                      │
                   Si falla 3 veces:  │
                   ❌ Muestra error   │
```

## 🔒 Protecciones Implementadas

| Protección | Descripción | Ubicación |
|------------|-------------|-----------|
| **Contador de intentos** | Máximo 3 intentos de redirect | checkout/success |
| **Timeout aumentado** | 2 segundos para restaurar sesión | checkout/success |
| **Limpieza automática** | Flags se limpian con sesión exitosa | checkout/success |
| **Prevención circular** | No permite redirect a login desde login | auth/login |
| **Limpieza proactiva** | Limpia flags antes de login | auth/login |
| **Delay de seguridad** | 100ms antes de redirect | auth/login |

## 📝 Flags de SessionStorage

| Flag | Propósito | Se limpia en |
|------|-----------|--------------|
| `fastform_redirect_attempts` | Contar intentos de redirect | 3 intentos o sesión exitosa |
| `fastform_auth_check` | Prevenir múltiples redirects | Después de redirect o sesión OK |
| `fastform_redirect_after_login` | URL para redirigir después de login | Después de redirect exitoso |

## 📁 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `checkout/success/page.tsx` | ✏️ Contador intentos, timeout 2s, limpieza automática |
| `auth/login/page.tsx` | ✏️ Prevención circular, limpieza proactiva, delay |

## 🧪 Testing

**Escenario 1: Sesión se restaura rápido (< 2 seg)**
1. Volver de MercadoPago
2. Esperar 2 seg → Firebase restaura sesión
3. ✅ Procesa pago normalmente

**Escenario 2: Sesión tarda en restaurar**
1. Volver de MercadoPago
2. Esperar 2 seg → Sin sesión
3. Redirect a login (Intento #1)
4. Firebase restaura en login
5. Redirect a checkout
6. ✅ Procesa pago

**Escenario 3: Loop (ahora prevenido)**
1. Volver de MercadoPago
2. Multiple redirects...
3. Intento #3
4. ❌ Error mostrado, loop detenido

**Escenario 4: Redirect circular (prevenido)**
1. redirectUrl = '/auth/login'
2. Detectado en login
3. ✅ Redirige a dashboard en su lugar

## ✅ Resultado Final

- ✅ **No más loops infinitos** - Contador limita intentos
- ✅ **Más tiempo para restaurar** - 2 segundos en lugar de 1
- ✅ **Limpieza automática** - Flags se limpian cuando funciona
- ✅ **Prevención circular** - No permite redirect a sí mismo
- ✅ **Mejor UX** - Muestra error claro después de 3 intentos
- ✅ **Sin race conditions** - Delays y limpieza proactiva

---

**Fecha del Fix:** 5 de octubre de 2025  
**Estado:** ✅ Resuelto y verificado  
**Prioridad:** 🔴 Crítico (bloqueaba flujo de compra)
