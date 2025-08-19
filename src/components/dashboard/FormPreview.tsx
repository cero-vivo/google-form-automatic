'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import { Question } from '@/domain/entities/question';

interface FormPreviewProps {
  questions: Question[];
  formTitle: string;
  formDescription: string;
  formSettings: {
    collectEmails: boolean;
  };
  isCreating: boolean;
  creditsLoading: boolean;
  currentCredits: number;
  googleFormsError: string | null;
  onFormTitleChange: (title: string) => void;
  onFormDescriptionChange: (description: string) => void;
  onFormSettingsChange: (settings: { collectEmails: boolean }) => void;
  onCreateForm: () => void;
  onBack: () => void;
}

export function FormPreview({
  questions,
  formTitle,
  formDescription,
  formSettings,
  isCreating,
  creditsLoading,
  currentCredits,
  googleFormsError,
  onFormTitleChange,
  onFormDescriptionChange,
  onFormSettingsChange,
  onCreateForm,
  onBack
}: FormPreviewProps) {
  const formatQuestionType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'short_text': 'Texto corto',
      'long_text': 'Texto largo',
      'multiple_choice': 'Opción múltiple',
      'checkboxes': 'Casillas de verificación',
      'dropdown': 'Lista desplegable',
      'linear_scale': 'Escala lineal',
      'date': 'Fecha',
      'time': 'Hora',
      'email': 'Email',
      'number': 'Número',
      'phone': 'Teléfono'
    };
    return typeMap[type] || type;
  };

  return (
    <>
      {/* Preview Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Previsualización del Formulario</h2>
            <p className="text-muted-foreground">
              Revisa las {questions.length} preguntas detectadas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
            >
              Subir otro archivo
            </Button>
            <Button 
              onClick={onCreateForm}
              disabled={isCreating || !formTitle.trim() || (creditsLoading ? false : currentCredits < 1)}
            >
              {isCreating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : creditsLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 rounded-full bg-gray-300 animate-pulse" />
                  Verificando créditos...
                </>
              ) : currentCredits < 1 ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Sin Créditos
                </>
              ) : (
                'Crear Google Form'
              )}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {googleFormsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {googleFormsError}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configuración del Formulario</CardTitle>
            <CardDescription>
              Personaliza el título, descripción y configuraciones avanzadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Información Básica</h4>
              <div>
                <label htmlFor="form-title" className="text-sm font-medium block mb-2">
                  Título del formulario *
                </label>
                <Input
                  id="form-title"
                  value={formTitle}
                  onChange={(e) => onFormTitleChange(e.target.value)}
                  placeholder="Ej: Encuesta de satisfacción"
                />
              </div>
              <div>
                <label htmlFor="form-description" className="text-sm font-medium block mb-2">
                  Descripción (opcional)
                </label>
                <Input
                  id="form-description"
                  value={formDescription}
                  onChange={(e) => onFormDescriptionChange(e.target.value)}
                  placeholder="Ej: Tu opinión es importante para nosotros"
                />
              </div>
            </div>

            {/* Email Collection Setting */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Configuración de Privacidad</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="collect-emails"
                    checked={formSettings.collectEmails}
                    onChange={(e) => onFormSettingsChange({ ...formSettings, collectEmails: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="collect-emails" className="text-sm">
                    Recolectar direcciones de correo electrónico de los respondentes
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Preview */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {index + 1}. {question.title}
                </CardTitle>
                <CardDescription>
                  Tipo: {formatQuestionType(question.type)}
                  {question.required && (
                    <span className="ml-2 text-red-600 font-medium">* Requerido</span>
                  )}
                </CardDescription>
              </CardHeader>
              {question.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{question.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}