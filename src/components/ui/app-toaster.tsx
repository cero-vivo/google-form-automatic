'use client';

import * as React from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function AppToaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, className, ...props }) => (
        <Toast
          key={id}
          {...props}
          className={cn(
            'pointer-events-auto rounded-xl border border-border/80 bg-white/95 shadow-2xl shadow-black/5 backdrop-blur-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out',
            className
          )}
        >
          <div className="grid gap-2 pr-6">
            {title && (
              typeof title === 'string' ? (
                <ToastTitle className="text-sm font-semibold text-foreground">{title}</ToastTitle>
              ) : (
                <div className="text-sm font-semibold text-foreground">{title}</div>
              )
            )}
            {description && (
              typeof description === 'string' ? (
                <ToastDescription className="text-xs text-muted-foreground">{description}</ToastDescription>
              ) : (
                <div className="text-xs text-muted-foreground">{description}</div>
              )
            )}
          </div>
          {action}
          <ToastClose className="text-muted-foreground hover:text-foreground" />
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-6 right-4 z-[100] flex max-h-screen w-full flex-col gap-3 p-4 sm:right-6 sm:w-auto" />
    </ToastProvider>
  );
}
