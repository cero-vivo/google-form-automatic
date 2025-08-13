'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Trash2, Settings, Eye, Smartphone, Monitor, ArrowLeft, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import QuestionTypePalette from './QuestionTypePalette';
import QuestionCard from './QuestionCard';
import LivePreview from './LivePreview';
import AutoSaveIndicator from './AutoSaveIndicator';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { Question } from '@/domain/entities/question';

interface FormBuilderProps {
  template: string | null;
  onBackToTemplates: () => void;
}

export default function FormBuilder({ template, onBackToTemplates }: FormBuilderProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  
  const {
    formData,
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    updateFormSettings,
    autoSave,
    saveForm,
    keyboardShortcuts
  } = useFormBuilder(template);

  // Auto-save cada 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || questions.length > 0) {
        saveForm();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, questions, saveForm]);

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Panel Izquierdo - Editor */}
        <div className="space-y-4">
          {/* Header del Editor */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToTemplates}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h2 className="text-lg font-semibold">Editor</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <AutoSaveIndicator state={autoSave} />
              <KeyboardShortcuts shortcuts={keyboardShortcuts} />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateFormSettings({ title: '', description: '' });
                    questions.forEach((q: { id: string }) => deleteQuestion(q.id));
                  }}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpiar
                </Button>
                <Button
                  size="sm"
                  onClick={saveForm}
                  disabled={autoSave.isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {autoSave.isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Configuración del Formulario */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Título del formulario *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormSettings({ title: e.target.value })}
                  placeholder="Ej: Encuesta de satisfacción"
                  className="text-lg font-semibold"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción (opcional)</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormSettings({ description: e.target.value })}
                  placeholder="Describe el propósito de este formulario"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.collectEmails}
                    onChange={(e) => updateFormSettings({ collectEmails: e.target.checked })}
                    className="rounded"
                  />
                  <span>Recopilar emails</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.limitResponses}
                    onChange={(e) => updateFormSettings({ limitResponses: e.target.checked })}
                    className="rounded"
                  />
                  <span>Limitar respuestas</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Lista de Preguntas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Preguntas ({questions.length})</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowQuestionPalette(!showQuestionPalette)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>

            <AnimatePresence>
              {showQuestionPalette && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <QuestionTypePalette onSelectType={addQuestion} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <AnimatePresence>
                {questions.map((question: Question, index: number) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                    onReorder={reorderQuestions}
                    isLast={index === questions.length - 1}
                  />
                ))}
              </AnimatePresence>
              
              {questions.length === 0 && (
                <Card className="p-8 text-center border-dashed">
                  <div className="text-slate-500">
                    <Plus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No hay preguntas aún</p>
                    <p className="text-xs mt-1">Haz clic en "Agregar" para comenzar</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Panel Derecho - Vista Previa */}
        <div className="space-y-4">
          {/* Header de Vista Previa */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Vista Previa</h2>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setViewMode('desktop')}
                className="px-2"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mobile')}
                className="px-2"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Vista Previa Live */}
          <LivePreview
            formData={formData}
            questions={questions}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
}