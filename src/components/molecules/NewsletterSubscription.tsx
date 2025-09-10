'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSubscriptionProps {
  source?: string;
  className?: string;
}

export function NewsletterSubscription({ source = 'blog', className = '' }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!email.trim()) {
      setError("Por favor ingresa tu email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setSuccess(data.message || "Te has suscrito exitosamente");
        setEmail('');
        setError(null);
      } else {
        setError(data.error || "Error al procesar la suscripción");
        setSuccess(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Error al conectar con el servidor");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`text-center p-4 bg-green-50 rounded-lg ${className}`}>
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">¡Gracias por suscribirte!</p>
        <p className="text-green-600 text-sm">Recibirás nuestras últimas guías pronto</p>
      </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-3 max-w-md mx-auto ${className}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="flex-1"
            required
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Suscribiendo...
              </>
            ) : (
              'Suscribirse'
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}
      </form>
    );
}