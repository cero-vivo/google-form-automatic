# 🚀 Guía de Configuración de Stripe

## 📋 Pasos para Configurar Stripe

### 1. Crear Cuenta en Stripe
- Ve a [stripe.com](https://stripe.com)
- Haz clic en "Start now" o "Sign up"
- Completa el registro con tu información de negocio
- Verifica tu email y completa el perfil

### 2. Obtener API Keys
Una vez que tengas tu cuenta:
- Ve a **Developers** → **API keys**
- Copia tu **Publishable key** (empieza con `pk_test_`)
- Copia tu **Secret key** (empieza con `sk_test_`)

### 3. Crear Productos y Precios
En el dashboard de Stripe:

#### Producto: Basic Plan
- **Name**: Basic Plan
- **Description**: Plan básico para usuarios regulares
- **Price**: $9.99 USD / mes
- **Billing**: Recurring
- **Interval**: Monthly

#### Producto: Pro Plan
- **Name**: Pro Plan
- **Description**: Plan profesional para equipos
- **Price**: $19.99 USD / mes
- **Billing**: Recurring
- **Interval**: Monthly

#### Producto: Enterprise Plan
- **Name**: Enterprise Plan
- **Description**: Plan empresarial sin límites
- **Price**: $49.99 USD / mes
- **Billing**: Recurring
- **Interval**: Monthly

### 4. Configurar Webhooks
- Ve a **Developers** → **Webhooks**
- Haz clic en **Add endpoint**
- **Endpoint URL**: `https://tu-dominio.com/api/stripe/webhooks`
- **Events to send**: Selecciona todos estos eventos:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.trial_will_end`
- Haz clic en **Add endpoint**
- Copia el **Signing secret** (empieza con `whsec_`)

### 5. Configurar Variables de Entorno
Crea un archivo `.env.local` en tu proyecto con:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Stripe Price IDs (obtén estos de los productos que creaste)
STRIPE_PRICE_ID_BASIC=price_id_del_plan_basic
STRIPE_PRICE_ID_PRO=price_id_del_plan_pro
STRIPE_PRICE_ID_ENTERPRISE=price_id_del_plan_enterprise
```

### 6. Configurar Dominios Autorizados
En Firebase Console:
- Ve a **Authentication** → **Settings** → **Authorized domains**
- Agrega tu dominio de producción (ej: `tuapp.netlify.app`)

### 7. Probar la Integración
1. Ejecuta `npm run dev`
2. Ve a la página de pricing
3. Selecciona un plan
4. Completa el checkout de Stripe
5. Verifica que se cree la suscripción

## 🔧 Configuración de Precios Anuales (Opcional)

Para ofrecer descuentos anuales:
1. En cada producto, crea un precio adicional
2. **Interval**: Yearly
3. **Price**: Calcula el precio anual con descuento (ej: $99.99 en lugar de $119.88)
4. Agrega los IDs de precios anuales a las variables de entorno

## 📱 Configuración Móvil

Si planeas usar la app en móviles:
- Ve a **Settings** → **Business settings** → **Customer portal**
- Habilita **Customer portal**
- Configura las opciones de cancelación y cambio de plan

## 🚨 Consideraciones de Seguridad

- **Nunca** compartas tu `STRIPE_SECRET_KEY`
- **Siempre** usa webhooks para sincronizar datos
- **Verifica** las firmas de webhook en producción
- **Usa** HTTPS en producción para webhooks

## 📞 Soporte

- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Comunidad**: [stripe.com/community](https://stripe.com/community)

## ✅ Checklist de Configuración

- [ ] Cuenta de Stripe creada
- [ ] API keys obtenidas
- [ ] Productos y precios creados
- [ ] Webhooks configurados
- [ ] Variables de entorno configuradas
- [ ] Dominios autorizados en Firebase
- [ ] Pruebas de checkout realizadas
- [ ] Webhooks funcionando correctamente

---

**¡Una vez que completes estos pasos, tu sistema de suscripciones estará listo para funcionar!** 🎉 