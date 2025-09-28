'use client';

import { useCallback } from 'react';
import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'info' | 'error';

interface BrandToastConfig {
  icon: typeof CheckCircle2;
  accentClass: string;
  containerClass: string;
  pillClass: string;
}

interface ShowToastOptions {
  duration?: number;
}

const TOAST_CONFIG: Record<ToastTone, BrandToastConfig> = {
  success: {
    icon: CheckCircle2,
    accentClass: 'text-excel',
    containerClass: 'border-excel/30 bg-white/95',
    pillClass: 'bg-excel/10 text-excel',
  },
  info: {
    icon: Info,
    accentClass: 'text-forms',
    containerClass: 'border-forms/30 bg-white/95',
    pillClass: 'bg-forms/10 text-forms',
  },
  error: {
    icon: AlertTriangle,
    accentClass: 'text-warning-500',
    containerClass: 'border-warning-500/40 bg-white/95',
    pillClass: 'bg-warning-500/10 text-warning-500',
  },
};

export function useBrandToast() {
  const showToast = useCallback(
    (tone: ToastTone, title: string, description?: string, options?: ShowToastOptions) => {
      const config = TOAST_CONFIG[tone];
      const Icon = config.icon;

      // Create the title element
      const titleElement = (
        <div className="flex items-center gap-2">
          <span className={cn('inline-flex h-8 w-8 items-center justify-center rounded-full', config.pillClass)}>
            <Icon className="h-4 w-4" />
          </span>
          <span className={cn('text-sm font-semibold leading-tight', config.accentClass)}>{title}</span>
        </div>
      );

      toast({
        duration: options?.duration ?? 5000,
        className: cn(
          'min-w-[260px] max-w-[360px] rounded-xl border shadow-lg backdrop-blur-sm px-4 py-3',
          'ring-1 ring-black/5',
          config.containerClass
        ),
        title: titleElement as any,
        description: description ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : undefined,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, description?: string, options?: ShowToastOptions) =>
      showToast('success', title, description, options),
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, description?: string, options?: ShowToastOptions) =>
      showToast('info', title, description, options),
    [showToast]
  );

  const showError = useCallback(
    (title: string, description?: string, options?: ShowToastOptions) =>
      showToast('error', title, description, options),
    [showToast]
  );

  return { showSuccess, showInfo, showError };
}
