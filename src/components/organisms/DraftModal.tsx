'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Clock, Edit3, FileText, Sparkles, Upload } from 'lucide-react';
import { DraftService, FormDraft } from '@/infrastructure/firebase/DraftService';
import { useAuth } from '@/containers/useAuth';

interface DraftModalProps {
  onLoadDraft?: (draft: FormDraft) => void;
  onClose?: () => void;
  trigger?: React.ReactNode;
  onSelectBuilder?: (draft: FormDraft, builderType: 'ai' | 'manual' | 'file') => void;
}

export const DraftModal: React.FC<DraftModalProps> = ({ 
  onLoadDraft, 
  onClose, 
  trigger,
  onSelectBuilder
}) => {
  const [drafts, setDrafts] = useState<FormDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const loadDrafts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userDrafts = await DraftService.getUserDrafts(user.id);
      setDrafts(userDrafts);
    } catch (err) {
      setError('Error al cargar los borradores');
      console.error('Error loading drafts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadDrafts();
    }
  }, [isOpen, user]);

  const [selectedDraft, setSelectedDraft] = useState<FormDraft | null>(null);
  const [showBuilderSelection, setShowBuilderSelection] = useState(false);

  const handleLoadDraft = (draft: FormDraft) => {
    if (onSelectBuilder) {
      setSelectedDraft(draft);
      setShowBuilderSelection(true);
    } else {
      onLoadDraft?.(draft);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleSelectBuilder = (builderType: 'ai' | 'manual' | 'file') => {
    if (selectedDraft && onSelectBuilder) {
      onSelectBuilder(selectedDraft, builderType);
    }
    setIsOpen(false);
    setShowBuilderSelection(false);
    setSelectedDraft(null);
    onClose?.();
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm('¿Estás seguro de eliminar este borrador?')) return;
    
    try {
      await DraftService.deleteDraft(draftId);
      setDrafts(drafts.filter(d => d.id !== draftId));
    } catch (err) {
      setError('Error al eliminar el borrador');
      console.error('Error deleting draft:', err);
    }
  };

  const formatDate = (dateInput: Date | number | string | { seconds: number; nanoseconds: number }) => {
    try {
      let date: Date;
      
      if (dateInput && typeof dateInput === 'object' && 'seconds' in dateInput) {
        // Firebase Timestamp object
        date = new Date(dateInput.seconds * 1000);
      } else {
        // Regular date format
        date = new Date(dateInput as any);
      }
      
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getCreationMethodLabel = (method: string) => {
    const labels = {
      'create': 'Manual',
      'edit': 'Edición',
      'ai-generated': 'IA',
      'template': 'Plantilla'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getBuilderIcon = (type: 'ai' | 'manual' | 'file') => {
    switch (type) {
      case 'ai': return <Sparkles className="w-5 h-5" />;
      case 'manual': return <Edit3 className="w-5 h-5" />;
      case 'file': return <Upload className="w-5 h-5" />;
    }
  };

  const getBuilderName = (type: 'ai' | 'manual' | 'file') => {
    switch (type) {
      case 'ai': return 'Asistente IA';
      case 'manual': return 'Constructor Manual';
      case 'file': return 'Importar Archivo';
    }
  };

  const getBuilderDescription = (type: 'ai' | 'manual' | 'file') => {
    switch (type) {
      case 'ai': return 'Editar con asistente de IA';
      case 'manual': return 'Editar manualmente con el constructor visual';
      case 'file': return 'Importar desde archivo Excel/CSV';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-slate-300 text-slate-700">
            <FileText className="w-4 h-4 mr-2" />
            Ver Borradores
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] w-[95vw] sm:w-[90vw] md:w-[80vw] mx-auto overflow-y-auto rounded-lg p-4 sm:p-6">
        {!showBuilderSelection ? (
          <>
            <DialogHeader className="pb-2 sm:pb-4 px-1 sm:px-2">
              <DialogTitle className="text-lg sm:text-xl font-semibold pr-8">
                Mis Borradores
              </DialogTitle>
            </DialogHeader>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm">No tienes borradores guardados</p>
                <p className="text-xs mt-1">Los formularios guardados como borrador aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-4 overflow-hidden">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="border-slate-200 hover:shadow-sm transition-shadow overflow-hidden">
                    <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <CardTitle className="text-base font-medium text-slate-800 truncate break-words mb-1">
                            {draft.title || 'Sin título'}
                          </CardTitle>
                          <p className="text-sm text-slate-600 line-clamp-2 break-words leading-relaxed">
                            {draft.description || 'Sin descripción'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                            {getCreationMethodLabel(draft.creationMethod)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0 flex-shrink-0 rounded-full"
                            onClick={() => handleDeleteDraft(draft.id)}
                            aria-label="Eliminar borrador"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-slate-600 min-w-0 mb-3 sm:mb-0">
                          <span className="flex items-center flex-shrink-0">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(draft.updatedAt)}
                          </span>
                          <span className="flex items-center flex-shrink-0">
                            {draft.questions.length} pregunta{draft.questions.length !== 1 ? 's' : ''}
                          </span>
                          <Badge variant="outline" className="text-xs sm:hidden flex-shrink-0">
                            {getCreationMethodLabel(draft.creationMethod)}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadDraft(draft)}
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto flex-shrink-0 mt-1 sm:mt-0"
                        >
                          <Edit3 className="w-3 h-3 mr-1.5" />
                          Cargar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <DialogHeader className="pb-2 sm:pb-4">
              <DialogTitle className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 pr-8">
                Seleccionar Builder
              </DialogTitle>
              <p className="text-sm sm:text-base text-slate-600 break-words text-center">
                ¿En qué builder deseas abrir "{selectedDraft?.title || 'este formulario'}"?
              </p>
            </DialogHeader>
            
            <div className="space-y-3 py-2 sm:py-4">
              {(['ai', 'manual', 'file'] as const).map((builderType) => (
                <Button
                  key={builderType}
                  onClick={() => handleSelectBuilder(builderType)}
                  className="w-full justify-start h-auto py-3 sm:py-4 px-3 sm:px-4 text-left transition-colors hover:bg-slate-50 rounded-md"
                  variant="outline"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="text-blue-600 flex-shrink-0 sm:scale-110">
                      {getBuilderIcon(builderType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 text-sm sm:text-base mb-0.5 sm:mb-1">
                        {getBuilderName(builderType)}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {getBuilderDescription(builderType)}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex justify-center mt-4 sm:mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowBuilderSelection(false)}
                className="text-slate-600 hover:bg-slate-100 px-6 py-2 sm:py-2.5 text-sm sm:text-base"
              >
                Volver
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};