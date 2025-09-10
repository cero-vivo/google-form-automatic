import React from 'react';
import { GenericStateDisplay } from './GenericStateDisplay';

// Ejemplo de uso en un componente real
export const FormListEmptyState: React.FC = () => (
  <GenericStateDisplay
    state="empty"
    title="Sin formularios"
    message="Aún no has creado ningún formulario. ¡Comienza creando tu primer formulario!"
    actionText="Crear formulario"
    onAction={() => console.log('Navegar a /create')}
  />
);

// Ejemplo de estado de carga
export const FormLoadingState: React.FC = () => (
  <GenericStateDisplay
    state="loading"
    message="Cargando tus formularios..."
  />
);

// Ejemplo de estado de error
export const FormErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <GenericStateDisplay
    state="error"
    title="Error al cargar"
    message="No pudimos cargar tus formularios. Por favor, intenta nuevamente."
    actionText="Reintentar"
    onAction={onRetry}
  />
);

// Ejemplo con estados dinámicos
export const CreditsStatusDisplay: React.FC<{ credits: number; loading: boolean }> = ({ 
  credits, 
  loading 
}) => {
  if (loading) {
    return (
      <GenericStateDisplay
        state="loading"
        message="Verificando tus créditos..."
      />
    );
  }

  if (credits === 0) {
    return (
      <GenericStateDisplay
        state="warning"
        title="Sin créditos"
        message="Has agotado todos tus créditos. Compra más para continuar creando formularios."
        actionText="Comprar créditos"
        onAction={() => console.log('Navegar a /dashboard/credits')}
      />
    );
  }

  if (credits <= 5) {
    return (
      <GenericStateDisplay
        state="warning"
        title="Créditos bajos"
        message={`Te quedan solo ${credits} créditos`}
        actionText="Comprar más"
        onAction={() => console.log('Navegar a /dashboard/credits')}
      />
    );
  }

  return null; // No mostrar nada si hay suficientes créditos
};

// Uso en componentes existentes
export const DashboardIntegrationExample: React.FC = () => {
  const [forms, setForms] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      // setForms(response.data);
      setForms([]); // Simular estado vacío
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchForms();
  }, []);

  if (loading) {
    return <FormLoadingState />;
  }

  if (error) {
    return <FormErrorState onRetry={fetchForms} />;
  }

  if (forms.length === 0) {
    return <FormListEmptyState />;
  }

  return (
    <div>
      {/* Renderizar lista de formularios */}
      <p>Formularios: {forms.length}</p>
    </div>
  );
};