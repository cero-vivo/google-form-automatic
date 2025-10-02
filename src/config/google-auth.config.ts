/**
 * Configuración del Sistema de Autenticación con Google
 * 
 * Este archivo centraliza todas las configuraciones del sistema de autenticación
 * para facilitar la personalización sin modificar el código fuente.
 */

export interface GoogleAuthConfig {
  // Intervalos de verificación (en milisegundos)
  intervals: {
    /** Intervalo para verificaciones automáticas silenciosas */
    autoCheck: number;
    
    /** Tiempo antes de expiración para mostrar advertencia */
    expiryThreshold: number;
    
    /** Intervalo entre reintentos en caso de error */
    retryDelay: number;
    
    /** Tiempo máximo de espera para renovación */
    maxRenewTimeout: number;
  };

  // Límites y umbrales
  limits: {
    /** Número máximo de reintentos para operaciones */
    maxRetries: number;
    
    /** Número máximo de reintentos para renovación */
    maxRenewRetries: number;
    
    /** Tiempo de backoff exponencial inicial */
    initialBackoff: number;
    
    /** Factor de backoff exponencial */
    backoffFactor: number;
  };

  // Mensajes y UI
  messages: {
    /** Título del modal de renovación */
    renewalTitle: string;
    
    /** Descripción del modal de renovación */
    renewalDescription: string;
    
    /** Texto del botón de renovación */
    renewalButtonText: string;
    
    /** Mensaje de éxito tras renovación */
    renewalSuccess: string;
    
    /** Mensaje de error genérico */
    genericError: string;
    
    /** Mensaje de timeout */
    timeoutError: string;
  };

  // Scopes de Google requeridos
  scopes: {
    /** Scopes necesarios para Google Forms */
    forms: string[];
    
    /** Scopes necesarios para Google Drive */
    drive: string[];
    
    /** Scopes adicionales opcionales */
    additional: string[];
  };

  // Configuración de logging
  logging: {
    /** Nivel de logging: 'debug' | 'info' | 'warn' | 'error' */
    level: 'debug' | 'info' | 'warn' | 'error';
    
    /** Habilitar logging en consola */
    console: boolean;
    
    /** Habilitar métricas de performance */
    metrics: boolean;
  };

  // Configuración de desarrollo
  development: {
    /** Simular errores para testing */
    simulateErrors: boolean;
    
    /** Desactivar verificaciones en desarrollo */
    skipChecks: boolean;
    
    /** Tiempo de espera reducido para desarrollo */
    fastTimeouts: boolean;
  };
}

// Configuración por defecto
export const DEFAULT_GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  intervals: {
    autoCheck: 10 * 60 * 1000,      // 10 minutos
    expiryThreshold: 5 * 60 * 1000,  // 5 minutos antes de expirar
    retryDelay: 2000,                // 2 segundos entre reintentos
    maxRenewTimeout: 30 * 1000,      // 30 segundos máximo para renovar
  },

  limits: {
    maxRetries: 5,
    maxRenewRetries: 3,
    initialBackoff: 1000,
    backoffFactor: 2,
  },

  messages: {
    renewalTitle: "Renovar permisos de Google",
    renewalDescription: "Tu sesión con Google ha expirado. Necesitas renovar los permisos para continuar usando todas las funciones.",
    renewalButtonText: "Renovar permisos",
    renewalSuccess: "Permisos renovados exitosamente",
    genericError: "Error al procesar la solicitud. Por favor, intenta nuevamente.",
    timeoutError: "La operación tardó demasiado. Por favor, verifica tu conexión.",
  },

  scopes: {
    forms: [
      'https://www.googleapis.com/auth/forms',
      'https://www.googleapis.com/auth/forms.body',
    ],
    drive: [
      'https://www.googleapis.com/auth/drive.file',
    ],
    additional: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },

  logging: {
    level: 'info',
    console: true,
    metrics: true,
  },

  development: {
    simulateErrors: false,
    skipChecks: false,
    fastTimeouts: false,
  },
};

// Configuración para desarrollo
export const DEVELOPMENT_GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  ...DEFAULT_GOOGLE_AUTH_CONFIG,
  intervals: {
    ...DEFAULT_GOOGLE_AUTH_CONFIG.intervals,
    autoCheck: 30 * 1000,      // 30 segundos para desarrollo
    expiryThreshold: 30 * 1000, // 30 segundos antes de expirar
    retryDelay: 500,            // 500ms para desarrollo
    maxRenewTimeout: 10 * 1000, // 10 segundos para desarrollo
  },
  development: {
    simulateErrors: false,
    skipChecks: false,
    fastTimeouts: true,
  },
  logging: {
    ...DEFAULT_GOOGLE_AUTH_CONFIG.logging,
    level: 'debug',
  },
};

// Configuración para producción
export const PRODUCTION_GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  ...DEFAULT_GOOGLE_AUTH_CONFIG,
  logging: {
    ...DEFAULT_GOOGLE_AUTH_CONFIG.logging,
    level: 'warn',
    console: false,
  },
  development: {
    simulateErrors: false,
    skipChecks: false,
    fastTimeouts: false,
  },
};

// Helper para obtener configuración según el entorno
export const getGoogleAuthConfig = (): GoogleAuthConfig => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'development':
      return DEVELOPMENT_GOOGLE_AUTH_CONFIG;
    case 'production':
      return PRODUCTION_GOOGLE_AUTH_CONFIG;
    default:
      return DEFAULT_GOOGLE_AUTH_CONFIG;
  }
};

// Helper para combinar configuraciones personalizadas
export const mergeGoogleAuthConfig = (
  customConfig: Partial<GoogleAuthConfig>
): GoogleAuthConfig => {
  const baseConfig = getGoogleAuthConfig();
  
  return {
    ...baseConfig,
    ...customConfig,
    intervals: { ...baseConfig.intervals, ...customConfig.intervals },
    limits: { ...baseConfig.limits, ...customConfig.limits },
    messages: { ...baseConfig.messages, ...customConfig.messages },
    scopes: { ...baseConfig.scopes, ...customConfig.scopes },
    logging: { ...baseConfig.logging, ...customConfig.logging },
    development: { ...baseConfig.development, ...customConfig.development },
  };
};

// Scopes combinados para uso fácil
export const getRequiredScopes = (config: GoogleAuthConfig = getGoogleAuthConfig()) => {
  return [
    ...config.scopes.forms,
    ...config.scopes.drive,
    ...config.scopes.additional,
  ];
};

// Exportar configuración actual
export const currentConfig = getGoogleAuthConfig();