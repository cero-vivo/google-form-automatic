import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBrandToast } from '@/hooks/useBrandToast';

interface FormSuccessData {
  title: string;
  description?: string;
  questions: Array<{
    title: string;
    type: string;
  }>;
  formUrl: string;
  editUrl: string;
  createdAt: Date;
}

interface FormSuccessViewProps {
  formData: FormSuccessData;
  onCreateNewForm: () => void;
  onDuplicateForm: () => void;
}

export function FormSuccessView({ formData, onCreateNewForm, onDuplicateForm }: FormSuccessViewProps) {
  const { showSuccess, showError } = useBrandToast();

  const handleCopyToClipboard = React.useCallback(
    async (text: string, message: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSuccess('Enlace copiado', message);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        showError('No pudimos copiar el enlace', 'Copia el enlace manualmente mientras resolvemos el problema.');
      }
    },
    [showSuccess, showError]
  );

  return (
    <div className="space-y-4 md:space-y-6 max-w-full mx-auto px-2 sm:px-4">
      {/* Hero Success Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-excel/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-excel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-forms leading-tight">
            ¡Formulario creado con éxito!
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Tu formulario <span className="font-semibold text-forms">"{formData.title}"</span> está listo en Google Forms
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xs md:max-w-md mx-auto pt-4">
          <div className="bg-excel/10 p-3 md:p-4 rounded-lg md:rounded-xl text-center">
            <div className="text-lg md:text-2xl font-bold text-excel">{formData.questions.length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Preguntas</div>
          </div>
          <div className="bg-forms/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-forms">✓</div>
            <div className="text-sm text-muted-foreground">Google Forms</div>
          </div>
          <div className="bg-velocity/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-velocity">∞</div>
            <div className="text-sm text-muted-foreground">Respuestas</div>
          </div>
        </div>
      </div>

      {/* Form Preview Card */}
      <Card className="border-border shadow-sm">
        <div className="bg-excel/5 p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-forms/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-forms" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-forms break-words">{formData.title}</h3>
              {formData.description && (
                <p className="text-muted-foreground text-sm mt-1">{formData.description}</p>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Questions Preview */}
          <div className="space-y-4">
            <h4 className="font-medium text-forms flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Vista previa de preguntas
            </h4>
            <div className="grid gap-2 md:gap-3">
              {formData.questions.slice(0, 4).map((q, index) => (
                <div key={index} className="bg-muted/30 p-3 md:p-4 rounded-lg border-l-4 border-l-excel">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-foreground flex-1 break-words">{q.title}</span>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">{q.type}</span>
                  </div>
                </div>
              ))}
              {formData.questions.length > 4 && (
                <div className="text-center py-3">
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    +{formData.questions.length - 4} preguntas más
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6 pt-4 md:pt-6 border-t border-border">
            {/* Share Link */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-excel/10 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-excel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <label className="text-xs md:text-sm font-medium text-forms">Compartir</label>
              </div>
              <div className="flex items-stretch space-x-1 md:space-x-2">
                <input
                  type="text"
                  value={formData.formUrl}
                  readOnly
                  className="flex-1 min-w-0 px-2 py-1.5 md:px-3 md:py-2 border border-border rounded-md md:rounded-lg bg-background/50 text-xs md:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-excel/50 break-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="sm"
                  onClick={() => { void handleCopyToClipboard(formData.formUrl, 'Comparte este enlace con tu equipo o clientes.'); }}
                  className="bg-excel hover:bg-excel/90 text-white shrink-0 px-2 md:px-3 h-auto py-1.5 md:py-2"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
              <a
                href={formData.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 bg-excel text-white rounded-md md:rounded-lg hover:bg-excel/90 transition-colors text-center text-xs md:text-sm"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="hidden sm:inline">Ver formulario</span>
                <span className="sm:hidden">Ver</span>
              </a>
            </div>

            {/* Edit Link */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-forms/10 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-forms" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <label className="text-xs md:text-sm font-medium text-forms">Editar</label>
              </div>
              <div className="flex items-stretch space-x-1 md:space-x-2">
                <input
                  type="text"
                  value={formData.editUrl}
                  readOnly
                  className="flex-1 min-w-0 px-2 py-1.5 md:px-3 md:py-2 border border-border rounded-md md:rounded-lg bg-background/50 text-xs md:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-forms/50 break-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="sm"
                  onClick={() => { void handleCopyToClipboard(formData.editUrl, 'Usa este enlace para seguir editando tu formulario en Google.'); }}
                  className="bg-forms hover:bg-forms/90 text-white shrink-0 px-2 md:px-3 h-auto py-1.5 md:py-2"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
              <a
                href={formData.editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 bg-forms text-white rounded-md md:rounded-lg hover:bg-forms/90 transition-colors text-center text-xs md:text-sm"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Editar Google</span>
                <span className="sm:hidden">Editar</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-2">
        <Button
          onClick={onCreateNewForm}
          className="w-full bg-excel hover:bg-excel/90 text-white h-9 md:h-10 rounded-md text-sm font-medium transition-colors px-3 py-2"
          size="sm"
        >
          <div className="flex items-center justify-center space-x-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="truncate">Nuevo formulario</span>
          </div>
        </Button>
        
        <Button
          onClick={onDuplicateForm}
          className="w-full bg-forms hover:bg-forms/90 text-white h-9 md:h-10 rounded-md text-sm font-medium transition-colors px-3 py-2"
          size="sm"
        >
          <div className="flex items-center justify-center space-x-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="truncate">Duplicar</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
