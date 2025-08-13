import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutoSaveState } from '../types/form-builder';

interface AutoSaveIndicatorProps {
  state: AutoSaveState;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ state }) => {
  const getStatus = () => {
    if (state.isSaving) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: 'Guardando...',
        color: 'text-blue-600',
      };
    }
    
    if (state.hasUnsavedChanges) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Cambios sin guardar',
        color: 'text-amber-600',
      };
    }
    
    if (state.lastSaved) {
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: `Guardado hace ${getRelativeTime(state.lastSaved)}`,
        color: 'text-green-600',
      };
    }
    
    return {
      icon: null,
      text: '',
      color: '',
    };
  };

  const status = getStatus();

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm",
      status.color
    )}>
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} día${diffInDays === 1 ? '' : 's'}`;
}

export default AutoSaveIndicator;