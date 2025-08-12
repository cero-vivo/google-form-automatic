import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Configuración de Firebase con valores por defecto para desarrollo
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX'
};

// Validar que todas las variables de entorno estén presentes
function validateFirebaseConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Warning: Missing Firebase environment variables: ${missingVars.join(', ')}`
    );
    console.warn('Firebase features may not work properly');
    return false;
  }
  return true;
}

// Inicializar Firebase solo si no está ya inicializado
function initializeFirebase(): FirebaseApp {
  const isValid = validateFirebaseConfig();
  
  if (!isValid) {
    console.warn('Firebase not properly configured, using fallback configuration');
  }
  
  try {
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    }
    
    return getApps()[0];
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

// Inicializar la app de Firebase de forma segura
let app: FirebaseApp;
try {
  app = initializeFirebase();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error);
  throw error;
}

// Obtener instancias de los servicios
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Analytics solo en el cliente
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
  try {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
  } catch (error) {
    console.warn('⚠️ Firebase Analytics not available:', error);
  }
}

// Exportar la app para casos especiales
export { app as firebaseApp };

// Configuraciones adicionales
export const COLLECTIONS = {
  USERS: 'users',
  FORMS: 'forms',
  RESPONSES: 'responses',
  TEMPLATES: 'templates',
  ANALYTICS: 'analytics',
  USER_CREDITS: 'userCredits'
} as const;

export const STORAGE_PATHS = {
  USER_UPLOADS: 'uploads',
  FORM_ATTACHMENTS: 'form-attachments',
  USER_AVATARS: 'avatars',
  TEMP_FILES: 'temp'
} as const; 