# 🚀 Guía de Configuración de Mercado Pago

## 📋 Pasos para Configurar Mercado Pago

### 1. Crear Cuenta en Mercado Pago
- Ve a [mercadopago.com.ar](https://mercadopago.com.ar)
- Haz clic en "Crear cuenta" o "Registrarse"
- Completa el registro con tu información personal y de negocio
- Verifica tu email y completa el perfil

### 2. Obtener Credenciales de API
Una vez que tengas tu cuenta:
- Ve a **Desarrolladores** → **Tus integraciones**
- Copia tu **Access Token** (empieza con `APP_USR_` para producción o `TEST_` para pruebas)
- Copia tu **Public Key** (empieza con `APP_USR_` para producción o `TEST_` para pruebas)

### 3. Configurar Productos y Precios
En el dashboard de Mercado Pago:

#### Producto: Basic Plan
- **Nombre**: Basic Plan
- **Descripción**: Plan básico para usuarios regulares
- **Precio**: $5.00 USD / mes
- **Moneda**: USD (Dólar Estadounidense)

#### Producto: Pro Plan
- **Nombre**: Pro Plan
- **Descripción**: Plan profesional para equipos
- **Precio**: $15.00 USD / mes
- **Moneda**: USD (Dólar Estadounidense)

#### Producto: Enterprise Plan
- **Nombre**: Enterprise Plan
- **Descripción**: Plan empresarial sin límites
- **Precio**: $25.00 USD / mes
- **Moneda**: USD (Dólar Estadounidense)

### 4. Configurar Webhooks
- Ve a **Desarrolladores** → **Webhooks**
- Haz clic en **Crear webhook**
- **URL del webhook**: `https://tu-dominio.com/api/mercadopago/webhooks`
- **Eventos a enviar**: Selecciona todos estos eventos:
  - `payment.created`
  - `payment.updated`
  - `payment.cancelled`
  - `subscription.created`
  - `subscription.updated`
  - `subscription.deleted`
- Haz clic en **Crear webhook**

### 5. Configurar Variables de Entorno
Crea un archivo `.env.local` en tu proyecto con:

```bash
# Mercado Pago Configuration
MERCADOPAGO_ACCESS_TOKEN=APP_USR_tu_access_token_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_tu_public_key_aqui
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Configurar Dominios Autorizados
En Firebase Console:
- Ve a **Authentication** → **Settings** → **Authorized domains**
- Agrega tu dominio de producción (ej: `tuapp.netlify.app`)

### 7. Probar la Integración
1. Ejecuta `npm run dev`
2. Ve a la página de pricing
3. Selecciona un plan
4. Completa el checkout de Mercado Pago
5. Verifica que se procese el pago

## 🔧 Configuración de Precios Anuales

Para ofrecer descuentos anuales:
1. En cada producto, crea un precio adicional
2. **Precio**: Calcula el precio anual con descuento (ej: $9,999 en lugar de $11,988)
3. **Frecuencia**: Anual (se factura una vez al año)

## 📱 Configuración Móvil

Si planeas usar la app en móviles:
- Ve a **Configuración** → **Configuración de negocio** → **Portal del cliente**
- Habilita **Portal del cliente**
- Configura las opciones de cancelación y cambio de plan

## 🚨 Consideraciones de Seguridad

- **Nunca** compartas tu `MERCADOPAGO_ACCESS_TOKEN`
- **Siempre** usa webhooks para sincronizar datos
- **Verifica** las IPs de Mercado Pago en producción
- **Usa** HTTPS en producción para webhooks

## 💰 Comisiones de Mercado Pago

### Tarjetas de Crédito/Débito
- **Visa, Mastercard, American Express**: 2.9% + $0.30 USD
- **Tarjetas locales**: 2.9% + $0.30 USD

### Solo Tarjetas
- **No aceptamos transferencias bancarias ni efectivo**
- **Solo tarjetas de crédito y débito internacionales**

## 🔄 Flujo de Pago

### 1. Usuario Selecciona Plan
- Ve la página de pricing
- Selecciona un plan (mensual o anual)
- Se crea una preferencia de pago

### 2. Checkout de Mercado Pago
- Usuario es redirigido al checkout
- Selecciona método de pago
- Completa la información de pago

### 3. Procesamiento del Pago
- Mercado Pago procesa el pago
- Envía webhook con el resultado
- Se actualiza la base de datos

### 4. Confirmación
- Usuario es redirigido a página de éxito
- Puede comenzar a usar su nuevo plan

## 📊 Monitoreo y Analytics

### Métricas Disponibles
- Conversión de planes gratuitos a pagos
- Tasa de abandono por plan
- Uso promedio de formularios por plan
- Revenue por plan y método de pago

### Alertas Automáticas
- Usuarios cerca del límite (80% de uso)
- Pagos fallidos
- Webhooks fallidos

## 🧪 Testing

### Modo de Pruebas
- Usa credenciales que empiecen con `TEST_`
- Los pagos no se procesan realmente
- Perfecto para desarrollo y testing

### Modo de Producción
- Usa credenciales que empiecen con `APP_USR_`
- Los pagos se procesan realmente
- Solo usar en producción

## 🚨 Troubleshooting

### Problemas Comunes

#### Error: "Access Token inválido"
- Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté configurado correctamente
- Asegúrate de usar las credenciales correctas (TEST vs PROD)

#### Error: "Webhook no recibido"
- Verifica que la URL del webhook sea accesible desde internet
- Asegúrate de que el webhook esté configurado correctamente

#### Error: "Pago no procesado"
- Verifica que el método de pago esté habilitado
- Asegúrate de que el monto esté dentro de los límites

### Logs Útiles
```bash
# Ver logs de Mercado Pago
grep "Mercado Pago" logs/app.log

# Ver logs de webhooks
grep "Webhook" logs/app.log

# Ver logs de pagos
grep "Payment" logs/app.log
```

## 📞 Soporte

### Recursos
- **Mercado Pago Docs**: [developers.mercadopago.com](https://developers.mercadopago.com)
- **Mercado Pago Support**: [ayuda.mercadopago.com](https://ayuda.mercadopago.com)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)

### Comunidad
- **Stack Overflow**: Tag `mercadopago`
- **GitHub**: Reporta bugs y solicita features
- **Discord**: Únete a nuestra comunidad de desarrolladores

## ✅ Checklist de Configuración

- [ ] Cuenta de Mercado Pago creada
- [ ] Credenciales de API obtenidas
- [ ] Productos y precios creados
- [ ] Webhooks configurados
- [ ] Variables de entorno configuradas
- [ ] Dominios autorizados en Firebase
- [ ] Pruebas de checkout realizadas
- [ ] Webhooks funcionando correctamente
- [ ] Modo de producción configurado

---

## 🎉 ¡Sistema Listo!

Tu sistema de suscripciones con Mercado Pago está completamente configurado y listo para:
- ✅ Procesar pagos en dólares estadounidenses
- ✅ Aceptar solo tarjetas de crédito/débito
- ✅ Gestionar límites mensuales
- ✅ Manejar webhooks automáticamente
- ✅ Escalar según tus necesidades

**¡Comienza a monetizar tu aplicación internacionalmente!** 🚀💳 