# 💳 Sistema de Suscripciones con Stripe

## 🎯 Descripción

Este sistema implementa un modelo de suscripciones completo que permite a los usuarios:
- **Crear formularios** con límites mensuales según su plan
- **Suscribirse** a diferentes planes de pago
- **Gestionar** sus suscripciones (upgrade, downgrade, cancelación)
- **Rastrear** su uso mensual de formularios

## 🏗️ Arquitectura

### Entidades del Dominio
- **Plan**: Define características y límites de cada plan
- **Subscription**: Maneja el estado de la suscripción del usuario
- **User**: Extendido con información de suscripción y límites

### Servicios
- **StripeService**: Integración con Stripe para pagos
- **PlanService**: Gestión de planes y límites
- **SubscriptionService**: Manejo de suscripciones

### APIs
- `POST /api/stripe/create-subscription` - Crear suscripción
- `POST /api/stripe/webhooks` - Webhooks de Stripe
- `GET /api/plans` - Obtener planes disponibles
- `GET /api/user/usage` - Estadísticas de uso del usuario

## 🚀 Características

### Planes Disponibles
1. **Free** - 5 formularios/mes
2. **Basic** - 25 formularios/mes ($9.99/mes)
3. **Pro** - 100 formularios/mes ($19.99/mes)
4. **Enterprise** - Ilimitado ($49.99/mes)

### Funcionalidades por Plan
- **Exportar datos**: Basic, Pro, Enterprise
- **Personalizar marca**: Pro, Enterprise
- **Soporte prioritario**: Pro, Enterprise
- **Analytics avanzados**: Pro, Enterprise
- **Acceso a API**: Solo Enterprise

### Límites Mensuales
- Los contadores se resetean automáticamente cada mes
- Verificación antes de crear formularios
- Alertas cuando se acerca al límite (80% de uso)

## 📋 Instalación

### 1. Dependencias
```bash
npm install stripe @stripe/stripe-js
```

### 2. Variables de Entorno
Crea `.env.local` con:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Precios de Stripe
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
```

### 3. Configuración de Stripe
Sigue la guía en `STRIPE_SETUP.md` para:
- Crear cuenta en Stripe
- Configurar productos y precios
- Configurar webhooks
- Obtener API keys

## 🔧 Uso

### Crear Suscripción
```typescript
import { SubscriptionService } from '@/application/services/subscription-service';

const subscription = await SubscriptionService.createSubscription({
  userId: 'user123',
  planId: 'pro',
  stripePriceId: 'price_pro_123',
  metadata: { source: 'web' }
});
```

### Verificar Límites
```typescript
import { PlanService } from '@/application/services/plan-service';

const canCreate = await PlanService.canCreateForm(userId);
if (canCreate) {
  // Crear formulario
  await PlanService.incrementFormCount(userId);
} else {
  // Mostrar mensaje de upgrade
}
```

### Obtener Estadísticas
```typescript
const usage = await PlanService.getUserUsageStats(userId);
console.log(`Usado: ${usage.formsCreatedThisMonth}/${usage.monthlyFormLimit}`);
```

## 🎨 Componentes de UI

### PricingSection
- Muestra todos los planes disponibles
- Toggle entre facturación mensual/anual
- Comparación de características
- Botones de suscripción

### Uso en Páginas
```tsx
import { PricingSection } from '@/components/organisms/PricingSection';

export default function PricingPage() {
  const handlePlanSelect = (plan: Plan) => {
    // Redirigir a checkout o mostrar modal
    console.log('Plan seleccionado:', plan.name);
  };

  return (
    <div>
      <h1>Planes y Precios</h1>
      <PricingSection onPlanSelect={handlePlanSelect} />
    </div>
  );
}
```

## 🔄 Flujo de Suscripción

### 1. Usuario Selecciona Plan
- Ve la página de pricing
- Selecciona un plan
- Se redirige al checkout de Stripe

### 2. Checkout de Stripe
- Usuario ingresa datos de pago
- Stripe procesa el pago
- Se crea la suscripción

### 3. Webhook de Stripe
- Stripe envía evento de suscripción creada
- Se actualiza la base de datos
- Se actualizan los límites del usuario

### 4. Confirmación
- Usuario es redirigido a página de éxito
- Puede comenzar a usar su nuevo plan

## 📊 Monitoreo y Analytics

### Métricas Rastreadas
- Conversión de planes gratuitos a pagos
- Churn rate por plan
- Uso promedio de formularios por plan
- Revenue por plan

### Alertas Automáticas
- Usuarios cerca del límite (80% de uso)
- Suscripciones fallidas
- Webhooks fallidos

## 🛡️ Seguridad

### Validaciones
- Verificación de webhooks de Stripe
- Validación de límites en backend
- Sanitización de datos de entrada

### Auditoría
- Log de todas las operaciones de suscripción
- Historial de cambios de plan
- Trazabilidad de pagos

## 🧪 Testing

### Unit Tests
```bash
npm test -- --testPathPattern=subscription
```

### Integration Tests
```bash
npm test -- --testPathPattern=stripe
```

### E2E Tests
```bash
npm run test:e2e -- --spec="subscription-flow.spec.ts"
```

## 🚨 Troubleshooting

### Problemas Comunes

#### Error: "Cannot find module 'typescript'"
- Asegúrate de que TypeScript esté en `dependencies` (no `devDependencies`)
- Ejecuta `npm install` nuevamente

#### Error: "Webhook signature verification failed"
- Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado correctamente
- Asegúrate de que la URL del webhook sea HTTPS en producción

#### Error: "Customer not found in Stripe"
- Verifica que el usuario tenga un email válido
- Asegúrate de que la API key de Stripe sea correcta

### Logs Útiles
```bash
# Ver logs de Stripe
grep "Stripe" logs/app.log

# Ver logs de suscripciones
grep "Subscription" logs/app.log

# Ver logs de webhooks
grep "Webhook" logs/app.log
```

## 📈 Escalabilidad

### Optimizaciones Futuras
- **Cache de planes** en Redis
- **Queue de webhooks** para alta concurrencia
- **Métricas en tiempo real** con WebSockets
- **A/B testing** de precios
- **Promociones y cupones** automáticos

### Límites de Stripe
- **Rate limits**: 100 requests/segundo por API key
- **Webhook retries**: 3 intentos automáticos
- **Customer limit**: Ilimitado
- **Subscription limit**: Ilimitado

## 📞 Soporte

### Recursos
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)

### Comunidad
- **GitHub Issues**: Reporta bugs y solicita features
- **Discord**: Únete a nuestra comunidad de desarrolladores
- **Blog**: Tutoriales y mejores prácticas

---

## 🎉 ¡Sistema Listo!

Tu sistema de suscripciones está completamente implementado y listo para:
- ✅ Procesar pagos con Stripe
- ✅ Gestionar límites mensuales
- ✅ Manejar webhooks automáticamente
- ✅ Proporcionar analytics de uso
- ✅ Escalar según tus necesidades

**¡Comienza a monetizar tu aplicación hoy mismo!** 🚀 