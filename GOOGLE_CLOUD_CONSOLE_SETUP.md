# Google Cloud Console - Pasos para Actualizar Scopes

**Fecha:** 2 de octubre de 2025  
**Proyecto:** FastForm  
**Objetivo:** Configurar correctamente los scopes para pasar verificación

---

## 🎯 Objetivo

Actualizar la configuración de OAuth en Google Cloud Console para usar el scope `drive.file` en lugar de `drive` completo.

---

## ⚠️ IMPORTANTE: Lee esto primero

**NO REMUEVAS SCOPES PREVIAMENTE APROBADOS** hasta que Google confirme la aprobación de los nuevos scopes. Google lo menciona explícitamente en su email.

---

## 📋 Paso 1: Acceder a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Inicia sesión con tu cuenta de Google
3. Selecciona tu proyecto **FastForm** (o como lo hayas nombrado)

---

## 🔐 Paso 2: Navegar a OAuth Consent Screen

1. En el menú lateral izquierdo, haz clic en **☰ (menú hamburguesa)**
2. Ve a **APIs & Services**
3. Haz clic en **OAuth consent screen**

Deberías ver tu configuración actual de OAuth.

---

## 🔍 Paso 3: Verificar Configuración Actual

En la pantalla de OAuth consent screen, revisa:

### App Information:
- ✅ **App name:** FastForm (o tu nombre)
- ✅ **User support email:** Tu email
- ✅ **App logo:** (opcional pero recomendado)

### App Domain:
- ✅ **Application home page:** https://tu-dominio.com
- ✅ **Privacy policy link:** https://tu-dominio.com/legals/pp
- ✅ **Terms of service link:** https://tu-dominio.com/legals/tos (si tienes)

### Developer Contact:
- ✅ **Email addresses:** Tu email de contacto

---

## 🎯 Paso 4: Editar Scopes

1. En la sección **Scopes for Google APIs**, haz clic en **EDIT**
2. Verás una lista de scopes actuales

### Scopes que DEBEN estar configurados:

#### ✅ Scopes necesarios (verifica que estén):

```
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/forms
https://www.googleapis.com/auth/forms.body
https://www.googleapis.com/auth/drive.file
```

#### ❌ Scopes que NO deben estar (pero NO remuevas aún si están aprobados):

```
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/drive.readonly
```

### Cómo agregar el scope drive.file si no está:

1. Haz clic en **ADD OR REMOVE SCOPES**
2. En el cuadro de búsqueda, escribe: `drive.file`
3. Busca: `https://www.googleapis.com/auth/drive.file`
4. Marca el checkbox
5. Haz clic en **UPDATE** en la parte inferior

### Resultado esperado:

Tu lista de scopes debería verse así:

| Scope | Sensitive/Restricted | User-facing description |
|-------|---------------------|-------------------------|
| openid | Non-sensitive | Associate you with your personal info on Google |
| .../auth/userinfo.email | Sensitive | See your primary Google Account email address |
| .../auth/userinfo.profile | Sensitive | See your personal info, including any personal info you've made publicly available |
| .../auth/forms | Restricted | See, edit, create, and delete all your Google Forms forms |
| .../auth/forms.body | Restricted | See, edit, create, and delete all your Google Forms forms |
| .../auth/drive.file | Non-sensitive | See, edit, create, and delete only the specific Google Drive files you use with this app |

---

## 💾 Paso 5: Guardar Cambios

1. Revisa que todos los scopes necesarios estén configurados
2. Haz clic en **SAVE AND CONTINUE** en la parte inferior
3. Confirma los cambios si te piden confirmación

---

## 📧 Paso 6: Responder a Google

Ahora que has actualizado los scopes en Cloud Console, **responde al email de Google**.

### Template de respuesta:

```
Subject: Re: [Tu Caso ID] - Confirming narrower scopes

Hello Google Team,

Confirming narrower scopes

We have updated our application to use the drive.file scope instead of the full drive scope. 

Our application is a Google Forms builder tool (FastForm) that helps users create forms quickly using AI, CSV files, or manual input. We only need to:

1. Create new Google Forms in the user's Drive
2. Access and manage ONLY the forms created by our application
3. The user controls which files our app can access through the consent screen

The drive.file scope is sufficient and appropriate for our use case because:
- We only create new forms, we don't need access to existing files
- Users maintain full control over which files our app can access
- This provides better privacy and security for users

We have updated our:
- Cloud Console project configuration (scopes updated)
- Application source code (using drive.file instead of drive)
- Privacy policy (reflecting the limited access)

All changes have been implemented, tested, and are ready for production.

Thank you for your guidance in improving our app's security and user privacy.

Best regards,
FastForm Team
```

**Cómo enviar:**
1. Busca el email original que Google te envió
2. Haz clic en **Reply** (Responder)
3. Copia el texto de arriba
4. Personaliza con tu información
5. Envía

---

## ⏱️ Paso 7: Esperar Respuesta de Google

### Timeline esperado:
- **1-3 días hábiles:** Respuesta inicial de Google
- **Sin auditoría CASA:** No se requiere porque `drive.file` no es restrictivo
- **Aprobación automática:** Muy probable porque seguiste sus recomendaciones

### Qué esperar:
- ✅ **Email de confirmación** de que tus cambios fueron aceptados
- ✅ **Status actualizado** en la pantalla de Verification Center
- ✅ **Permiso para publicar** tu aplicación

### Mientras esperas:
- 🧪 **Prueba tu aplicación** localmente
- 📝 **Revisa la documentación** de este repo
- 🔍 **Monitorea el status** en Cloud Console

---

## 🔍 Paso 8: Verificar Status

### Verification Center:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto
3. Ve a **APIs & Services > OAuth consent screen**
4. Mira el status de verificación:

**Status posibles:**
- 🟡 **Verification in progress:** En proceso de verificación
- 🔵 **Verification required:** Requiere acción de tu parte
- 🟢 **Verified:** ¡Aprobado! 🎉
- 🔴 **Issues found:** Revisa los problemas señalados

### Cómo revisar detalles:

1. En la misma pantalla, busca **"Publishing status"**
2. Haz clic en **VIEW DETAILS** si está disponible
3. Revisa cualquier mensaje o requisito adicional

---

## 🚨 Troubleshooting

### Problema: No encuentro el scope drive.file

**Solución:**
1. En **ADD OR REMOVE SCOPES**, usa el filtro
2. Escribe exactamente: `https://www.googleapis.com/auth/drive.file`
3. También puedes buscar por: "drive file"
4. Si no aparece, verifica que la Drive API esté habilitada

### Problema: Google sigue pidiendo drive completo

**Solución:**
1. Verifica que removiste las referencias en tu código (ver `google-verification-changes.md`)
2. Asegúrate de que tu aplicación local esté usando el nuevo código
3. Limpia el caché de autenticación de Google
4. Prueba con una cuenta de Google diferente

### Problema: No puedo remover scopes antiguos

**Solución:**
- ✅ **Correcto:** NO debes removerlos hasta que Google apruebe los nuevos
- Google dijo explícitamente: "DO NOT remove any previously approved scopes"
- Una vez aprobado el nuevo scope, podrás remover los antiguos

### Problema: Mi aplicación está en "Testing" mode

**Solución:**
1. Esto es normal mientras esperas verificación
2. Puedes agregar hasta 100 test users
3. Una vez verificado, podrás publicar a "Production"

---

## ✅ Checklist Final

Antes de considerar completo este proceso:

- [ ] Accedí a Google Cloud Console
- [ ] Verifiqué la configuración de OAuth consent screen
- [ ] Agregué el scope `drive.file` si no estaba
- [ ] Verifiqué que todos los scopes necesarios están configurados
- [ ] Guardé los cambios
- [ ] Respondí al email de Google con "Confirming narrower scopes"
- [ ] Probé mi aplicación localmente con los nuevos scopes
- [ ] Monitoreé el Verification Center para updates

---

## 📞 Recursos Adicionales

### Links Útiles:
- [Google Cloud Console](https://console.cloud.google.com)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [Drive API Scopes Documentation](https://developers.google.com/drive/api/guides/api-specific-auth)
- [OAuth Verification Guide](https://support.google.com/cloud/answer/9110914)

### Documentos del Proyecto:
- `google-verification-changes.md` - Todos los cambios técnicos realizados
- `README.md` - Documentación general del proyecto
- `DEPLOYMENT_NETLIFY.md` - Guía de deployment (si aplica)

---

## 🎉 Próximos Pasos Después de Aprobación

Una vez que Google apruebe tus scopes:

1. **Publicar aplicación:**
   - Cambiar de "Testing" a "Production" en OAuth consent screen
   - Remover test users
   - Tu app estará disponible públicamente

2. **Actualizar deployment:**
   - Deploy los cambios a producción
   - Verifica que todo funcione correctamente
   - Monitorea errores en los primeros días

3. **Comunicar a usuarios:**
   - Informa que pueden usar la app sin restricciones
   - Explica los beneficios de privacidad mejorada

4. **Limpiar código:**
   - Puedes remover referencias a scopes antiguos una vez confirmado que todo funciona
   - Actualizar documentación si es necesario

---

**Último update:** 2 de octubre de 2025  
**Creado por:** FastForm Team  
**Status:** 📝 Esperando respuesta de Google
