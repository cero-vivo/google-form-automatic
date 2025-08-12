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

## 📞 **Soporte Adicional:**

Si el problema persiste:
- **Revisa los logs** del servidor para más detalles
- **Verifica la configuración** de tu cuenta de Mercado Pago
- **Contacta soporte** de Mercado Pago si es necesario

---

**Nota:** Para desarrollo, SIEMPRE usa credenciales de TEST y una cuenta separada de la principal de vendedor. 