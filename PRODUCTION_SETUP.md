# 🚀 Configuración Completa para Producción

## 📋 Estado Actual
- ✅ Credenciales de producción configuradas (APP_USR-...)
- ⚠️ Advertencia de cookie esperada en desarrollo

## 🔧 Solución Inmediata para el Dominio

### 1. Verificar Credenciales
```bash
# Ejecuta para verificar tu configuración actual:
node debug-mercadopago.js
```

### 2. Configurar Dominio en Mercado Pago
1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Selecciona tu aplicación
3. Ve a "Configuración básica"
4. Agrega estos dominios en "Dominios de redirección":
   - `https://fastform.com`
   - `https://www.fastform.com`
   - `https://google-form-saas.vercel.app` (temporal)

### 3. Verificar Variables de Entorno
```bash
# Tu .env.local debe tener:
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2658953944869049-081200-f4b13b220eab48dc951608902085c138-2624228048
MERCADOPAGO_PUBLIC_KEY=APP_USR-TU_PUBLIC_KEY_AQUI
NEXT_PUBLIC_BASE_URL=https://fastform.com
NEXT_PUBLIC_APP_URL=https://fastform.com
```

## 🚨 Importante sobre la Advertencia de Cookie

La advertencia "x-meli-session-id cookie rechazada" es **normal** cuando:
- Usas credenciales de producción (APP_USR-) en localhost
- El dominio no coincide exactamente con la configuración

**No afecta el funcionamiento en producción** cuando tu dominio esté correctamente configurado.

## ✅ Próximos Pasos

1. **Configura tu dominio en Mercado Pago** (paso 2)
2. **Despliega a producción** con Vercel/Netlify
3. **Verifica que funcione** con tu dominio real
4. **La advertencia desaparecerá** al usar el dominio correcto

## 🔍 Para Desarrollo Local
Si necesitas probar localmente sin advertencias:
- Usa credenciales TEST- (sandbox)
- O usa ngrok para un dominio temporal válido

## 📞 Soporte
Si persiste el problema en producción, verifica:
- Dominio correctamente configurado en Mercado Pago
- URLs HTTPS en todas las redirecciones
- Credenciales válidas y vigentes