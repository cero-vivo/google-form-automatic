# GenericStateDisplay - Componente de Estados Genérico

## Descripción

`GenericStateDisplay` es un componente reutilizable que maneja estados comunes (cargando, vacío, error, éxito, advertencia) con textos personalizables y acciones opcionales.

## Propiedades

| Propiedad | Tipo | Descripción | Requerido |
|-----------|------|-------------|-----------|
| `state` | `'loading' \| 'empty' \| 'error' \| 'success' \| 'warning'` | Estado visual a mostrar | Sí |
| `title` | `string` | Título del estado | No |
| `message` | `string` | Mensaje descriptivo | Sí |
| `actionText` | `string` | Texto del botón de acción | No |
| `onAction` | `() => void` | Función a ejecutar al hacer clic en el botón | No |
| `className` | `string` | Clases CSS adicionales | No |

## Estados Visuales

### 🔄 Loading (Cargando)
- **Icono**: Spinner animado
- **Color**: Gris neutro
- **Uso**: Operaciones asíncronas, carga inicial

```tsx
<GenericStateDisplay
  state="loading"
  message="Procesando tu pago..."
/>
```

### 📭 Empty (Vacío)
- **Icono**: Carpeta vacía
- **Color**: Gris neutro
- **Uso**: Listas sin elementos, resultados vacíos

```tsx
<GenericStateDisplay
  state="empty"
  title="Sin formularios"
  message="Aún no has creado ningún formulario"
  actionText="Crear formulario"
  onAction={() => router.push('/create')}
/>
```

### ❌ Error
- **Icono**: Círculo con X
- **Color**: Rojo
- **Uso**: Errores de API, fallos de conexión

```tsx
<GenericStateDisplay
  state="error"
  title="Error de conexión"
  message="No pudimos conectar con el servidor"
  actionText="Reintentar"
  onAction={handleRetry}
/>
```

### ✅ Success (Éxito)
- **Icono**: Checkmark
- **Color**: Verde
- **Uso**: Operaciones exitosas, confirmaciones

```tsx
<GenericStateDisplay
  state="success"
  title="¡Pago exitoso!"
  message="Tu pago ha sido procesado correctamente"
  actionText="Ver créditos"
  onAction={() => router.push('/dashboard/credits')}
/>
```

### ⚠️ Warning (Advertencia)
- **Icono**: Triángulo con !
- **Color**: Amarillo
- **Uso**: Advertencias, límites alcanzados

```tsx
<GenericStateDisplay
  state="warning"
  title="Créditos bajos"
  message="Te quedan solo 3 créditos"
  actionText="Comprar más"
  onAction={() => router.push('/dashboard/credits')}
/>
```

## Casos de Uso Comunes

### 1. Listas de Formularios
```tsx
const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) return <GenericStateDisplay state="loading" message="Cargando formularios..." />;
  if (error) return <GenericStateDisplay state="error" title="Error" message={error} actionText="Reintentar" onAction={fetchForms} />;
  if (forms.length === 0) return <GenericStateDisplay state="empty" title="Sin formularios" message="Crea tu primer formulario" actionText="Crear" onAction={createForm} />;

  return <div>{/* Lista de formularios */}</div>;
};
```

### 2. Estados de Créditos
```tsx
const CreditsStatus = ({ credits }) => {
  if (credits === 0) {
    return (
      <GenericStateDisplay
        state="warning"
        title="Sin créditos"
        message="Has agotado todos tus créditos"
        actionText="Comprar créditos"
        onAction={() => router.push('/dashboard/credits')}
      />
    );
  }
  
  return null;
};
```

### 3. Estados de Pago
```tsx
const PaymentStatus = ({ status }) => {
  switch (status) {
    case 'processing':
      return <GenericStateDisplay state="loading" message="Procesando pago..." />;
    case 'success':
      return <GenericStateDisplay state="success" title="¡Pago exitoso!" message="Créditos agregados" />;
    case 'error':
      return <GenericStateDisplay state="error" title="Error de pago" message="Intenta nuevamente" actionText="Reintentar" />;
    default:
      return null;
  }
};
```

## Estilización Personalizada

Puedes agregar clases CSS adicionales para personalizar el componente:

```tsx
<GenericStateDisplay
  state="empty"
  title="Sin datos"
  message="No hay información disponible"
  className="max-w-md mx-auto p-8"
/>
```

## Integración con Hooks

### Con useCredits
```tsx
const CreditsDisplay = () => {
  const { currentCredits, loading } = useCredits();

  if (loading) {
    return <GenericStateDisplay state="loading" message="Verificando créditos..." />;
  }

  if (currentCredits === 0) {
    return (
      <GenericStateDisplay
        state="warning"
        title="Sin créditos"
        message="Compra más créditos para continuar"
        actionText="Comprar ahora"
        onAction={() => router.push('/dashboard/credits')}
      />
    );
  }

  return <div>Tienes {currentCredits} créditos</div>;
};
```

### Con useAuth
```tsx
const AuthRequired = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <GenericStateDisplay state="loading" message="Verificando autenticación..." />;
  }

  if (!user) {
    return (
      <GenericStateDisplay
        state="error"
        title="Requiere inicio de sesión"
        message="Por favor, inicia sesión para continuar"
        actionText="Iniciar sesión"
        onAction={() => router.push('/auth/login')}
      />
    );
  }

  return children;
};
```