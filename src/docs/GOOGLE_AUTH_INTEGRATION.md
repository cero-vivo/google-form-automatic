# Sistema de Autenticación con Google - Guía de Integración

Este documento describe cómo implementar y usar el nuevo sistema de verificación y renovación automática de permisos de Google en la aplicación FastForm.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Componentes Principales](#componentes-principales)
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
- [Integración Avanzada](#integración-avanzada)
- [Manejo de Errores](#manejo-de-errores)
- [Personalización](#personalización)

## 🏗️ Arquitectura

El sistema está diseñado con una arquitectura modular y desacoplada:

```
┌─────────────────────────────────────────┐
│           GoogleAuthProvider            │
│         (Contexto Global)               │
├─────────────────────────────────────────┤
│           useAuthWithGoogle             │
│         (Hook Principal)                │
├─────────────────────────────────────────┤
│         GoogleAuthModal                 │
│      (UI de Renovación)                 │
├─────────────────────────────────────────┤
│      GoogleAPIInterceptor               │
│   (Manejo Automático de Errores)        │
└─────────────────────────────────────────┘
```

## 🧩 Componentes Principales

### 1. `useAuthWithGoogle` - Hook Principal

Hook que centraliza toda la lógica de autenticación con Google:

```typescript
const {
  googleAuthStatus,      // Estado actual: 'valid' | 'expired' | 'renewing' | 'error' | 'checking'
  isGoogleAuthenticated, // Booleano rápido
  checkGoogleAuthStatus, // Función para verificar estado
  renewGoogleAuth,       // Función para renovar permisos
  isTokenExpired,        // Utilidad para verificar expiración
  isChecking,            // Estado de carga
  isRenewing,            // Estado de renovación
  error                  // Último error
} = useAuthWithGoogle();
```

### 2. `GoogleAuthProvider` - Contexto Global

Proveedor de contexto que debe envolver tu aplicación:

```typescript
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';

function App() {
  return (
    <GoogleAuthProvider autoCheck={true}>
      <YourApp />
    </GoogleAuthProvider>
  );
}
```

### 3. `GoogleAuthModal` - Modal de Renovación

Modal automático que se muestra cuando expiran los permisos:

```typescript
import { GoogleAuthModalWrapper } from '@/components/organisms/GoogleAuthModal';

// Se muestra automáticamente cuando es necesario
<GoogleAuthModalWrapper />

// O uso personalizado
<GoogleAuthModal 
  open={showModal}
  onOpenChange={setShowModal}
  title="Renovar permisos"
  description="Tu sesión ha expirado"
/>
```

### 4. `useGoogleAPIInterceptor` - Interceptor de Errores

Hook para manejo automático de errores de API:

```typescript
const {
  executeWithAuthRetry,  // Ejecutar operaciones con reintentos
  fetchWithAuth,         // Fetch con manejo automático
  handleGoogleFormsError, // Manejo específico de errores
  isAuthError            // Verificar si es error de autenticación
} = useGoogleAPIInterceptor();
```

## 🚀 Instalación

### 1. Envolver la aplicación

```typescript
// src/app/layout.tsx o tu archivo raíz
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleAuthProvider autoCheck={true}>
          {children}
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
```

### 2. Agregar el modal al dashboard

```typescript
// src/app/dashboard/page.tsx
import { GoogleAuthModalWrapper } from '@/components/organisms/GoogleAuthModal';

function Dashboard() {
  return (
    <div>
      {/* Tu contenido del dashboard */}
      <GoogleAuthModalWrapper />
    </div>
  );
}
```

## 🎯 Uso Básico

### Verificación Manual

```typescript
const { checkGoogleAuthStatus, isGoogleAuthenticated } = useAuthWithGoogle();

useEffect(() => {
  checkGoogleAuthStatus(); // Verificación silenciosa
}, []);
```

### Operaciones con Reintentos

```typescript
const { executeWithAuthRetry } = useGoogleAPIInterceptor();

const createForm = async (formData) => {
  try {
    const result = await executeWithAuthRetry(async () => {
      return await googleFormsService.createForm(formData);
    });
    
    console.log('Formulario creado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Uso con Fetch

```typescript
const { fetchWithAuth } = useGoogleAPIInterceptor();

const getUserForms = async () => {
  const response = await fetchWithAuth('/api/google-forms/user-forms');
  const data = await response.json();
  return data.forms;
};
```

## 🔧 Integración Avanzada

### En Componentes Existentes

```typescript
// Antes
const MyComponent = () => {
  const { userEntity } = useAuth();
  const { showError } = useBrandToast();
  
  const createForm = async () => {
    if (!userEntity?.googleAccessToken) {
      showError('Necesitas iniciar sesión', 'Conecta tu cuenta de Google para continuar.');
      return;
    }
    // ... lógica
  };
};

// Después
const MyComponent = () => {
  const { isGoogleAuthenticated, renewGoogleAuth } = useGoogleAuthContext();
  const { executeWithAuthRetry } = useGoogleAPIInterceptor();
  
  const createForm = async () => {
    if (!isGoogleAuthenticated) {
      await renewGoogleAuth();
      return;
    }
    
    const result = await executeWithAuthRetry(async () => {
      return await createGoogleForm(formData);
    });
  };
};
```

### Manejo de Múltiples Operaciones

```typescript
const performBatchOperations = async () => {
  const operations = [
    () => createForm(formData1),
    () => createForm(formData2),
    () => updateForm(formId, formData3)
  ];
  
  const results = await Promise.all(
    operations.map(op => executeWithAuthRetry(op))
  );
  
  return results;
};
```

## ⚠️ Manejo de Errores

### Tipos de Errores Manejados

- **401 Unauthorized**: Token expirado
- **403 Forbidden**: Permisos insuficientes
- **Invalid Grant**: Token inválido
- **Insufficient Scope**: Alcance insuficiente

### Personalización de Reintentos

```typescript
const result = await executeWithAuthRetry(
  operation,
  {
    maxRetries: 5,
    retryDelay: 2000,
    exponentialBackoff: true
  }
);
```

### Manejo Manual de Errores

```typescript
const handleError = async (error) => {
  const { handleGoogleFormsError, isAuthError } = useGoogleAPIInterceptor();
  
  if (isAuthError(error)) {
    const renewed = await handleGoogleFormsError(error);
    if (renewed) {
      // Reintentar operación
      return await retryOperation();
    }
  }
  
  // Manejar otros errores
  console.error('Error no relacionado con autenticación:', error);
};
```

## 🎨 Personalización

### Configuración del Modal

```typescript
<GoogleAuthModal
  title="Acceso requerido"
  description="Necesitamos renovar tus permisos de Google"
  showCloseButton={true}
  onOpenChange={handleModalChange}
/>
```

### Configuración de Intervalos

```typescript
// En useAuthWithGoogle.ts
const CONFIG = {
  CHECK_INTERVAL: 10 * 60 * 1000, // 10 minutos
  EXPIRY_THRESHOLD: 10 * 60 * 1000, // 10 minutos antes
  MAX_RETRIES: 5,
  RETRY_DELAY: 2000,
};
```

### Eventos Personalizados

```typescript
const MyComponent = () => {
  const { checkGoogleAuthStatus } = useGoogleAuthContext();
  
  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkGoogleAuthStatus(true);
      if (!isValid) {
        // Tu lógica personalizada
        analytics.track('google_auth_expired');
        showCustomNotification();
      }
    };
    
    checkAuth();
  }, []);
};
```

## 🧪 Testing

### Mock del Sistema

```typescript
// Para pruebas unitarias
const mockGoogleAuth = {
  googleAuthStatus: 'valid',
  isGoogleAuthenticated: true,
  checkGoogleAuthStatus: jest.fn(),
  renewGoogleAuth: jest.fn(),
};

jest.mock('@/providers/GoogleAuthProvider', () => ({
  useGoogleAuthContext: () => mockGoogleAuth,
}));
```

## 📊 Monitoreo

### Métricas Recomendadas

- Tiempo de renovación de tokens
- Frecuencia de expiraciones
- Tasa de éxito en renovaciones
- Errores de autenticación por usuario

### Logging

```typescript
const { googleAuthStatus, error } = useGoogleAuthContext();

useEffect(() => {
  console.log('📊 Google Auth Status:', {
    status: googleAuthStatus,
    timestamp: new Date().toISOString(),
    error: error
  });
}, [googleAuthStatus, error]);
```

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca almacenar tokens en localStorage**
2. **Verificar scopes necesarios**
3. **Implementar rate limiting**
4. **Validar respuestas de la API**
5. **Manejar timeouts apropiadamente**

### Verificación de Scopes

```typescript
const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/forms',
  'https://www.googleapis.com/auth/drive.file'
];

const hasRequiredScopes = (grantedScopes: string[]) => {
  return REQUIRED_SCOPES.every(scope => grantedScopes.includes(scope));
};
```

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Modal no aparece**
   - Verificar que `GoogleAuthProvider` esté envolviendo la app
   - Comprobar que `GoogleAuthModalWrapper` esté presente

2. **Renovación falla**
   - Verificar configuración de Firebase
   - Comprobar scopes de Google OAuth

3. **Reintentos infinitos**
   - Ajustar `MAX_RETRIES`
   - Implementar backoff exponencial

4. **Performance issues**
   - Ajustar `CHECK_INTERVAL`
   - Usar `silent: true` en checks periódicos

## 📞 Soporte

Para problemas o preguntas:

1. Verificar logs de consola
2. Revisar configuración de Firebase
3. Comprobar scopes de Google API
4. Consultar documentación de Google OAuth 2.0

---

*Última actualización: Diciembre 2024*
