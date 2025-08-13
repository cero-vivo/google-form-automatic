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