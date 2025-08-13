import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditDisplayProps {
  credits: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CreditDisplay({ 
  credits, 
  showIcon = true, 
  size = 'md', 
  className 
}: CreditDisplayProps) {
  const getCreditColor = (credits: number) => {
    if (credits === 0) return 'destructive' as const;
    if (credits <= 5) return 'secondary' as const;
    return 'default' as const;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-2 py-1';
      case 'md':
        return 'text-base px-3 py-1.5';
      case 'lg':
        return 'text-lg px-4 py-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'md':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
    }
  };

  return (
    <Badge 
      variant={getCreditColor(credits)}
      className={cn(
        'flex items-center gap-1 font-semibold',
        getSizeClasses(),
        className
      )}
    >
      {showIcon && <CreditCard className={getIconSize()} />}
      <span>{credits}</span>
      <span className="hidden sm:inline">créditos</span>
    </Badge>
  );
}