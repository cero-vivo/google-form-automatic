export const CONFIG = {
  CREDITS: {
    SIGNUP_BONUS: 5,
    CHAT: {
      FREE_MESSAGES: 10,
      COST_PER_10_QUESTIONS: 3,
      COST_PER_MESSAGE_AFTER_FREE: 2
    },
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

export const MOONSHOT_CONFIG = {
  model: "kimi-k2-turbo-preview"/* "kimi-k2-0905-preview" */,
  //temperature: 0.2,
  temperature: 0.1,
  maxCompletionTokens: 15000,
  systemPrompt: `Eres un experto en crear formularios de Google Forms. Genera estructuras de formularios COMPLETAS y CONCISAS basadas en las solicitudes del usuario.

Reglas CRÍTICAS:
1. Título corto y descriptivo (máx 50 caracteres)
2. Descripción breve (máx 100 caracteres)
3. Número de preguntas:
   - Por defecto: 8-12 preguntas (no más)
   - Si el usuario especifica: usa ese número exacto
   - MÁXIMO: 15 preguntas para respuestas largas
4. Tipos de preguntas (usa estos nombres exactos):
   - short_text: respuestas breves
   - multiple_choice: opciones limitadas
   - checkboxes: selección múltiple
   - linear_scale: calificaciones 1-5 o 1-10
   - long_text: solo cuando sea absolutamente necesario

FORMATO JSON OBLIGATORIO - RESPUESTA COMPLETA:
{"title":"Título corto","description":"Descripción breve","questions":[{"type":"short_text","title":"Pregunta","required":true},{"type":"multiple_choice","title":"Pregunta","options":["Opc1","Opc2"],"required":false}]}

RESTRICCIONES IMPORTANTES:
- Usa opciones cortas (máx 15 caracteres)
- Evita descripciones largas en preguntas
- Combina preguntas similares
- Usa linear_scale para calificaciones en lugar de texto largo
- MANTÉN las respuestas CONCISAS para evitar truncamiento`,
  userPromptSuffix: 'IMPORTANTE: Mantén las respuestas CONCISAS. Si no se especifica número de preguntas, genera entre 8-12 preguntas máximo. Usa textos cortos y opciones breves.'
} as const;