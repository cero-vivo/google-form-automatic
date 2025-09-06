# Configuración de Moonshot AI (Kimi K2)

## Resumen de la Migración

✅ **Migración completada exitosamente** de OpenAI a Moonshot AI (Kimi K2)

## Cambios Realizados

### 1. Configuración del Servicio
- **URL Base**: `https://api.moonshot.cn/v1` (compatible con OpenAI SDK)
- **Modelo**: `kimi-k2-0905-preview`
- **API Key**: Usa `MOONSHOT_API_KEY` de `.env.local`

### 2. Variables de Entorno
Asegúrate de que tu `.env.local` contenga:

```bash
# Moonshot AI Configuration
MOONSHOT_API_KEY=your-moonshot-api-key-here

# Fallback (opcional)
OPENAI_API_KEY=your-openai-key-as-backup
```

### 3. Archivos Actualizados

#### ✅ `/src/infrastructure/ai/OpenAIFormService.ts`
- [x] Agregada URL base de Moonshot AI
- [x] Soporte para `MOONSHOT_API_KEY` con fallback a `OPENAI_API_KEY`
- [x] Actualizado import de `MOONSHOT_CONFIG`

#### ✅ `/src/infrastructure/services/OpenAIFormService.ts`
- [x] Actualizado endpoint a `https://api.moonshot.cn/v1/chat/completions`
- [x] Soporte para `MOONSHOT_API_KEY`
- [x] Actualizado import de `MOONSHOT_CONFIG`

#### ✅ `/src/lib/config.ts`
- [x] Renombrado `OPENAI_CONFIG` a `MOONSHOT_CONFIG`
- [x] Modelo configurado: `kimi-k2-0905-preview`

## Uso

El sistema ahora usará automáticamente Moonshot AI. No se requieren cambios adicionales en el código de la aplicación.

## Verificación

Para verificar que todo funciona correctamente:

1. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Prueba el chat de IA**:
   - Ve a la interfaz de chat
   - Crea un formulario con IA
   - Verifica que no hay errores de API

3. **Monitorea los logs**:
   - Busca mensajes como "Respuesta raw de OpenAI:" (el SDK sigue mostrando este mensaje)
   - Verifica que no hay errores de autenticación

## Solución de Problemas

### Error: API Key no válida
- Verifica que `MOONSHOT_API_KEY` esté correctamente configurada en `.env.local`
- Asegúrate de usar una API key válida de Moonshot AI

### Error: Modelo no encontrado
- El modelo `kimi-k2-0905-preview` está correctamente configurado
- Si cambias el modelo, actualiza `MOONSHOT_CONFIG.model` en `/src/lib/config.ts`

### Error de red
- Verifica que puedas acceder a `https://api.moonshot.cn`
- Si estás detrás de un firewall, asegúrate de permitir conexiones a Moonshot AI

### Respuestas JSON Incompletas
Si recibes respuestas JSON incompletas:
1. Verifica que `maxCompletionTokens` sea suficiente (actualizado a 6000)
2. Considera reducir el número de preguntas solicitadas (máximo 20)
3. Revisa los logs del servidor para más detalles
4. El sistema ahora tiene reparación automática de JSON incompleto
5. Asegúrate de que el prompt especifique que el JSON debe estar completo

## Características de Kimi K2

- **Soporte nativo para español**: Excelente comprensión del idioma español
- **Contexto extendido**: Mayor capacidad de contexto para conversaciones más largas
- **Precio competitivo**: Costos más bajos que OpenAI para modelos similares
- **API compatible**: Sin cambios necesarios en el código existente