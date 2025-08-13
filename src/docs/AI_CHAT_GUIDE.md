# Guía de Chat IA para Creación de Formularios

## Descripción General

Esta guía documenta la implementación del sistema de chat con IA para crear y modificar formularios de Google Forms usando OpenAI GPT-5-nano.

## Características

- **Chat conversacional**: Interfaz intuitiva para crear formularios mediante conversación natural
- **Validación automática**: Validación de JSON devuelto por la IA usando Zod
- **Gestión de créditos**: Sistema integrado de consumo de créditos
- **Vista previa en tiempo real**: Visualización instantánea del formulario mientras se construye
- **Integración Firebase**: Almacenamiento y sincronización en tiempo real

## Arquitectura

### Estructura de Archivos

```
src/
├── application/services/
│   └── OpenAIFormService.ts          # Servicio principal de IA
├── infrastructure/
│   ├── services/CreditService.ts     # Gestión de créditos
│   └── repositories/FirebaseRepository.ts # Almacenamiento en Firestore
├── presentation/components/
│   ├── molecules/CreditDisplay.tsx   # Display de créditos
│   ├── organisms/AIChatFormCreator.tsx # Componente principal del chat
│   └── molecules/FormPreview.tsx     # Vista previa del formulario
└── docs/
    └── AI_CHAT_GUIDE.md               # Esta guía
```

## Configuración de Variables de Entorno

```bash
# Agregar a .env.local
NEXT_PUBLIC_OPENAI_API_KEY=sk-tu-openai-api-key-aqui
```

## Uso del Sistema de Créditos

### Reglas de Consumo

- **Chat**: Cada 5 mensajes consume 1 crédito
- **Publicación**: 2 créditos adicionales al publicar un formulario

### Ejemplos de Consumo

| Mensajes | Créditos Chat | Publicación | Total |
|----------|---------------|-------------|--------|
| 3        | 0             | 2           | 2      |
| 5        | 1             | 2           | 3      |
| 12       | 2             | 2           | 4      |

## Formato de JSON Esperado

El agente IA devuelve un JSON con la siguiente estructura:

```json
{
  "title": "Título del formulario",
  "description": "Descripción opcional",
  "questions": [
    {
      "type": "texto_corto",
      "label": "¿Cuál es tu nombre?",
      "required": true
    },
    {
      "type": "opcion_multiple",
      "label": "¿Cómo te enteraste de nosotros?",
      "options": ["Redes sociales", "Amigo", "Búsqueda web", "Otro"],
      "required": true
    },
    {
      "type": "escala_lineal",
      "label": "¿Qué tan satisfecho estás?",
      "range": [1, 10],
      "required": false
    }
  ]
}
```

## Tipos de Preguntas Soportadas

| Tipo           | Descripción                    | Opciones Adicionales |
|----------------|--------------------------------|----------------------|
| texto_corto    | Respuesta corta                | -                    |
| texto_largo    | Respuesta larga                | -                    |
| opcion_multiple| Selección única                | options array        |
| checkboxes     | Selección múltiple             | options array        |
| dropdown       | Menú desplegable               | options array        |
| escala_lineal  | Escala numérica                | range [min, max]     |
| fecha          | Selector de fecha              | -                    |
| hora           | Selector de hora               | -                    |
| email          | Campo de email                 | -                    |
| numero         | Campo numérico                 | -                    |
| archivo        | Subida de archivo              | -                    |
| grid           | Pregunta en cuadrícula         | rows, columns        |
| escala         | Escala de calificación         | -                    |
| fecha_hora     | Fecha y hora                   | -                    |

## Ejemplos de Uso

### Ejemplo 1: Formulario básico
```
Usuario: "Quiero un formulario de contacto"
IA: Genera JSON con nombre, email, mensaje
```

### Ejemplo 2: Formulario complejo
```
Usuario: "Necesito un formulario de encuesta con 5 preguntas: nombre, edad, satisfacción del 1-10, servicios utilizados, y comentarios"
IA: Genera JSON con todas las preguntas con tipos apropiados
```

## Integración con Firebase

### Colecciones Utilizadas

- **users/{userId}/forms**: Formularios creados
- **users/{userId}/credits**: Créditos del usuario
- **users/{userId}/chatHistory**: Historial de interacciones
- **forms/{formId}**: Metadatos del formulario

### Eventos en Tiempo Real

- Actualización de créditos
- Notificaciones de consumo
- Sincronización de estado del formulario

## Manejo de Errores

### Errores Comunes

1. **Créditos insuficientes**: Mensaje claro al usuario
2. **JSON inválido**: Validación con mensajes descriptivos
3. **Error de API**: Reintentos automáticos y notificación
4. **Conexión perdida**: Indicador visual de estado

### Respuestas de Error

```typescript
interface ErrorResponse {
  type: 'credit' | 'validation' | 'api' | 'network';
  message: string;
  action?: string;
}
```

## Testing

### Tests Unitarios

```bash
npm test -- OpenAIFormService
```

### Tests de Integración

```bash
npm test -- AIChatFormCreator
```

### Tests E2E

```bash
npm run test:e2e -- ai-chat
```

## Rendimiento

### Optimizaciones Implementadas

- Debouncing de entrada del usuario
- Caché de respuestas frecuentes
- Lazy loading de componentes
- Optimización de re-renders con React.memo

### Métricas Clave

- Tiempo de respuesta promedio: <2s
- Tamaño del bundle: <500KB
- Uso de memoria: <50MB

## Seguridad

### Medidas Implementadas

- Validación estricta de entrada
- Sanitización de HTML
- Rate limiting por usuario
- Logs de auditoría

### Protección de Datos

- No almacenamiento de prompts sensibles
- Encriptación de tokens
- Cumplimiento GDPR

## Monitoreo

### Métricas de Uso

- Créditos consumidos por usuario
- Tiempo promedio de conversación
- Tasa de éxito de publicación
- Tipos de preguntas más comunes

### Alertas

- Créditos bajos
- Errores de API frecuentes
- Tiempo de respuesta elevado

## Solución de Problemas

### Problema: "No tengo créditos"

1. Verificar saldo en `/dashboard/credits`
2. Comprar créditos adicionales
3. Contactar soporte si el problema persiste

### Problema: "La IA no entiende mi solicitud"

1. Usar lenguaje más específico
2. Incluir tipos de preguntas deseados
3. Proporcionar ejemplos

### Problema: "Error al publicar"

1. Verificar conexión a internet
2. Revisar si el formulario tiene preguntas válidas
3. Intentar de nuevo después de unos minutos

## Soporte

Para soporte técnico:
- Email: soporte@fastform.com
- Chat en vivo: Disponible en el dashboard
- Documentación: docs.fastform.com

## Actualizaciones Futuras

- Soporte para múltiples idiomas
- Plantillas predefinidas
- Integración con otras APIs de IA
- Análisis de sentimiento
- Sugerencias automáticas de preguntas