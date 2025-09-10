# 📚 Guía de Storybook - Fast Form Design System

## 🚀 Instalación y Uso

### Instalación
```bash
# Storybook ya está instalado en tu proyecto
npm run storybook
```

### Acceso
- **URL Local**: http://localhost:6006
- **Documentación**: http://localhost:6006/docs

## 📁 Estructura de Documentación

### 📋 Categorías Principales

1. **Fast Form/Introducción** - Visión general del sistema
2. **Fast Form/Design Tokens** - Colores, tipografía, espaciado
3. **Fast Form/Dashboard Components** - Componentes del dashboard
4. **Fast Form/Brand Components** - Elementos de UI con estilo de marca

### 🎯 Componentes Documentados

#### Design Tokens
- **Colores de Marca**: Velocity, Forms, Excel, Neutral
- **Tipografía**: Poppins, Inter, pesos y tamaños
- **Espaciado**: Sistema de 8px con escala consistente
- **Border Radius**: Variaciones para diferentes contextos

#### Dashboard Components
- **StatsCards**: Tarjetas de estadísticas con iconos
- **CreationCards**: Opciones de creación (IA y archivo)
- **QuestionPreview**: Vista previa de preguntas
- **FormSettings**: Configuración de formularios

#### Brand Components
- **Buttons**: Variantes primarias, secundarias y tamaños
- **Cards**: Estilos default y elevated
- **Badges**: Estados y variantes
- **Inputs**: Formularios y estados
- **Alerts**: Mensajes de feedback

## 🎨 Identidad Visual Fast Form

### Colores
- **Velocity**: `#FFB830` - Acciones principales, energía
- **Forms**: `#5B47A8` - Interfaz principal, confianza
- **Excel**: `#1A7F4C` - Éxito, confirmación
- **Neutral**: `#FFFFFF` - Fondos, claridad

### Tipografía
- **Primaria**: Poppins (títulos y CTAs)
- **Secundaria**: Inter (contenido y texto)
- **Display**: Poppins Black (impacto visual)

### Principios de Diseño
- **Mobile-first**: Diseño responsivo
- **Accesibilidad**: WCAG 2.1 AA
- **Rendimiento**: Optimizado para carga rápida
- **Consistencia**: Sistema de tokens unificado

## 🔧 Uso en Desarrollo

### Importar Componentes
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

### Aplicar Estilos de Marca
```typescript
// Botón primario con gradiente
<Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
  Crear con IA
</Button>

// Card con estilo de marca
<Card className="border-slate-200 hover:shadow-lg transition-shadow">
  {/* contenido */}
</Card>
```

### Clases de Utilidad Personalizadas
```css
/* Colores de marca */
.bg-velocity-primary { background-color: #FFB830; }
.text-forms-primary { color: #5B47A8; }
.border-excel-primary { border-color: #1A7F4C; }

/* Gradientes */
.bg-gradient-velocity { 
  background: linear-gradient(to right, #FFB830, #FF9F00);
}

/* Sombras de marca */
.shadow-fast-form { 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Ejemplos Responsivos
```typescript
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* contenido */}
</div>

// Tamaños de fuente responsive
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Título adaptable
</h1>
```

## ♿ Accesibilidad

### Requisitos Implementados
- **Contraste**: Mínimo 4.5:1 para texto normal
- **Focus**: Anillos de enfoque visibles
- **Navegación**: Soporte completo de teclado
- **Screen readers**: Etiquetas ARIA apropiadas

### Testing de Accesibilidad
```bash
# Verificar contraste
npm run storybook
# Usar herramientas de accesibilidad en el navegador
```

## 🎭 Animaciones y Micro-interacciones

### Transiciones Estándar
```css
.transition-fast-form {
  transition: all 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

### Estados de Carga
```typescript
// Skeleton loading
<div className="animate-pulse bg-slate-200 rounded-md">
  {/* contenido de carga */}
</div>
```

## 🧪 Testing

### Herramientas Recomendadas
- **Storybook**: Visual testing
- **Chromatic**: Regresión visual
- **axe-core**: Accesibilidad

### Comandos de Testing
```bash
# Ejecutar Storybook
npm run storybook

# Build para producción
npm run build-storybook
```

## 📊 Métricas de Diseño

### Performance Targets
- **Lighthouse**: > 90 puntos
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔄 Actualización del Sistema

### Proceso de Actualización
1. Actualizar tokens en `tailwind.config.js`
2. Documentar cambios en Storybook
3. Testear en todos los breakpoints
4. Verificar accesibilidad
5. Actualizar documentación

### Versionado
- **Versión actual**: v1.0.0
- **Changelog**: Documentar todos los cambios
- **Migración**: Guías para actualizaciones

---

## 🆘 Soporte

### Recursos
- **Documentación**: Storybook local
- **Issues**: GitHub Issues
- **Discord**: Comunidad Fast Form

### Contacto
- **Email**: design@fastform.pro
- **Twitter**: @fastformapp
- **LinkedIn**: Fast Form Design System

---

**¡Bienvenido al futuro del diseño de formularios!** 🚀