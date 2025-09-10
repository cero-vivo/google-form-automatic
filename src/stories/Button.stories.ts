import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Fast Form/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botones de FastForm con diseño de marca y colores exactos del sistema de diseño.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    primary: {
      control: 'boolean',
      description: 'Estilo primario o secundario del botón',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamaño del botón',
    },
    variant: {
      control: 'select',
      options: ['velocity', 'forms', 'excel'],
      description: 'Color de marca FastForm',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
    glass: {
      control: 'boolean',
      description: 'Efecto glass moderno',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Botón de ancho completo',
    },
    label: {
      control: 'text',
      description: 'Texto del botón',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Velocity: Story = {
  args: {
    primary: true,
    variant: 'velocity',
    label: 'Crear con IA',
    size: 'medium',
  },
};

export const Forms: Story = {
  args: {
    primary: true,
    variant: 'forms',
    label: 'Importar CSV',
    size: 'medium',
  },
};

export const Excel: Story = {
  args: {
    primary: true,
    variant: 'excel',
    label: 'Exportar Excel',
    size: 'medium',
  },
};

export const SecondaryVelocity: Story = {
  args: {
    primary: false,
    variant: 'velocity',
    label: 'Ver Demo',
    size: 'medium',
  },
};

export const SecondaryForms: Story = {
  args: {
    primary: false,
    variant: 'forms',
    label: 'Cancelar',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    primary: true,
    variant: 'velocity',
    size: 'large',
    label: 'Comenzar Gratis',
    glass: true,
  },
};

export const Small: Story = {
  args: {
    primary: true,
    variant: 'excel',
    label: 'Guardar',
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    primary: true,
    variant: 'velocity',
    label: 'Procesando...',
    disabled: true,
    size: 'medium',
  },
};

export const GlassEffect: Story = {
  args: {
    primary: true,
    variant: 'velocity',
    label: 'Glass Button',
    size: 'large',
    glass: true,
  },
};

export const FullWidth: Story = {
  args: {
    primary: true,
    variant: 'forms',
    label: 'Botón Ancho Completo',
    size: 'medium',
    fullWidth: true,
  },
};

export const WithIcon: Story = {
  args: {
    primary: true,
    variant: 'excel',
    label: 'Exportar Datos',
    size: 'medium',
  },
};
