# Guía de Migración: Nuevo Flujo de Autenticación Google

## Resumen de Cambios

Se ha implementado un nuevo sistema de verificación silenciosa de permisos de Google que **solo muestra el modal de renovación cuando es estrictamente necesario**, en lugar de mostrarlo preventivamente.

## 🆕 Sistema Nuevo vs Sistema Antiguo

### Sistema Antiguo (Obsoleto)
```typescript
// ❌ Mostraba el modal preventivamente
<GoogleAuthProvider autoCheck={true}>
  <DashboardContent />
  <GoogleAuthModalWrapper /> {/* Siempre renderizado */}
</GoogleAuthProvider>
```

### Sistema Nuevo (✅ Recomendado)
```typescript
// ✅ Solo muestra el modal después de verificación real
<GoogleAuthCheckProvider>
  <DashboardContent />
  <GoogleAuthCheckModal /> {/* Solo aparece si es necesario */}
</GoogleAuthCheckProvider>
```

## 🚀 Implementación Rápida

### 1. Reemplazar el Provider

**Antes:**
```typescript
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';
import { GoogleAuthModalWrapper } from '@/components/organisms/GoogleAuthModal';

<GoogleAuthProvider autoCheck={true}>
  <TuComponente />
  <GoogleAuthModalWrapper />
</GoogleAuthProvider>
```

**Después:**
```typescript
import { GoogleAuthCheckProvider } from '@/providers/GoogleAuthCheckProvider';
import { GoogleAuthCheckModal } from '@/components/GoogleAuthCheckModal';

<GoogleAuthCheckProvider>
  <TuComponente />
  <GoogleAuthCheckModal />
</GoogleAuthCheckProvider>
```

### 2. Usar el Hook para Verificación

```typescript
import { useGoogleAuthCheckContext } from '@/providers/GoogleAuthCheckProvider';

function MiComponente() {
  const { status, isLoading, error } = useGoogleAuthCheckContext();

  if (isLoading) {
    return <div>Verificando permisos...</div>;
  }

  if (status === 'expired') {
    // El modal aparecerá automáticamente
    return <div>Esperando renovación de permisos...</div>;
  }

  if (status === 'valid') {
    return <div>✅ Permisos válidos - puedes continuar</div>;
  }

  return <div>Contenido normal</div>;
}
```

## 📊 Estados del Sistema

| Estado | Descripción | Acción | UI |
|--------|-------------|---------|-----|
| `checking` | Verificación silenciosa en progreso | Esperar | Loading spinner |
| `valid` | Permisos válidos | Continuar normal | Contenido normal |
| `expired` | Permisos expirados | Mostrar modal | Modal de renovación |
| `error` | Error de conexión | Mostrar error | Mensaje de error |

## 🔧 API de Verificación

### Hook: `useGoogleAuthCheck()`

```typescript
const {
  status,      // 'checking' | 'valid' | 'expired' | 'error'
  isLoading,   // boolean
  error,       // Error | null
  checkAuth,   // () => Promise<void> - forzar verificación
  reset        // () => void - resetear estado
} = useGoogleAuthCheckContext();
```

### Provider: `GoogleAuthCheckProvider`

```typescript
interface GoogleAuthCheckProviderProps {
  children: React.ReactNode;
  autoCheck?: boolean; // true por defecto
  testEndpoint?: string; // '/api/google-forms/test-connection' por defecto
}
```

## 🧪 Testing

### Verificación Manual

Para probar el flujo manualmente:

1. **Permisos Válidos**: Inicia sesión con Google y accede al dashboard - no debería aparecer ningún modal.

2. **Permisos Expirados**: 
   - Ve a tu cuenta de Google
   - Revoca los permisos para la aplicación
   - Regresa al dashboard - debería aparecer el modal de renovación

3. **Error de Red**: Desconecta tu internet y accede al dashboard - debería mostrar un mensaje de error apropiado.

### Testing Automatizado

```typescript
// Ejemplo de test con React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import { GoogleAuthCheckProvider } from '@/providers/GoogleAuthCheckProvider';

test('no muestra modal cuando los permisos son válidos', async () => {
  mockGoogleAPIResponse({ status: 200, data: { forms: [] } });
  
  render(
    <GoogleAuthCheckProvider>
      <Dashboard />
    </GoogleAuthCheckProvider>
  );

  expect(screen.queryByText('Renovar Permisos')).not.toBeInTheDocument();
});

test('muestra modal cuando los permisos están expirados', async () => {
  mockGoogleAPIResponse({ status: 401, error: 'invalid_grant' });
  
  render(
    <GoogleAuthCheckProvider>
      <Dashboard />
    </GoogleAuthCheckProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Renovar Permisos')).toBeInTheDocument();
  });
});
```

## 🔄 Migración Paso a Paso

### Paso 1: Identificar Componentes
Busca todos los archivos que usen:
- `GoogleAuthProvider`
- `GoogleAuthModalWrapper`
- `useGoogleAPIInterceptor`

### Paso 2: Reemplazar Imports
```bash
# Buscar y reemplazar en tu IDE
# De: import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider'
# A: import { GoogleAuthCheckProvider } from '@/providers/GoogleAuthCheckProvider'

# De: import { GoogleAuthModalWrapper } from '@/components/organisms/GoogleAuthModal'
# A: import { GoogleAuthCheckModal } from '@/components/GoogleAuthCheckModal'
```

### Paso 3: Actualizar Componentes
Reemplaza cada instancia del patrón antiguo con el nuevo:

```typescript
// Antiguo
<GoogleAuthProvider autoCheck={true}>
  <Component />
  <GoogleAuthModalWrapper />
</GoogleAuthProvider>

// Nuevo
<GoogleAuthCheckProvider>
  <Component />
  <GoogleAuthCheckModal />
</GoogleAuthCheckProvider>
```

## 🐛 Solución de Problemas

### El modal no aparece cuando debería
1. Verifica que el endpoint `/api/google-forms/test-connection` esté funcionando
2. Revisa los logs de consola para errores
3. Asegúrate de que el `GoogleAuthCheckProvider` esté correctamente envolviendo el componente

### El modal aparece siempre
1. Verifica que no estés usando el sistema antiguo en paralelo
2. Asegúrate de que no haya múltiples instancias del provider
3. Revisa que el endpoint de verificación esté retornando 200 para permisos válidos

### Performance issues
1. El sistema cachea la verificación por 5 minutos
2. Puedes forzar una nueva verificación con `checkAuth()`
3. Usa el estado `isLoading` para mostrar indicadores apropiados

## 📁 Archivos Relacionados

- `/src/hooks/useGoogleAuthCheck.ts` - Hook principal
- `/src/providers/GoogleAuthCheckProvider.tsx` - Context Provider
- `/src/components/GoogleAuthCheckModal.tsx` - Modal condicional
- `/src/app/api/google-forms/test-connection/route.ts` - Endpoint de verificación
- `/src/examples/AuthCheckIntegrationExample.tsx` - Ejemplos de uso

## 🎯 Próximos Pasos

1. [ ] Migrar todos los componentes del dashboard
2. [ ] Actualizar la documentación de componentes individuales
3. [ ] Agregar tests de integración
4. [ ] Optimizar el tiempo de carga de la verificación
5. [ ] Agregar métricas de uso del modal

## ❓ FAQ

**P: ¿Puedo usar ambos sistemas simultáneamente?**
R: No, esto causará conflictos. Migra completamente al nuevo sistema.

**P: ¿El sistema funciona sin conexión a internet?**
R: No, requiere conexión para verificar los permisos con Google.

**P: ¿Puedo personalizar el mensaje del modal?**
R: Sí, el modal acepta props para personalizar el contenido.

**P: ¿Cómo forzo una verificación manual?**
R: Usa el método `checkAuth()` del hook `useGoogleAuthCheckContext()`.