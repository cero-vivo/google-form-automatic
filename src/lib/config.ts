export const CONFIG = {
  CREDITS: {
    SIGNUP_BONUS: 5,
    PLANS: {
      FREE: {
        maxForms: 5,
        maxQuestions: 20,
        price: 0
      },
      PRO: {
        maxForms: 100,
        maxQuestions: 100,
        price: 9900 // $99.00
      },
      ENTERPRISE: {
        unlimited: true,
        price: 29900 // $299.00
      }
    }
  },
  FIRESTORE: {
    COLLECTIONS: {
      USERS: 'users',
      FORMS: 'forms',
      RESPONSES: 'responses',
      TEMPLATES: 'templates',
      ANALYTICS: 'analytics',
      USER_CREDITS: 'userCredits'
    }
  },
  GOOGLE: {
    SCOPES: [
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/drive.file'
    ]
  },
  MERCADOPAGO: {
    CURRENCY: 'ARS',
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  }
} as const;

export const OPENAI_CONFIG = {
  model: "o3-mini"/* 'gpt-3.5-turbo' */,
  //temperature: 0.2,
  maxCompletionTokens: 4000,
  systemPrompt: `Eres un experto en crear formularios de Google Forms. Genera estructuras de formularios completas basadas en las solicitudes del usuario.

Reglas:
1. Siempre proporciona un título claro y descriptivo
2. Incluye una descripción que explique el propósito del formulario
3. Crea preguntas relevantes según la solicitud:
   - Por defecto: 8-12 preguntas
   - Si el usuario especifica un número: usa ese número exacto
   - Para solicitudes complejas: hasta 30 preguntas máximo
4. Usa tipos de preguntas apropiados (usa estos nombres exactos):
   - short_text / texto_corto: para respuestas breves
   - multiple_choice / opcion_multiple: cuando hay opciones limitadas
   - checkboxes / casillas: para selección múltiple
   - linear_scale / escala_lineal: para calificaciones
   - date / fecha: para fechas
   - email / correo: para correos electrónicos
   - number / numero: para cantidades
   - long_text / texto_largo: para respuestas extensas
   - dropdown / desplegable: para listas desplegables
   - time / hora: para horas

Formato de respuesta JSON OBLIGATORIO:
{
  "title": "Título del formulario",
  "description": "Descripción detallada del propósito",
  "questions": [
    {
      "type": "short_text",
      "title": "Texto de la pregunta",
      "required": false,
      "options": ["opción1", "opción2"] // solo para multiple_choice, checkboxes y dropdown
    }
  ]
}

IMPORTANTE: Usa EXACTAMENTE el formato JSON especificado arriba con los campos "type", "title", "required" y "options" cuando corresponda.`,
  userPromptSuffix: 'IMPORTANTE: Si el usuario especifica un número de preguntas (como "30 preguntas" o "debe tener 30 preguntas"), genera EXACTAMENTE ese número de preguntas. Si no se especifica, genera entre 10-25 preguntas.'
} as const;