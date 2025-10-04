# Fix: Duplicación de Créditos en Compras

## 🐛 Problema Detectado

Al realizar una compra de créditos, se estaban agregando el doble de créditos de los que se pagaban. Por ejemplo, al comprar 1 crédito, se acreditaban 2 créditos.

### Causa Raíz

El sistema tenía **DOS flujos** que agregaban créditos para la misma transacción:

1. **Frontend** (`/checkout/success`) → llamaba a `/api/mercadopago/verify-payment` → agregaba créditos ✅
2. **Webhook de MercadoPago** → `/api/mercadopago/webhooks` → agregaba créditos **otra vez** ✅

Ambas llamadas se ejecutaban de forma independiente y casi simultánea, causando la duplicación.

## ✅ Solución Implementada

### 1. Flujo de Pago Único (Solo Webhook)

**Ahora los créditos son agregados ÚNICAMENTE por el webhook de MercadoPago:**

- ✅ El webhook (`/api/mercadopago/webhooks`) es el único responsable de agregar créditos
- ✅ El frontend solo verifica el estado del pago y espera a que el webhook procese
- ✅ El endpoint `/api/mercadopago/verify-payment` fue modificado para **NO agregar créditos**

### 2. Verificación de Idempotencia Mejorada

**Se agregaron múltiples capas de protección:**

#### En `credits-service.ts`:
```typescript
// Verificación DOBLE antes de agregar créditos
const docSnap = await getDoc(userCreditsRef);
if (docSnap.exists()) {
  const existingHistory = docSnap.data().history || [];
  const alreadyProcessed = existingHistory.some(
    (transaction: any) => transaction.paymentId === paymentId
  );
  
  if (alreadyProcessed) {
    console.warn(`⚠️ Pago ${paymentId} ya fue procesado`);
    return; // Salir sin agregar créditos
  }
}
```

#### En el webhook:
```typescript
// Verificación antes de procesar
const userCredits = await CreditsService.getUserCredits(userId);
const alreadyProcessed = userCredits?.history?.some(
  (transaction: any) => transaction.paymentId === paymentId
);

if (alreadyProcessed) {
  console.log('⚠️ Pago ya procesado - evitando duplicación');
  return NextResponse.json({ status: 'success', message: 'Pago ya procesado' });
}
```

### 3. Frontend con Polling

**El frontend ahora hace polling para verificar cuando el webhook procesa:**

```typescript
// Hacer polling para verificar si los créditos fueron agregados
let attempts = 0;
const maxAttempts = 15; // 15 segundos máximo

while (attempts < maxAttempts && !creditsAdded) {
  const checkResponse = await fetch(
    `/api/credits/check-payment?paymentId=${paymentId}&userId=${user.id}`
  );
  const checkResult = await checkResponse.json();
  
  if (checkResult.processed) {
    creditsAdded = true;
    break;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  attempts++;
}
```

### 4. Nuevo Endpoint de Verificación

**Creado `/api/credits/check-payment`:**
- Solo verifica si un pago fue procesado
- NO agrega créditos
- Usado por el frontend para polling

## 📊 Flujo Corregido

```
Usuario Compra
    ↓
MercadoPago Checkout
    ↓
Pago Aprobado
    ↓
┌─────────────────────────┬─────────────────────────┐
│                         │                         │
│  Frontend               │  MercadoPago Webhook    │
│  (Redirige a success)   │  (Notifica)            │
│       ↓                 │       ↓                 │
│  Hace Polling           │  Verifica Idempotencia │
│  cada 1 seg             │       ↓                 │
│       ↓                 │  Agrega Créditos ✅     │
│  Detecta créditos       │  (ÚNICO LUGAR)         │
│  agregados              │                         │
│       ↓                 │                         │
└─────────────────────────┴─────────────────────────┘
              ↓
    Muestra página de éxito
```

## 🔒 Garantías de Seguridad

1. **Idempotencia por PaymentId**: Cada `paymentId` solo puede procesar créditos una vez
2. **Verificación Doble**: Se verifica en el webhook Y en el servicio de créditos
3. **Único Punto de Entrada**: Solo el webhook agrega créditos
4. **Logging Detallado**: Todos los intentos de duplicación se registran

## 🧪 Testing Recomendado

1. Realizar una compra nueva y verificar que se agregue la cantidad correcta
2. Recargar la página de éxito y verificar que no se agreguen créditos adicionales
3. Simular que el webhook llega dos veces (MercadoPago a veces reintenta)
4. Verificar logs para confirmar que se detectan intentos de duplicación

## 📝 Archivos Modificados

1. `/src/app/checkout/success/page.tsx` - Removida llamada a verify-payment, agregado polling
2. `/src/app/api/mercadopago/verify-payment/route.ts` - Deshabilitada adición de créditos
3. `/src/app/api/mercadopago/webhooks/route.ts` - Mejorada verificación de idempotencia
4. `/src/infrastructure/firebase/credits-service.ts` - Agregada verificación doble
5. `/src/app/api/credits/check-payment/route.ts` - **NUEVO** endpoint para verificación

## ⚠️ Notas Importantes

- El webhook puede tardar algunos segundos en procesar (normal)
- El frontend espera hasta 15 segundos para verificar que se procesaron los créditos
- Si el webhook falla, MercadoPago reintentará automáticamente
- La verificación de idempotencia previene que reintentos causen duplicaciones
