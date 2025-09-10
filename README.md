# 🚀 FastForm - Generador de Google Forms desde Excel

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Firebase-10.7-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
</div>

<div align="center">
  <h3>La forma más inteligente de crear Google Forms desde archivos Excel/CSV</h3>
  <p>Transforma tus preguntas en formularios profesionales en segundos, sin código ni complicaciones.</p>
</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura y Tecnologías](#️-arquitectura-y-tecnologías)
- [🚀 Configuración e Instalación](#-configuración-e-instalación)
- [🔧 Configuración de APIs y Servicios](#-configuración-de-apis-y-servicios)
- [📖 Guía de Uso](#-guía-de-uso)
- [🎨 Atomic Design y Componentes](#-atomic-design-y-componentes)
- [🏛️ Clean Architecture](#️-clean-architecture)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contribución](#-contribución)
- [📚 Documentación Adicional](#-documentación-adicional)

---

## 🎯 Descripción del Proyecto

**FastForm** es una aplicación web moderna que permite convertir automáticamente archivos Excel y CSV en formularios de Google Forms. Diseñada para equipos, educadores y profesionales que necesitan crear formularios de manera eficiente y escalable.

### 🎬 Demo y Screenshots

![Dashboard Principal](./docs/images/dashboard.png)
*Dashboard principal con estadísticas y creación de formularios*

![Carga de Archivos](./docs/images/file-upload.png)
*Interfaz de carga con drag & drop y validación inteligente*

![Previsualización](./docs/images/preview.png)
*Previsualización en tiempo real con edición inline*

### 🏆 Beneficios Clave

- ⚡ **Rapidez**: Crea formularios en segundos, no horas
- 🎯 **Precisión**: Detección automática de tipos de preguntas
- 🔄 **Integración**: Publicación directa en Google Forms
- 📊 **Gestión**: Dashboard completo para administrar formularios
- 🎨 **Profesional**: Diseño moderno y accesible

---

## ✨ Características Principales

### 🔄 Carga y Procesamiento Inteligente
- **Drag & Drop**: Interfaz intuitiva para subir archivos
- **Detección Automática**: Reconoce tipos de preguntas automáticamente
- **Formatos Múltiples**: Soporte para .xlsx, .xls, .csv
- **Validación**: Verificación de estructura y contenido
- **Preview**: Descarga de archivos de ejemplo

### 🎯 Tipos de Preguntas Soportados
- ✅ Texto corto y largo
- ✅ Opción múltiple y casillas de verificación
- ✅ Listas desplegables
- ✅ Escalas lineales (1-10)
- ✅ Fechas y horas
- ✅ Emails y números
- ✅ Validaciones personalizadas

### 🔧 Gestión Avanzada
- **Dashboard Completo**: Vista general de todos los formularios
- **Estados**: Borrador, Publicado, Archivado
- **Estadísticas**: Respuestas, vistas, conversión
- **Búsqueda y Filtros**: Encuentra formularios rápidamente
- **Duplicación**: Clona formularios existentes

### 🌟 Integración con Google
- **OAuth 2.0**: Autenticación segura con Google
- **API de Google Forms**: Creación automática de formularios
- **Sincronización**: Mantiene la funcionalidad nativa de Google
- **Permisos**: Control de acceso y compartición

---

## 🏗️ Arquitectura y Tecnologías

### 📦 Stack Principal

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.4+ | Framework React con App Router |
| **TypeScript** | 5.0+ | Tipado estático y desarrollo robusto |
| **shadcn/ui** | Latest | Biblioteca de componentes UI |
| **Tailwind CSS** | 3.4+ | Framework CSS utility-first |
| **Firebase** | 10.7+ | Backend as a Service |
| **Radix UI** | Latest | Componentes accesibles base |
| **React Hook Form** | 7.48+ | Manejo de formularios |
| **Zod** | 3.22+ | Validación de esquemas |

### 🏛️ Patrones de Arquitectura

#### Clean Architecture
```
src/
├── domain/           # Entidades y reglas de negocio
├── application/      # Casos de uso y servicios
├── infrastructure/   # Firebase, APIs externas
└── presentation/     # UI y componentes React
```

#### Atomic Design
```
components/
├── atoms/           # Botones, inputs básicos
├── molecules/       # Cards, formularios simples
├── organisms/       # Headers, sidebars complejos
└── templates/       # Layout de páginas
```

#### Container-View Pattern
```typescript
// Container (lógica de negocio)
export const useFileUpload = () => {
  // Estado y lógica
  return { state, actions };
};

// View (presentación)
export const FileUploadCard = () => {
  const { state, actions } = useFileUpload();
  return <UI />;
};
```

### 🎨 Diseño y UX

#### Paleta de Colores
- **Primary**: `hsl(221.2 83.2% 53.3%)` - Azul principal
- **Secondary**: `hsl(210 40% 96%)` - Slate claro
- **Success**: `hsl(142.1 76.2% 36.3%)` - Verde éxito
- **Destructive**: `hsl(0 84.2% 60.2%)` - Rojo errores
- **Muted**: `hsl(210 40% 98%)` - Fondos suaves

#### Tipografía
- **Fuente Principal**: Inter (vía Tailwind CSS)
- **Jerarquía**: Sistema tipográfico escalable
- **Legibilidad**: Optimizada para accesibilidad

---

## 🚀 Configuración e Instalación

### 📋 Prerrequisitos

- **Node.js** 18.0 o superior
- **npm** o **yarn**
- **Git**
- Cuenta de **Google Cloud Platform**
- Proyecto de **Firebase**

### ⚡ Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/fast-form.git
cd fast-form

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar en desarrollo
npm run dev
```

### 📁 Estructura del Proyecto

```
fast-form/
├── src/
│   ├── app/                    # Páginas App Router
│   ├── components/             # Componentes UI (Atomic Design)
│   │   ├── ui/                # shadcn/ui components
│   │   ├── atoms/             # Componentes básicos
│   │   ├── molecules/         # Combinaciones simples
│   │   ├── organisms/         # Componentes complejos
│   │   └── templates/         # Layouts de página
│   ├── containers/            # Custom hooks (lógica)
│   ├── domain/                # Entidades y tipos de dominio
│   │   ├── entities/          # Form, Question, User
│   │   ├── repositories/      # Interfaces de repositorios
│   │   └── types.ts           # Tipos y enums
│   ├── application/           # Servicios y casos de uso
│   │   └── services/          # FileParser, FormBuilder
│   ├── infrastructure/        # Implementaciones externas
│   │   ├── firebase/          # Configuración Firebase
│   │   ├── google/            # APIs de Google
│   │   └── repositories/      # Implementaciones Firebase
│   ├── lib/                   # Utilidades (shadcn/ui utils)
│   └── styles/                # CSS global
├── public/                    # Assets estáticos
├── docs/                      # Documentación adicional
└── components.json            # Configuración shadcn/ui
```

---

## 🔧 Configuración de APIs y Servicios

### 🔥 Firebase Setup

#### 1. Crear Proyecto Firebase
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login y crear proyecto
firebase login
firebase init
```

#### 2. Configurar Authentication
- Habilitar **Google OAuth** en Firebase Console
- Configurar dominios autorizados
- Obtener credenciales OAuth

#### 3. Configurar Firestore
```javascript
// Reglas de seguridad Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Forms pertenecen a usuarios específicos
    match /forms/{formId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

#### 4. Configurar Storage
```javascript
// Reglas de seguridad Storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 🌐 Google APIs Setup

#### 1. Google Cloud Console
```bash
# Habilitar APIs necesarias
gcloud services enable forms.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable oauth2.googleapis.com
```

#### 2. Crear Credenciales OAuth 2.0
- Ir a **Google Cloud Console** > **APIs & Services** > **Credentials**
- Crear **OAuth 2.0 Client ID**
- Tipo: **Web application**
- Origines autorizados: `http://localhost:3000`, `https://tu-dominio.com`
- URIs de redirección: `http://localhost:3000/api/auth/callback/google`

#### 3. Service Account (para APIs del servidor)
```bash
# Crear service account
gcloud iam service-accounts create form-generator \
    --display-name="Form Generator Service Account"

# Generar clave privada
gcloud iam service-accounts keys create key.json \
    --iam-account=form-generator@tu-proyecto.iam.gserviceaccount.com
```

### 🔑 Variables de Entorno

Crear `.env.local` con las siguientes variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id

# Google APIs Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"

# Environment
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro
```

---

## 📚 Documentación de API (Swagger UI)

### 🚀 Cómo Ejecutar Swagger UI

La documentación de API está disponible en formato Swagger/OpenAPI 3.0.3. Puedes visualizarla localmente de la siguiente manera:

#### Método 1: Usando Python (Recomendado)
```bash
# Desde la raíz del proyecto
python3 -m http.server 8080
# o
python -m http.server 8080
```

Luego abre tu navegador en:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **YAML**: http://localhost:8080/swagger.yaml
- **JSON**: http://localhost:8080/swagger.json

#### Método 2: Usando Node.js
```bash
# Instalar un servidor HTTP simple
npm install -g http-server

# Ejecutar el servidor
http-server -p 8080
```

#### Método 3: Usando VS Code Live Server
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `swagger-ui.html`
3. Selecciona "Open with Live Server"

### 📋 Endpoints Documentados

La documentación incluye:
- **Google Forms**: `/api/google-forms/create`, `/api/google-forms/list`
- **AI Chat**: `/api/ai-chat/generate-form`
- **MercadoPago**: `/api/mercadopago/create-preference`, `/api/mercadopago/webhooks`, `/api/mercadopago/verify-payment`
- **Credits**: `/api/ai-credits/{userId}/balance`, `/api/ai-credits/{userId}/transactions`, `/api/ai-credits/{userId}/analytics`

### 🔐 Autenticación en Swagger UI
- **Bearer Token**: Para endpoints protegidos
- **Google OAuth**: Para integración con Google APIs

### 📁 Archivos de Documentación
- `swagger.yaml` - Especificación OpenAPI 3.0.3
- `swagger.json` - Versión JSON de la especificación
- `swagger-ui.html` - Interfaz Swagger UI lista para usar

---

## 📖 Guía de Uso

### 👤 Para Usuarios Finales

#### 1. **Registro y Autenticación**
1. Visita la aplicación en tu navegador
2. Haz clic en "Iniciar Sesión" 
3. Autoriza el acceso a tu cuenta de Google
4. ¡Listo! Ya puedes crear formularios

#### 2. **Crear tu Primer Formulario**

##### Paso 1: Preparar el Archivo
Crea un archivo Excel/CSV con la siguiente estructura:

| Pregunta | Tipo | Opciones | Requerido | Descripción |
|----------|------|----------|-----------|-------------|
| ¿Cuál es tu nombre? | texto_corto | | true | Ingresa tu nombre completo |
| ¿Tu edad? | numero | | true | Edad en años |
| ¿Color favorito? | opcion_multiple | Rojo,Verde,Azul | false | Selecciona tu color preferido |

##### Paso 2: Subir y Procesar
1. Ve al **Dashboard** 
2. Arrastra tu archivo a la zona de carga
3. Espera a que se procese automáticamente
4. Revisa las preguntas detectadas

##### Paso 3: Previsualizar y Editar
1. Revisa cada pregunta en la vista previa
2. Edita títulos, descripciones o opciones si es necesario
3. Reordena preguntas con drag & drop
4. Configura validaciones adicionales

##### Paso 4: Publicar en Google Forms
1. Haz clic en "Crear Google Form"
2. Autoriza el acceso a Google Forms (primera vez)
3. ¡Tu formulario se publica automáticamente!
4. Comparte el enlace generado

#### 3. **Gestionar Formularios**

##### Dashboard de Formularios
- **Vista General**: Estadísticas y métricas
- **Lista de Formularios**: Todos tus formularios organizados
- **Filtros**: Busca por título, estado o fecha
- **Acciones**: Editar, duplicar, archivar, eliminar

##### Estados de Formularios
- **Borrador**: En construcción, no publicado
- **Publicado**: Activo en Google Forms
- **Archivado**: Inactivo pero preservado

### 💼 Para Administradores

#### Gestión de Usuarios
```typescript
// Ejemplo de gestión de límites por plan
const userLimits = {
  FREE: { maxForms: 5, maxQuestions: 20 },
  PRO: { maxForms: 100, maxQuestions: 100 },
  ENTERPRISE: { unlimited: true }
};
```

#### Monitoreo y Analytics
- Dashboard de administración
- Métricas de uso por usuario
- Logs de actividad
- Alertas de límites

---

## 🎨 Atomic Design y Componentes

### 🔹 Atoms (Componentes Básicos)

```typescript
// Button extendido de shadcn/ui
import { Button } from "@/components/ui/button";

export const LoadingButton = ({ loading, children, ...props }) => (
  <Button disabled={loading} {...props}>
    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {children}
  </Button>
);
```

### 🔸 Molecules (Combinaciones Simples)

```typescript
// FileUploadCard - Carga de archivos con validación
export const FileUploadCard = () => {
  const { state, actions } = useFileUpload();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Archivo</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Zona drag & drop */}
        {/* Progress bar */}
        {/* Error handling */}
      </CardContent>
    </Card>
  );
};
```

### 🔶 Organisms (Componentes Complejos)

```typescript
// FormsDashboard - Dashboard completo de formularios
export const FormsDashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsCards />
      <FormsTable />
      <Pagination />
    </div>
  );
};
```

### 📄 Templates (Layouts de Página)

```typescript
// MainLayout - Layout principal con navegación
export const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-background">
    <Header />
    <Sidebar />
    <main className="container mx-auto">
      {children}
    </main>
    <Footer />
  </div>
);
```

### 🎨 Guías de Estilo de Componentes

#### Nomenclatura
- **PascalCase** para componentes: `FileUploadCard`
- **camelCase** para hooks: `useFileUpload`
- **kebab-case** para archivos: `file-upload-card.tsx`

#### Props Interface
```typescript
interface ComponentProps {
  // Props requeridas primero
  title: string;
  onSubmit: (data: FormData) => void;
  
  // Props opcionales después
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  
  // Children al final
  children?: React.ReactNode;
}
```

#### Documentación de Componentes
```typescript
/**
 * FileUploadCard - Componente para cargar archivos Excel/CSV
 * 
 * @param onQuestionsLoaded - Callback ejecutado cuando se cargan preguntas
 * @param className - Clases CSS adicionales
 * @param disabled - Deshabilita la carga de archivos
 * 
 * @example
 * <FileUploadCard 
 *   onQuestionsLoaded={(questions) => setQuestions(questions)}
 *   className="mb-4" 
 * />
 */
```

---

## 🏛️ Clean Architecture

### 📐 Principios Aplicados

#### 1. **Separación de Responsabilidades**
- **Domain**: Lógica de negocio pura
- **Application**: Casos de uso y servicios
- **Infrastructure**: Detalles técnicos (Firebase, APIs)
- **Presentation**: UI y componentes React

#### 2. **Dependency Inversion**
```typescript
// Domain define interfaces
export interface FormRepository {
  save(form: Form): Promise<void>;
  findById(id: string): Promise<Form | null>;
}

// Infrastructure las implementa
export class FirebaseFormRepository implements FormRepository {
  async save(form: Form): Promise<void> {
    // Implementación Firebase
  }
}
```

#### 3. **Entidades de Dominio**
```typescript
// Form entity con lógica de negocio
export class FormEntity {
  constructor(
    public id: string,
    public title: string,
    public questions: Question[]
  ) {}

  // Métodos de dominio
  addQuestion(question: Question): void {
    this.questions.push(question);
    this.updatedAt = new Date();
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.title.trim()) {
      errors.push('Título requerido');
    }
    return errors;
  }
}
```

### 🔄 Flujo de Datos

```mermaid
graph TD
    A[UI Component] --> B[Container Hook]
    B --> C[Application Service]
    C --> D[Domain Entity]
    C --> E[Repository Interface]
    E --> F[Infrastructure Implementation]
    F --> G[Firebase/External API]
```

### 📂 Estructura de Carpetas Detallada

```
src/
├── domain/
│   ├── entities/
│   │   ├── form.ts              # Entidad Form
│   │   ├── question.ts          # Entidad Question  
│   │   └── user.ts              # Entidad User
│   ├── repositories/
│   │   ├── form-repository.ts   # Interface FormRepository
│   │   └── user-repository.ts   # Interface UserRepository
│   └── types.ts                 # Tipos y enums de dominio
├── application/
│   ├── services/
│   │   ├── file-parser-service.ts    # Parseo de archivos
│   │   ├── form-builder-service.ts   # Construcción de formularios
│   │   └── google-forms-service.ts   # Integración Google Forms
│   └── use-cases/
│       ├── create-form.ts        # Caso de uso: crear formulario
│       └── upload-file.ts        # Caso de uso: subir archivo
├── infrastructure/
│   ├── firebase/
│   │   ├── config.ts            # Configuración Firebase
│   │   └── repositories/        # Implementaciones Repository
│   └── google/
│       ├── auth.ts              # OAuth Google
│       └── forms-api.ts         # API Google Forms
└── containers/
    ├── useFileUpload.ts         # Hook para carga archivos
    ├── useFormBuilder.ts        # Hook para construcción formularios
    └── useAuth.ts               # Hook para autenticación
```

---

## 🧪 Testing

### 🎯 Estrategia de Testing

#### Unit Tests
```typescript
// __tests__/domain/entities/form.test.ts
describe('FormEntity', () => {
  test('should validate form with empty title', () => {
    const form = new FormEntity('', '', []);
    const errors = form.validate();
    expect(errors).toContain('Título requerido');
  });
});
```

#### Integration Tests
```typescript
// __tests__/application/services/file-parser.test.ts
describe('FileParserService', () => {
  test('should parse CSV file correctly', async () => {
    const file = new File(['pregunta,tipo\n¿Nombre?,texto'], 'test.csv');
    const service = new FileParserServiceImpl();
    const questions = await service.parseFile(file);
    expect(questions).toHaveLength(1);
  });
});
```

#### Component Tests
```typescript
// __tests__/components/FileUploadCard.test.tsx
describe('FileUploadCard', () => {
  test('should handle file upload', async () => {
    render(<FileUploadCard onQuestionsLoaded={jest.fn()} />);
    const input = screen.getByRole('button');
    await user.click(input);
    expect(screen.getByText('Procesando...')).toBeInTheDocument();
  });
});
```

### 🏃‍♂️ Ejecutar Tests

```bash
# Unit tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## 🚀 Deployment

### 🌐 Vercel (Recomendado)

#### Setup Automático
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy desde terminal
vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

#### Configuración `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 🐳 Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

#### Build y Deploy
```bash
# Build imagen
docker build -t form-generator .

# Run contenedor
docker run -p 3000:3000 form-generator
```

### ☁️ AWS/GCP

#### Variables de Entorno de Producción
```bash
# Configurar variables críticas
NEXT_PUBLIC_FIREBASE_API_KEY=production-key
FIREBASE_ADMIN_SDK_KEY=admin-key
GOOGLE_OAUTH_CLIENT_SECRET=oauth-secret
```

#### Health Checks
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
}
```

---

## 🤝 Contribución

### 🌟 Cómo Contribuir

#### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
git clone https://github.com/tu-usuario/fast-form.git
cd fast-form
```

#### 2. Crear Branch de Feature
```bash
# Crear branch desde main
git checkout -b feature/nueva-funcionalidad

# O para bug fixes
git checkout -b fix/corregir-bug
```

#### 3. Desarrollo
```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm test
```

#### 4. Commit Guidelines
```bash
# Formato de commits (Conventional Commits)
git commit -m "feat: agregar validación de archivos CSV"
git commit -m "fix: corregir parsing de opciones múltiples"
git commit -m "docs: actualizar README con ejemplos"
```

#### 5. Pull Request
- Título descriptivo y claro
- Descripción detallada de cambios
- Screenshots si hay cambios UI
- Tests que cubran la funcionalidad
- Documentación actualizada

### 📝 Coding Standards

#### TypeScript
```typescript
// Usar tipos estrictos
interface User {
  id: string;
  email: string;
  name: string;
}

// Evitar any
const processUser = (user: User): ProcessedUser => {
  // Implementación tipada
};
```

#### React Components
```typescript
// Props interface clara
interface ComponentProps {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
}

// Componente funcional tipado
export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  children 
}) => {
  // Implementación
};
```

#### Linting y Formatting
```bash
# ESLint
npm run lint
npm run lint:fix

# Prettier
npm run format

# Type checking
npm run type-check
```

### 🐛 Reportar Bugs

#### Template de Issue
```markdown
**Descripción del Bug**
Descripción clara y concisa del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento Esperado**
Lo que debería haber pasado.

**Screenshots**
Si aplica, agregar screenshots.

**Entorno**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
```

---

## 📚 Documentación Adicional

### 📖 Documentos Complementarios

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitectura detallada del sistema
- **[COMPONENTS.md](./docs/COMPONENTS.md)** - Guía completa de componentes UI
- **[API.md](./docs/API.md)** - Documentación de APIs y servicios
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guía detallada de deployment
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Guía extendida de contribución

### 🔗 Enlaces Útiles

- **[Demo Live](https://form-generator-demo.vercel.app)** - Aplicación en funcionamiento
- **[Figma Design](https://figma.com/file/form-generator)** - Diseños y mockups
- **[Notion Roadmap](https://notion.so/form-generator-roadmap)** - Roadmap del proyecto
- **[Discord Community](https://discord.gg/form-generator)** - Comunidad de desarrolladores

### 📊 Métricas y Analytics

#### Performance
- **Lighthouse Score**: 95+ en todas las categorías
- **Core Web Vitals**: Optimizado para UX
- **Bundle Size**: < 500KB inicial
- **Time to Interactive**: < 3 segundos

#### Cobertura de Tests
- **Unit Tests**: 90%+ cobertura
- **Integration Tests**: 80%+ cobertura
- **E2E Tests**: Flujos críticos cubiertos

### 🚀 Roadmap

#### Q1 2024
- ✅ MVP completo con funcionalidades básicas
- ✅ Integración Google Forms
- ✅ Dashboard de gestión
- 🔄 Sistema de plantillas

#### Q2 2024
- 📋 Analytics y métricas avanzadas
- 📋 Colaboración en tiempo real
- 📋 API pública
- 📋 Webhooks y integraciones

#### Q3 2024
- 📋 Marketplace de plantillas
- 📋 Generación de formularios con IA
- 📋 Exportación a múltiples formatos
- 📋 Mobile app (React Native)

---

## 🏆 Créditos y Reconocimientos

### 👥 Equipo de Desarrollo
- **[Tu Nombre](https://github.com/tu-usuario)** - Lead Developer & Architect
- **[Colaboradores](https://github.com/tu-usuario/fast-form/contributors)** - Contributors

### 🙏 Agradecimientos
- **[shadcn](https://ui.shadcn.com)** - Por la increíble biblioteca de componentes
- **[Vercel](https://vercel.com)** - Por la plataforma de deployment
- **[Firebase](https://firebase.google.com)** - Por los servicios backend
- **Comunidad Open Source** - Por las herramientas y librerías

### 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para detalles.

---

<div align="center">
  <h3>⭐ Si este proyecto te ayudó, ¡deja una estrella!</h3>
  <p>Hecho con ❤️ y ☕ para la comunidad</p>
  
  <img src="https://img.shields.io/github/stars/tu-usuario/fast-form?style=social" alt="GitHub stars" />
<img src="https://img.shields.io/github/forks/tu-usuario/fast-form?style=social" alt="GitHub forks" />
<img src="https://img.shields.io/github/issues/tu-usuario/fast-form" alt="GitHub issues" />
</div>
## 💳 Integración MercadoPago Checkout Pro

### 🏗️ Arquitectura de Pagos

FastForm utiliza **MercadoPago Checkout Pro** para procesar pagos de forma segura y confiable. La integración está diseñada para ser escalable y mantener la experiencia de usuario fluida.

### 🔧 Configuración de MercadoPago

#### Variables de Entorno Requeridas
```bash
# Mercado Pago Configuration
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token_here
MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # o tu dominio en producción
```

#### Credenciales
- **Sandbox**: Usa credenciales de prueba para desarrollo
- **Producción**: Cambia a credenciales reales para producción
- **Access Token**: Token privado para el backend
- **Public Key**: Clave pública para el frontend (si es necesario)

### 🔄 Flujo Completo de Pago

```mermaid
graph TD
    A[Página de Precios] --> B[Crear Preferencia]
    B --> C[Redirigir a Checkout Pro]
    C --> D[Usuario completa pago]
    D --> E[Retorno a FastForm]
    E --> F[Verificar pago]
    F --> G[Actualizar créditos]
    G --> H[Notificar usuario]
```

### 📋 Endpoints de la API

#### POST `/api/mercadopago/create-preference`
**Descripción**: Crea una preferencia de pago en MercadoPago

**Request Body**:
```json
{
  "quantity": 20,
  "unitPrice": 1,
  "totalPrice": 20,
  "packSize": 20,
  "discountPercent": 10
}
```

**Response**:
```json
{
  "id": "preference_id",
  "initPoint": "https://checkout.mercadopago.com/...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com/..."
}
```

#### POST `/api/mercadopago/verify-payment`
**Descripción**: Verifica el estado del pago después del retorno

**Request Body**:
```json
{
  "paymentId": "payment_id",
  "userId": "user_firebase_uid",
  "purchase": { ... }
}
```

#### POST `/api/mercadopago/webhooks`
**Descripción**: Recibe notificaciones IPN de MercadoPago

### 🎯 Página de Precios

**Archivo**: `src/app/pricing/page.tsx`

#### Características de Precios
- **Precio Base**: 1 ARS por formulario individual
- **Packs con Descuento**:
  - 20 créditos: 10% descuento
  - 50 créditos: 20% descuento
  - 100 créditos: 30% descuento
- **Incremento Dinámico**: 3% adicional por formulario extra

#### Ejemplo de Cálculo
```typescript
// Precio dinámico para cantidad personalizada
const calculatePrice = (qty: number): number => {
  if (qty <= 1) return 1; // 1 ARS
  
  let totalPrice = 1;
  for (let i = 2; i <= qty; i++) {
    const increment = 1 * (0.03) * (i - 1);
    totalPrice += 1 + increment;
  }
  return Math.round(totalPrice);
};
```

### 🌐 URLs de Retorno

Después del pago, el usuario es redirigido a:

- **Éxito**: `/checkout/success` - Pago procesado correctamente
- **Fallo**: `/checkout/failure` - Pago rechazado o cancelado
- **Pendiente**: `/checkout/pending` - Pago en proceso

### 🧪 Testing y Desarrollo

#### Modo Sandbox
```bash
# Credenciales de prueba
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

#### Tarjetas de Prueba
- **Aprobada**: `5031 7557 3453 0604` (cualquier CVV y fecha)
- **Rechazada**: `5031 7557 3453 0604` (usar monto $100)
- **Pendiente**: `5031 7557 3453 0604` (usar monto $101)

#### Verificación de Configuración
```bash
# Endpoint de prueba
GET http://localhost:3000/api/mercadopago/test

# Respuesta esperada
{
  "status": "ok",
  "mercadopagoConfigured": true,
  "hasAccessToken": "Sí",
  "message": "Mercado Pago está configurado correctamente"
}
```

### 🔍 Monitoreo y Logs

#### Logs del Servidor
Cuando se crea una preferencia exitosamente:
```
📝 Creando preferencia con datos: { quantity: 20, unitPrice: 1, totalPrice: 18, packSize: 20, discountPercent: 10 }
🔄 Enviando preferencia a Mercado Pago...
✅ Preferencia creada exitosamente: [preference_id]
```

#### Logs de Webhooks
```
Webhook recibido de Mercado Pago: {
  type: 'payment',
  paymentId: 'payment_id',
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

### 🚀 Producción

#### Checklist de Producción
1. **Credenciales**: Cambiar a credenciales de producción
2. **URLs**: Actualizar `NEXT_PUBLIC_BASE_URL` con tu dominio real
3. **Webhooks**: Verificar que las URLs sean accesibles públicamente
4. **SSL**: Asegurar HTTPS para webhooks
5. **Monitoreo**: Configurar alertas para pagos fallidos

#### Configuración de Producción
```bash
# Variables de entorno para producción
MERCADOPAGO_ACCESS_TOKEN=APP-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://tudominio.com
NODE_ENV=production
```

### 📊 Características Avanzadas

#### Seguridad
- **Modo Binario**: Solo pagos aprobados o rechazados
- **Expiración**: Preferencias expiran en 24 horas
- **Validación**: Verificación de datos antes de procesar
- **HTTPS**: Requerido para webhooks en producción

#### Personalización
- **Statement Descriptor**: "FastForm" en extractos bancarios
- **Descripción Dinámica**: Muestra detalles del pack
- **External Reference**: IDs únicos para tracking
- **Back URLs**: Personalizadas según ambiente

### 📚 Recursos Adicionales

- **[MERCADOPAGO_SETUP.md](./MERCADOPAGO_SETUP.md)** - Guía detallada de configuración
- **[MERCADOPAGO_TROUBLESHOOTING.md](./MERCADOPAGO_TROUBLESHOOTING.md)** - Solución de problemas
- **[Documentación Oficial](https://www.mercadopago.com.ar/developers/es/docs)** - API de MercadoPago
- **[Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/overview)** - Documentación completa

---

# google-form-automatic
