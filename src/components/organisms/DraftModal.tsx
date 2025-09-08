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

  const formatDate = (date: Date) => {
    console.log("🚀 ~ formatDate ~ date:", date)
    return new Date(date).toLocaleDateString('ar-AR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {!showBuilderSelection ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
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
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium text-slate-800">
                            {draft.title || 'Sin título'}
                          </CardTitle>
                          <p className="text-sm text-slate-600 mt-1">
                            {draft.description || 'Sin descripción'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {getCreationMethodLabel(draft.creationMethod)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                            onClick={() => handleDeleteDraft(draft.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-slate-600">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(new Date(draft.updatedAt).getTime())}
                          </span>
                          <span>
                            {draft.questions.length} pregunta{draft.questions.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadDraft(draft)}
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
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
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Seleccionar Builder
              </DialogTitle>
              <p className="text-sm text-slate-600">
                ¿En qué builder deseas abrir "{selectedDraft?.title || 'este formulario'}"?
              </p>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {(['ai', 'manual', 'file'] as const).map((builderType) => (
                <Button
                  key={builderType}
                  onClick={() => handleSelectBuilder(builderType)}
                  className="w-full justify-start h-auto py-4 px-4 text-left"
                  variant="outline"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-600">
                      {getBuilderIcon(builderType)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">
                        {getBuilderName(builderType)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {getBuilderDescription(builderType)}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setShowBuilderSelection(false)}
                className="text-slate-600"
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