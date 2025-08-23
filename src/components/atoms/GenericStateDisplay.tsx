import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  FolderOpen, 
  AlertTriangle 
} from 'lucide-react';

export type GenericStateType = 'loading' | 'empty' | 'error' | 'success' | 'warning';

export interface GenericStateDisplayProps {
  state: GenericStateType;
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const stateConfig = {
  loading: {
    icon: Loader2,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    title: 'Cargando...',
  },
  empty: {
    icon: FolderOpen,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    title: 'Sin contenido',
  },
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    title: 'Error',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    title: '¡Éxito!',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    title: 'Advertencia',
  },
};

export const GenericStateDisplay: React.FC<GenericStateDisplayProps> = ({
  state,
  title,
  message,
  actionText,
  onAction,
  className = '',
}) => {
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className={`p-4 rounded-full ${config.bgColor} mb-4`}>
        <Icon 
          className={`h-12 w-12 ${config.color} ${state === 'loading' ? 'animate-spin' : ''}`} 
        />
      </div>
      
      {(title || config.title) && (
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title || config.title}
        </h3>
      )}
      
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {message}
      </p>
      
      {actionText && onAction && (
        <Button onClick={onAction} variant="default" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};