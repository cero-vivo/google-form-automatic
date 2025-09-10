'use client';

import { useState } from 'react';
import { X, Bug, Lightbulb, Heart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitFeedback } from '@/services/feedbackService';

// Simple toast implementation
const useToast = () => {
  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`${variant?.toUpperCase() || 'INFO'}: ${title} - ${description}`);
    if (typeof window !== 'undefined') {
      alert(`${title}\n${description}`);
    }
  };
  return { toast };
};

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'suggestion' | 'feature' | 'general';

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const feedbackTypes = [
    { value: 'bug', label: 'Reportar Bug', icon: Bug, description: 'Error o problema en la aplicación' },
    { value: 'suggestion', label: 'Sugerencia', icon: Lightbulb, description: 'Ideas para mejorar' },
    { value: 'feature', label: 'Nueva Función', icon: Heart, description: 'Solicitar nueva característica' },
    { value: 'general', label: 'General', icon: Send, description: 'Otro tipo de feedback' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Por favor describe tu feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback({
        type: feedbackType,
        description: description.trim(),
        email: email.trim() || null,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "¡Gracias por tu feedback!",
        description: "Tu mensaje ha sido enviado exitosamente.",
      });

      // Reset form and close
      setDescription('');
      setEmail('');
      setFeedbackType('bug');
      onClose();
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu feedback. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Enviar Feedback</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Tipo de feedback
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feedbackTypes.map(({ value, label, icon: Icon }) => (
                <label key={value} className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 ${feedbackType === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="feedbackType"
                    value={value}
                    checked={feedbackType === value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedbackType(e.target.value as FeedbackType)}
                    className="sr-only"
                  />
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe el problema, sugerencia o idea..."
              className="mt-1 min-h-[100px] block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/1000 caracteres
            </p>
          </div>

          {/* Email (optional) */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email (opcional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Te contactaremos si necesitamos más información
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}