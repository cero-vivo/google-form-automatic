import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Fast Form/Design Tokens',
  parameters: {
    docs: {
      description: {
        component: 'Sistema de tokens de diseño para Fast Form',
      },
    },
  },
};

export default meta;

// Colores de marca - Valores HSL exactos
const colors = {
  velocity: {
    primary: 'hsl(142, 72%, 29%)',
    hover: 'hsl(38, 100%, 55%)',
    light: 'hsl(38, 100%, 95%)',
    text: 'hsl(38, 100%, 40%)',
  },
  forms: {
    primary: 'hsl(251, 47%, 48%)',
    hover: 'hsl(251, 47%, 40%)',
    light: 'hsl(251, 47%, 95%)',
  },
  excel: {
    primary: 'hsl(142, 72%, 29%)',
    hover: 'hsl(142, 72%, 25%)',
    light: 'hsl(142, 72%, 95%)',
  },
  neutral: {
    background: 'hsl(0, 0%, 100%)',
    surface: 'hsl(210, 40%, 98%)',
    text_primary: 'hsl(220, 13%, 18%)',
    text_secondary: 'hsl(220, 13%, 40%)',
    border: 'hsl(220, 13%, 91%)',
  },
};

// Tipografía
const typography = {
  fonts: {
    primary: 'Poppins',
    secondary: 'Inter',
    display: 'Poppins Black',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
};

// Espaciado
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

// Border radius
const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

export const Colors: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Colores de Marca</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(colors).map(([category, colorGroup]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
              {Object.entries(colorGroup).map(([name, value]) => (
                <div key={name} className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg border border-gray-200" 
                    style={{ backgroundColor: value }}
                  />
                  <div>
                    <p className="font-medium capitalize">{name}</p>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Tipografía</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Fuentes</h3>
            <div className="space-y-2">
              {Object.entries(typography.fonts).map(([name, font]) => (
                <div key={name}>
                  <p className="text-sm text-gray-600 mb-1">{name}</p>
                  <p className="text-xl" style={{ fontFamily: font }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Pesos de Fuente</h3>
            <div className="space-y-2">
              {Object.entries(typography.weights).map(([name, weight]) => (
                <div key={name}>
                  <p className="text-sm text-gray-600 mb-1">{name}</p>
                  <p className="text-lg" style={{ fontWeight: weight }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Espaciado</h2>
        
        <div className="space-y-4">
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium">{name}</div>
              <div 
                className="bg-velocity-primary rounded" 
                style={{ width: value, height: '24px' }}
              />
              <div className="text-sm text-gray-600">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const BorderRadius: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Border Radius</h2>
        
        <div className="flex flex-wrap gap-4">
          {Object.entries(borderRadius).map(([name, value]) => (
            <div key={name} className="text-center">
              <div 
                className="w-16 h-16 bg-forms-primary mb-2" 
                style={{ borderRadius: value }}
              />
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-gray-600">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};