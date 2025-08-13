# 🧪 Verificación de Sandbox - Mercado Pago

## ✅ Estado Actual
- **Entorno**: Desarrollo (NODE_ENV=development)
- **Credenciales**: ✅ Cambiadas a SANDBOX (TEST-...)
- **Puerto**: 3000
- **URLs**: http://localhost:3000

## 🔍 Problema: "Algo salió mal... No pudimos procesar tu pago"

### **Causa Principal**
Estabas usando credenciales de **producción** (APP_USR-...) en lugar de **sandbox** (TEST-...) para desarrollo.

### **Solución Implementada**
1. ✅ Credenciales cambiadas a TEST en `.env.local`
2. ✅ URLs ajustadas para localhost:3000
3. ✅ Logging mejorado para debugging

## 🎯 Próximos Pasos

### **1. Verificar Configuración**
```bash
node debug-mercadopago.js
```

### **2. Tarjetas de Prueba para Sandbox**
Usa estas tarjetas en el checkout:
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 7557 4043 0602
- **Amex**: 3711 803032 57522
- **Cualquier CVV**: 123
- **Fecha**: Cualquier fecha futura

### **3. Verificar Logs**
Abre la consola del navegador → Network → create-preference → verifica que:
- La URL sea: `http://localhost:3000/checkout/success`
- El token empiece con: `TEST-`

### **4. Si sigue fallando**
```bash
# Reinicia el servidor
npm run dev

# Verifica en la consola que diga "isSandbox: true"
```

## 📋 Checklist de Configuración

- [ ] Credenciales en `.env.local` empiezan con `TEST-`
- [ ] App corre en puerto 3000
- [ ] URLs de retorno apuntan a localhost:3000
- [ ] Usando tarjetas de prueba de sandbox

**Resultado esperado**: El pago debería procesarse correctamente en sandbox.