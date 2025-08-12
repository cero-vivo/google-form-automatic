# Configuración de Mercado Pago para FastForm

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Mercado Pago Configuration
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token_here
MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key_here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Pasos para Configurar Mercado Pago

### 1. Crear Cuenta en Mercado Pago Developers

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta o inicia sesión
3. Accede al panel de desarrolladores

### 2. Obtener Credenciales

1. En el panel de desarrolladores, ve a "Tus integraciones"
2. Crea una nueva aplicación o selecciona una existente
3. Copia las credenciales:
   - **Access Token**: Token de acceso para el backend
   - **Public Key**: Clave pública para el frontend (si es necesario)

### 3. Configurar Webhooks

1. En la configuración de tu aplicación, agrega la URL del webhook:
   ```
   https://tudominio.com/api/mercadopago/webhooks
   ```
2. Para desarrollo local, puedes usar ngrok o similar

### 4. Configurar URLs de Retorno

Las URLs de retorno están configuradas en el código:
- **Success**: `/checkout/success`
- **Failure**: `/checkout/failure`
- **Pending**: `/checkout/pending`

## Estructura de la Integración

### API Endpoints

- `POST /api/mercadopago/create-preference` - Crea preferencias de pago
- `POST /api/mercadopago/webhooks` - Recibe notificaciones de pagos

### Flujo de Pago

1. Usuario selecciona cantidad de créditos en `/pricing`
2. Se crea una preferencia en Mercado Pago
3. Usuario es redirigido al checkout de Mercado Pago
4. Después del pago, usuario regresa a la aplicación
5. Webhook actualiza el saldo de créditos del usuario

## Configuración de Producción

### 1. Cambiar a Credenciales de Producción

- Reemplaza las credenciales de sandbox por las de producción
- Actualiza `NEXT_PUBLIC_BASE_URL` con tu dominio real

### 2. Configurar Webhooks de Producción

- Asegúrate de que las URLs de webhook sean accesibles desde internet
- Verifica que el endpoint de webhooks esté funcionando correctamente

### 3. Monitoreo

- Revisa los logs de webhooks en tu servidor
- Monitorea las transacciones en el panel de Mercado Pago
- Configura alertas para pagos fallidos

## Pruebas

### Modo Sandbox

- Usa las credenciales de sandbox para pruebas
- Mercado Pago proporciona tarjetas de prueba
- Los pagos no se procesan realmente

### Modo Producción

- Cambia a credenciales de producción
- Los pagos se procesan normalmente
- Monitorea todas las transacciones

## Solución de Problemas

### Error: "Access Token inválido"

- Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté correctamente configurado
- Asegúrate de usar el token correcto (sandbox vs producción)

### Webhooks no funcionan

- Verifica que la URL del webhook sea accesible desde internet
- Revisa los logs del servidor para errores
- Confirma que el endpoint esté respondiendo correctamente

### Pagos no se procesan

- Verifica la configuración de la preferencia
- Revisa los logs de Mercado Pago
- Confirma que las URLs de retorno estén configuradas correctamente

## Recursos Adicionales

- [Documentación de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [API de Preferencias](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/configure-preferences)
- [Webhooks](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/receive-payment-notifications)
- [Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/overview) 