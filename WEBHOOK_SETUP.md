# Configuración de Webhooks de Mercado Pago

## 🚨 Problema Resuelto

**El problema**: Cuando los usuarios completan un pago en Mercado Pago pero eligen "Ir a Actividad" en lugar de "Volver a FastForm", nunca llegamos a `/checkout/success` y los créditos no se acreditan.

**La solución**: Implementar webhooks de Mercado Pago que procesen los pagos exitosos independientemente de si el usuario regresa a nuestra página o no.

## 🔧 Configuración del Webhook

### 1. Configurar Webhook en Mercado Pago

1. **Acceder al panel de desarrolladores**:
   - Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
   - Inicia sesión con tu cuenta

2. **Configurar webhook**:
   - Ve a "Tus integraciones" → "Webhooks"
   - Agrega una nueva URL de webhook:
   
   **Para desarrollo con ngrok**:
   ```
   https://f765adcfd6dd.ngrok-free.app/api/mercadopago/webhooks
   ```
   
   **Para producción**:
   ```
   https://tudominio.com/api/mercadopago/webhooks
   ```

3. **Seleccionar eventos**:
   - Marca solo: "Pagos" → "payment"
   - Guarda la configuración

### 2. Verificar Funcionamiento

#### Prueba de webhook:
1. **Inicia tu servidor**:
   ```bash
   npm run dev
   ```

2. **Verifica logs**:
   - Los webhooks aparecerán en la consola
   - Busca mensajes como: "🔄 Webhook recibido de Mercado Pago"

3. **Realiza una compra de prueba**:
   - Ve a `/pricing`
   - Selecciona una cantidad de créditos
   - Completa el pago con tarjetas de prueba
   - **Importante**: Elige "Ir a Actividad" en lugar de "Volver a FastForm"

4. **Verifica resultados**:
   - Los créditos se deben agregar automáticamente
   - Revisa la consola para logs del webhook
   - Verifica en Firestore que los créditos se agregaron

### 3. Tarjetas de Prueba

**Para sandbox**:
- **Tarjeta aprobada**: 5031 7557 3453 0604
- **CVV**: 123
- **Fecha**: 11/25
- **Nombre**: APRO

**Para producción**:
- Usa tarjetas reales
- Los pagos se procesan normalmente

### 4. Monitoreo

#### Verificar logs:
```bash
# Ver logs del webhook
npm run dev
```

#### Verificar en Firestore:
- Ve a [Firebase Console](https://console.firebase.google.com)
- Abre tu proyecto
- Ve a "Firestore Database"
- Busca la colección "userCredits"
- Verifica que el documento del usuario tenga los créditos actualizados

### 5. Solución de Problemas

#### Webhook no recibe notificaciones:
1. **Verifica URL**:
   ```bash
   curl -X POST https://f765adcfd6dd.ngrok-free.app/api/mercadopago/webhooks \
     -H "Content-Type: application/json" \
     -d '{"type":"payment","data":{"id":"123"}}'
   ```

2. **Verifica logs**:
   - Asegúrate de que ngrok esté corriendo
   - Verifica que la URL esté correctamente configurada

#### Créditos no se agregan:
1. **Verifica external_reference**:
   - Debe tener formato: `userId_packSize_quantity`
   - Ejemplo: `abc123_50_50`

2. **Verifica usuario**:
   - El userId debe existir en Firebase Auth
   - El usuario debe tener documento en userCredits

### 6. Flujo Completo Actualizado

1. **Usuario selecciona créditos** → `/pricing`
2. **Se crea preferencia** → `/api/mercadopago/create-preference`
3. **Usuario paga en Mercado Pago**
4. **Webhook recibe notificación** → `/api/mercadopago/webhooks`
5. **Créditos se agregan automáticamente** → Firestore
6. **Usuario puede usar créditos inmediatamente** → `/dashboard`

## ✅ Resultado

Con esta configuración:
- ✅ Los pagos se procesan incluso si el usuario no regresa a la página
- ✅ Los créditos se agregan automáticamente
- ✅ No hay dependencia de redirección exitosa
- ✅ Los usuarios pueden usar los créditos inmediatamente
- ✅ Mayor confiabilidad en el sistema de pagos

## 📞 Soporte

Si tienes problemas:
1. Verifica que ngrok esté corriendo
2. Verifica las credenciales de Mercado Pago
3. Revisa los logs del servidor
4. Contacta soporte si persiste el problema