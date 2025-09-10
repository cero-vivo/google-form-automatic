import React from 'react';
import { GoogleAuthCheckProvider, useGoogleAuthCheckContext } from '@/providers/GoogleAuthCheckProvider';
import { GoogleAuthCheckModal } from '@/components/GoogleAuthCheckModal';

/**
 * Ejemplo de integración del nuevo flujo de autenticación
 * 
 * Este ejemplo muestra cómo usar useGoogleAuthCheck() en diferentes escenarios
 */

// Ejemplo 1: Dashboard principal
const DashboardWithAuthCheck = () => {
  const { status, isLoading, error } = useGoogleAuthCheckContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* El modal aparecerá automáticamente si status === 'expired' */}
      
      {status === 'valid' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800">✅ Permisos de Google válidos</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">❌ Error: {typeof error === 'string' ? error : error && typeof error === 'object' && 'message' in error ? (error as Error).message : 'Error desconocido'}</p>
        </div>
      )}
      
      {/* Contenido del dashboard */}
      <div className="mt-4">
        <p>Contenido del dashboard aquí...</p>
      </div>
    </div>
  );
};

// Ejemplo 2: Componente que requiere autenticación para operaciones específicas
const GoogleFormsManager = () => {
  const { status, isLoading } = useGoogleAuthCheckContext();

  const handleCreateForm = async () => {
    if (status !== 'valid') {
      console.log('Esperando renovación de permisos...');
      return;
    }
    
    // Proceder con la creación del formulario
    console.log('Creando formulario...');
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={handleCreateForm}
        disabled={status !== 'valid' || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Verificando...' : 'Crear Formulario'}
      </button>
    </div>
  );
};

// Ejemplo 3: Wrapper para páginas protegidas
const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleAuthCheckProvider>
      <div className="min-h-screen">
        {children}
        {/* Modal condicional */}
        <GoogleAuthCheckModal />
      </div>
    </GoogleAuthCheckProvider>
  );
};

// Uso completo
export const AuthCheckIntegrationExample = () => {
  return (
    <ProtectedPage>
      <DashboardWithAuthCheck />
    </ProtectedPage>
  );
};

// Ejemplo 4: Hook personalizado para operaciones con verificación
const useAuthenticatedGoogleOperation = () => {
  const { status, isLoading } = useGoogleAuthCheckContext();

  const executeOperation = async (operation: () => Promise<void>) => {
    if (isLoading) {
      console.log('Esperando verificación...');
      return { success: false, error: 'Verificando permisos' };
    }

    if (status === 'expired') {
      console.log('Permisos expirados, esperando renovación...');
      return { success: false, error: 'Permisos expirados' };
    }

    if (status === 'error') {
      return { success: false, error: 'Error de autenticación' };
    }

    try {
      await operation();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  return { executeOperation, status, isLoading };
};

// Ejemplo de uso del hook personalizado
const FormCreator = () => {
  const { executeOperation, status, isLoading } = useAuthenticatedGoogleOperation();

  const createForm = async () => {
    const result = await executeOperation(async () => {
      // Llamada real a la API de Google Forms
      console.log('Creando formulario en Google Forms...');
    });

    if (result.success) {
      console.log('Formulario creado exitosamente');
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <div>
      <button 
        onClick={createForm}
        disabled={isLoading || status !== 'valid'}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Verificando...' : 'Crear Formulario'}
      </button>
    </div>
  );
};

export default {
  DashboardWithAuthCheck,
  GoogleFormsManager,
  ProtectedPage,
  AuthCheckIntegrationExample,
  FormCreator
};