# Sistema de Créditos - FastForm

## Descripción General

El sistema de créditos de FastForm permite a los usuarios comprar y consumir créditos para crear formularios. Cada formulario creado consume 1 crédito, y los usuarios pueden comprar créditos a través de Mercado Pago.

## Arquitectura

### Componentes Principales

1. **CreditsService** (`src/infrastructure/firebase/credits-service.ts`)
   - Maneja todas las operaciones de créditos en Firestore
   - Operaciones CRUD para créditos de usuario
   - Sincronización en tiempo real

2. **useCredits Hook** (`src/containers/useCredits.ts`)
   - Hook personalizado para manejar créditos en componentes React
   - Sincronización automática con Firestore
   - Estado local y operaciones de créditos

3. **useFormCreation Hook** (`src/containers/useFormCreation.ts`)
   - Hook para crear formularios con verificación de créditos
   - Consume créditos automáticamente al crear formularios

4. **API de Verificación** (`src/app/api/mercadopago/verify-payment/route.ts`)
   - Verifica pagos de Mercado Pago
   - Agrega créditos a usuarios después de pagos exitosos

## Estructura de Datos

### Colección: `userCredits`

```typescript
interface UserCredits {
  userId: string;           // UID del usuario de Firebase Auth
  credits: number;          // Créditos disponibles actualmente
  updatedAt: Date;          // Última actualización
  history: CreditTransaction[]; // Historial de transacciones
}

interface CreditTransaction {
  id: string;               // ID único de la transacción
  type: 'purchase' | 'use'; // Tipo de transacción
  amount: number;           // Cantidad de créditos
  date: Date;               // Fecha de la transacción
  paymentId?: string;       // ID de pago (para compras)
  description?: string;     // Descripción opcional
  status: 'completed' | 'pending' | 'failed';
}
```

## Flujo de Compra

### 1. Selección de Plan
- Usuario selecciona cantidad de créditos en `/pricing`
- Se guarda información de compra en `sessionStorage`

### 2. Checkout
- Se crea preferencia en Mercado Pago
- Usuario es redirigido al checkout de Mercado Pago

### 3. Procesamiento de Pago
- Usuario regresa a `/checkout/success`
- Se verifica el pago con Mercado Pago
- Si está aprobado, se agregan créditos a Firestore

### 4. Verificación
- API `/api/mercadopago/verify-payment` verifica el pago
- Solo se procesan pagos con estado "approved"
- Se actualiza la colección `userCredits` en Firestore

## Flujo de Consumo

### 1. Verificación de Créditos
- Antes de crear un formulario, se verifica disponibilidad
- Se requiere al menos 1 crédito disponible

### 2. Creación del Formulario
- Se ejecuta la lógica de creación del formulario
- Si es exitosa, se consume 1 crédito

### 3. Actualización de Saldo
- Se descuenta 1 crédito del campo `credits`
- Se registra la transacción en `history`

## Operaciones del Servicio

### CreditsService

```typescript
// Obtener créditos del usuario
static async getUserCredits(userId: string): Promise<UserCredits | null>

// Inicializar créditos (para nuevos usuarios)
static async initializeUserCredits(userId: string): Promise<UserCredits>

// Agregar créditos después de compra
static async addCreditsAfterPurchase(
  userId: string, 
  purchase: CreditPurchase, 
  paymentId: string
): Promise<void>

// Consumir créditos
static async consumeCredits(
  userId: string, 
  usage: CreditUsage
): Promise<boolean>

// Verificar disponibilidad
static async hasEnoughCredits(
  userId: string, 
  requiredAmount: number = 1
): Promise<boolean>

// Sincronización en tiempo real
static subscribeToUserCredits(
  userId: string, 
  callback: (credits: UserCredits | null) => void
): () => void
```

## Hooks Disponibles

### useCredits

```typescript
const {
  credits,              // Datos completos de créditos
  loading,              // Estado de carga
  error,                // Error si existe
  currentCredits,       // Créditos disponibles
  totalPurchased,       // Total comprado
  totalUsed,            // Total usado
  usagePercentage,      // Porcentaje de uso
  consumeCredits,       // Función para consumir
  hasEnoughCredits,     // Verificar disponibilidad
  refreshCredits,       // Refrescar datos
  clearError            // Limpiar errores
} = useCredits();
```

### useFormCreation

```typescript
const {
  isCreating,           // Estado de creación
  error,                // Error si existe
  createForm,           // Crear formulario
  checkCreditsAvailability, // Verificar créditos
  clearError            // Limpiar errores
} = useFormCreation();
```

## Seguridad

### Validaciones del Backend
- Verificación de autenticación en todas las APIs
- Validación de pagos de Mercado Pago antes de agregar créditos
- Uso de Firebase Admin SDK para operaciones seguras

### Prevención de Manipulación
- Verificación de estado de pago en Mercado Pago
- Cálculo de créditos en el backend
- Transacciones atómicas en Firestore

## Manejo de Errores

### Tipos de Error
1. **Créditos Insuficientes**: Usuario intenta crear formulario sin créditos
2. **Error de Pago**: Pago no aprobado en Mercado Pago
3. **Error de Red**: Problemas de conectividad
4. **Error de Autenticación**: Usuario no autenticado

### Recuperación
- Reintentos automáticos para operaciones fallidas
- Mensajes de error claros para el usuario
- Opciones de recuperación (comprar más créditos, contactar soporte)

## Monitoreo y Logs

### Logs del Sistema
- ✅ Operaciones exitosas
- ❌ Errores y fallos
- ⚠️ Advertencias y estados inesperados

### Métricas
- Créditos comprados vs. utilizados
- Tasa de conversión de pagos
- Uso promedio por usuario

## Configuración

### Variables de Entorno Requeridas
```bash
MERCADOPAGO_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_BASE_URL=your_base_url
```

### Configuración de Firebase
- Autenticación habilitada
- Firestore con reglas de seguridad apropiadas
- Índices para consultas eficientes

## Próximas Mejoras

1. **Sistema de Suscripciones**: Créditos recurrentes mensuales
2. **Créditos Gratuitos**: Bonificación por referidos o uso
3. **Pack Empresarial**: Créditos compartidos entre equipos
4. **Analytics Avanzado**: Métricas detalladas de uso
5. **Notificaciones**: Alertas de créditos bajos

## Troubleshooting

### Problemas Comunes

1. **Créditos no se actualizan**
   - Verificar conexión a Firestore
   - Revisar logs de la API de verificación
   - Confirmar estado del pago en Mercado Pago

2. **Error de autenticación**
   - Verificar estado de sesión del usuario
   - Revisar configuración de Firebase Auth
   - Limpiar caché del navegador

3. **Pago no procesado**
   - Verificar webhooks de Mercado Pago
   - Revisar logs de la API
   - Confirmar configuración de URLs de retorno

### Comandos de Debug

```bash
# Ver logs de la aplicación
npm run dev

# Verificar estado de Firestore
# Usar Firebase Console

# Verificar pagos de Mercado Pago
# Usar Mercado Pago Dashboard
``` 