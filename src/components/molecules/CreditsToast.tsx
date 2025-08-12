'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface CreditsToastProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showAction?: boolean;
  actionText?: string;
  actionHref?: string;
}

export default function CreditsToast({
  message,
  type,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  showAction = false,
  actionText = 'Ver Detalles',
  actionHref = '/dashboard/credits'
}: CreditsToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-cerrar el toast
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Delay para la animación
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  // Manejar cierre manual
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Configurar colores según el tipo
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 text-green-800';
      case 'warning':
        return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'error':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'info':
        return 'border-blue-500 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  // Obtener icono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <TrendingDown className="h-5 w-5 text-orange-600" />;
      case 'error':
        return <CreditCard className="h-5 w-5 text-red-600" />;
      case 'info':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <Alert className={`border-l-4 ${getTypeStyles()} shadow-lg max-w-md`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          
          <div className="flex-1">
            <AlertDescription className="font-medium">
              {message}
            </AlertDescription>
            
            {showAction && (
              <div className="mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild
                  className="text-xs"
                >
                  <Link href={actionHref}>
                    {actionText}
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
} 