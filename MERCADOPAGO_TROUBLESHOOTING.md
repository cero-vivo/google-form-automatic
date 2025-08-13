# Solución al Error "No podés pagarte a vos mismo" en Mercado Pago

## 🚨 **Error Común:**
```
No podés pagarte a vos mismo
```

## 🔍 **Causa del Problema:**
Estás intentando hacer una compra desde la misma cuenta que está configurada como vendedora en Mercado Pago.

## ✅ **Soluciones:**

### **Opción 1: Cuenta de Prueba Separada (RECOMENDADO)**

#### **Paso 1: Crear Cuenta de Prueba**
1. Ve a [Mercado Pago](https://www.mercadopago.com.ar)
2. **Crea una cuenta nueva** con un email diferente
3. **NO uses tu cuenta principal** de vendedor

#### **Paso 2: Obtener Credenciales de TEST**
1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. **Inicia sesión con la cuenta de prueba**
3. Ve a "Tus integraciones" → "Credenciales"
4. **Copia el Access Token de TEST**

#### **Paso 3: Configurar Variables de Entorno**
```bash
# .env.local
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **Opción 2: Usar Credenciales de Sandbox**

#### **Paso 1: Verificar Modo Sandbox**
La API ya está configurada para usar `test_mode: true` en desarrollo.

#### **Paso 2: Usar Tarjetas de Prueba**
Mercado Pago proporciona tarjetas de prueba:

**Tarjetas de Crédito:**
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 4332 1540 6351
- **American Express**: 3711 8030 3257 522

**Datos de Prueba:**
- **CVV**: 123
- **Fecha**: Cualquier fecha futura
- **Nombre**: Cualquier nombre

### **Opción 3: Configurar Cuenta de Vendedor Correctamente**

#### **Paso 1: Verificar Configuración de Vendedor**
1. Ve a tu cuenta de Mercado Pago
2. Verifica que esté configurada como "Cuenta Mercado Pago"
3. No como "Cuenta Mercado Libre"

#### **Paso 2: Usar Credenciales de Producción**
```bash
# .env.local (PRODUCCIÓN)
MERCADOPAGO_ACCESS_TOKEN=APP-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://tudominio.com
```

## 🧪 **Para Pruebas de Desarrollo:**

### **Configuración Recomendada:**
```bash
# .env.local
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### **Flujo de Prueba:**
1. **Configura credenciales de TEST**
2. **Usa tarjetas de prueba** proporcionadas por Mercado Pago
3. **Verifica que funcione** en modo sandbox
4. **Cambia a credenciales de PROD** para producción

## 🔧 **Verificación de Configuración:**

### **Endpoint de Prueba:**
Visita: `http://localhost:3000/api/mercadopago/test`

Deberías ver:
```json
{
  "status": "ok",
  "mercadopagoConfigured": true,
  "hasAccessToken": "Sí",
  "message": "Mercado Pago está configurado correctamente"
}
```

### **Logs del Servidor:**
Cuando hagas una compra, deberías ver:
```
📝 Creando preferencia con datos: { quantity: 1, unitPrice: 2000, totalPrice: 2000, packSize: null, discountPercent: 0 }
🔄 Enviando preferencia a Mercado Pago...
📋 Datos de preferencia: { ... }
✅ Preferencia creada exitosamente: [ID]
```

## 🚀 **Pasos para Solucionar:**

1. **Crea cuenta de prueba separada** en Mercado Pago
2. **Obtén credenciales de TEST** de esa cuenta
3. **Configura `.env.local`** con las nuevas credenciales
4. **Reinicia el servidor** de desarrollo
5. **Prueba la compra** con tarjetas de prueba
6. **Verifica que funcione** sin errores

## Problemas Comunes y Soluciones

### 1. El pago se procesa pero no redirige de vuelta

**Síntomas:**
- El pago se completa exitosamente
- No se redirige a la página de éxito
- Los créditos no se actualizan
- La página se queda en Mercado Pago o da error 404

**Posibles causas:**
1. **URL de retorno incorrecta:** Verifica que las URLs en `back_urls` sean correctas
2. **Puerto incorrecto en desarrollo:** Asegúrate de que NEXT_PUBLIC_BASE_URL use el mismo puerto que tu app
3. **Dominio no configurado:** Asegúrate de que el dominio esté configurado en Mercado Pago
4. **Problemas con HTTPS:** En producción, asegúrate de usar HTTPS
5. **Slash doble en URLs:** Verifica que no haya slashes duplicados

**Solución inmediata:**
```bash
# Verificar configuración
echo $NEXT_PUBLIC_BASE_URL
# En desarrollo debe ser: http://localhost:3000 (tu puerto real)
# En producción debe ser: https://tudominio.com (sin slash al final)
```

**Verificación rápida:**
```bash
# Ejecutar script de verificación
node scripts/verify-mercadopago.js
```

### 2. Error "site_url no configurada"

**Síntomas:**
- Error al crear la preferencia
- Mensaje sobre site_url

**Solución:**
1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Configura tu dominio en "Credenciales > URLs de retorno"
3. Asegúrate de incluir todos los paths: `/checkout/success`, `/checkout/failure`, `/checkout/pending`

### 3. Problema específico: "No vuelve a la pantalla de retorno"

**Diagnóstico:**
Este problema ocurre cuando NEXT_PUBLIC_BASE_URL está configurado con un puerto diferente al que realmente está corriendo la aplicación.

**Ejemplo del problema:**
- Tu app corre en: `http://localhost:3002`
- NEXT_PUBLIC_BASE_URL está: `http://localhost:3000`
- Resultado: Mercado Pago redirige al puerto 3000 (donde no hay nada)

**Solución paso a paso:**
1. **Verificar puerto actual:**
   ```bash
   # Ver en qué puerto está corriendo tu app
   npm run dev
   # Observa el mensaje: "ready - started server on 0.0.0.0:3000" o similar
   ```

2. **Actualizar .env.local:**
   ```bash
   # Actualizar NEXT_PUBLIC_BASE_URL al puerto correcto
   NEXT_PUBLIC_BASE_URL=http://localhost:3002
   ```

3. **Reiniciar el servidor:**
   ```bash
   npm run dev
   ```

4. **Verificar URLs:**
   - Abre: `http://localhost:3002/checkout/success` (debe existir)
   - Abre: `http://localhost:3002/checkout/failure` (debe existir)
   - Abre: `http://localhost:3002/checkout/pending` (debe existir)

### 4. Para desarrollo con ngrok (URLs públicas)

Si estás desarrollando localmente y Mercado Pago necesita URLs públicas:

1. **Instalar ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Iniciar túnel:**
   ```bash
   ngrok http 3002
   # Copia la URL HTTPS proporcionada
   ```

3. **Actualizar configuración:**
   ```bash
   NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
   ```

4. **Configurar en Mercado Pago:**
   - Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
   - Agrega `https://abc123.ngrok.io` como dominio permitido

### Error: "auto_return invalid. back_url.success must be defined"

**Diagnóstico:**
Este error indica que las URLs de retorno no están siendo correctamente definidas en la preferencia. El problema es específicamente que Mercado Pago no está recibiendo la URL de éxito.

**Solución inmediata:**

1. **Verificar NEXT_PUBLIC_BASE_URL en producción:**
   - Ve a tu dashboard de Vercel
   - Settings → Environment Variables
   - Asegúrate de tener: `NEXT_PUBLIC_BASE_URL=https://tudominio.com`

2. **Para desarrollo local:**
   - Crea/actualiza `.env.local`:
   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3002
   ```

3. **Ejecutar diagnóstico:**
   ```bash
   node debug-mercadopago.js
   ```

4. **Verificar logs:**
   - Abre la consola del navegador
   - Ve a Network → create-preference
   - Revisa el payload enviado

5. **Si usas ngrok para desarrollo:**
   ```bash
   ngrok http 3002
   # Luego actualiza .env.local:
   NEXT_PUBLIC_BASE_URL=https://tu-ngrok-url.ngrok.io
   ```

**Código actualizado:**
El archivo `src/app/api/mercadopago/create-preference/route.ts` ha sido actualizado para manejar correctamente las URLs de retorno.

## 📞 **Soporte Adicional:**

Si el problema persiste:
- **Revisa los logs** del servidor para más detalles
- **Verifica la configuración** de tu cuenta de Mercado Pago
- **Contacta soporte** de Mercado Pago si es necesario

---

**Nota:** Para desarrollo, SIEMPRE usa credenciales de TEST y una cuenta separada de la principal de vendedor.