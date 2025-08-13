'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Sparkles, Plus, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormBuilder from './components/FormBuilder';
import TemplateSelector from './components/TemplateSelector';
import WelcomeTour from './components/WelcomeTour';
import { useAuthContext } from '@/containers/useAuth';

export default function CreateSimplePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
  };

  const handleStartEmpty = () => {
    setSelectedTemplate('empty');
    setShowTemplates(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Crear Formulario</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Experiencia simplificada</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Share2 className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WelcomeTour onComplete={() => console.log('Tour completed')} />
        
        {showTemplates ? (
          <TemplateSelector 
            onTemplateSelect={handleTemplateSelect}
            onStartEmpty={handleStartEmpty}
          />
        ) : (
          <FormBuilder 
            template={selectedTemplate}
            onBackToTemplates={() => setShowTemplates(true)}
          />
        )}
      </main>
    </div>
  );
}