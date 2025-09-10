import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface EditableQuestion {
  id: string;
  type: string;
  label: string;
  options?: string[];
  range?: [number, number];
  required?: boolean;
  description?: string;
}

interface EditableFormData {
  title: string;
  description: string;
  questions: EditableQuestion[];
}

interface EditableFormPreviewProps {
  form: EditableFormData;
  onFormChange: (form: EditableFormData) => void;
  onCreateForm: (form: EditableFormData) => void;
  isCreating?: boolean;
  className?: string;
}

const QUESTION_TYPES = [
  { value: 'texto_corto', label: 'Texto corto', icon: '📝' },
  { value: 'texto_largo', label: 'Texto largo', icon: '📄' },
  { value: 'opcion_multiple', label: 'Opción múltiple', icon: '🔘' },
  { value: 'checkboxes', label: 'Casillas múltiples', icon: '☑️' },
  { value: 'dropdown', label: 'Lista desplegable', icon: '⬇️' },
  { value: 'escala_lineal', label: 'Escala lineal', icon: '📊' },
  { value: 'fecha', label: 'Fecha', icon: '📅' },
  { value: 'hora', label: 'Hora', icon: '🕐' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'numero', label: 'Número', icon: '🔢' },
  { value: 'archivo', label: 'Archivo', icon: '📎' },
];

export function EditableFormPreview({ 
  form, 
  onFormChange, 
  onCreateForm, 
  isCreating = false,
  className 
}: EditableFormPreviewProps) {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleTitleChange = (title: string) => {
    onFormChange({ ...form, title });
  };

  const handleDescriptionChange = (description: string) => {
    onFormChange({ ...form, description });
  };

  const handleQuestionChange = (questionId: string, updates: Partial<EditableQuestion>) => {
    const updatedQuestions = form.questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    onFormChange({ ...form, questions: updatedQuestions });
  };

  const handleQuestionTypeChange = (questionId: string, type: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question) return;

    const updates: Partial<EditableQuestion> = { type };
    
    // Reset options when changing to/from types that use them
    if (['opcion_multiple', 'checkboxes', 'dropdown'].includes(type)) {
      updates.options = question.options || ['Opción 1', 'Opción 2'];
    } else {
      updates.options = undefined;
    }

    // Reset range for linear scale
    if (type === 'escala_lineal') {
      updates.range = [1, 10];
    } else {
      updates.range = undefined;
    }

    handleQuestionChange(questionId, updates);
  };

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = value;
    handleQuestionChange(questionId, { options: updatedOptions });
  };

  const addOption = (questionId: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question) return;

    const updatedOptions = [...(question.options || []), `Opción ${(question.options?.length || 0) + 1}`];
    handleQuestionChange(questionId, { options: updatedOptions });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const updatedOptions = question.options.filter((_, index) => index !== optionIndex);
    handleQuestionChange(questionId, { options: updatedOptions });
  };

  const addQuestion = () => {
    const newQuestion: EditableQuestion = {
      id: `q${Date.now()}`,
      type: 'texto_corto',
      label: 'Nueva pregunta',
      required: false,
    };
    onFormChange({ ...form, questions: [...form.questions, newQuestion] });
  };

  const removeQuestion = (questionId: string) => {
    const updatedQuestions = form.questions.filter(q => q.id !== questionId);
    onFormChange({ ...form, questions: updatedQuestions });
  };

  const getQuestionIcon = (type: string) => {
    const typeConfig = QUESTION_TYPES.find(t => t.value === type);
    return typeConfig?.icon || '❓';
  };

  const getQuestionTypeLabel = (type: string) => {
    const typeConfig = QUESTION_TYPES.find(t => t.value === type);
    return typeConfig?.label || type;
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
        {/* Form Header */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl font-bold border-none p-0 focus:ring-0 focus:outline-none"
                placeholder="Título del formulario"
              />
            </CardTitle>
            <textarea
              value={form.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="text-sm text-muted-foreground border-none w-full focus:ring-0 focus:outline-none resize-none bg-transparent"
              placeholder="Descripción del formulario (opcional)"
              rows={2}
            />
          </CardHeader>
        </Card>

      {/* Questions */}
      <div className="space-y-4">
        {form.questions.map((question, index) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-4">
                  {/* Question Type and Label */}
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-8">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1">Pregunta {index + 1}</label>
                      <Input
                        value={question.label}
                        onChange={(e) => handleQuestionChange(question.id, { label: e.target.value })}
                        placeholder="Escribe tu pregunta aquí"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1">Tipo</label>
                      <select
                        value={question.type}
                        onChange={(e) => handleQuestionTypeChange(question.id, e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      >
                        {QUESTION_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Options for specific types */}
                  {['opcion_multiple', 'checkboxes', 'dropdown'].includes(question.type) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1">Opciones</label>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                            className="text-sm"
                            placeholder={`Opción ${optionIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(question.id)}
                        className="text-xs"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar opción
                      </Button>
                    </div>
                  )}

                  {/* Range for linear scale */}
                  {question.type === 'escala_lineal' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1">Valor mínimo</label>
                        <Input
                          type="number"
                          value={question.range?.[0] || 1}
                          onChange={(e) => handleQuestionChange(question.id, { 
                            range: [parseInt(e.target.value) || 1, question.range?.[1] || 10] 
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1">Valor máximo</label>
                        <Input
                          type="number"
                          value={question.range?.[1] || 10}
                          onChange={(e) => handleQuestionChange(question.id, { 
                            range: [question.range?.[0] || 1, parseInt(e.target.value) || 10] 
                          })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Required toggle */}
                  <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={question.required || false}
                        onChange={(e) => handleQuestionChange(question.id, { required: e.target.checked })}
                        className="rounded border-input border bg-background h-4 w-4"
                      />
                      <label className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pregunta obligatoria</label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                   <Badge variant="outline" className="text-xs">
                     {getQuestionIcon(question.type)} {getQuestionTypeLabel(question.type)}
                   </Badge>
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={() => removeQuestion(question.id)}
                     className="text-red-500 hover:text-red-600"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar pregunta
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            onClick={() => onCreateForm(form)}
            disabled={isCreating || form.questions.length === 0}
            className="gap-2"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creando...
              </>
            ) : (
              <>Crear en Google Forms</>
            )}
          </Button>
        </div>
      </div>
  );
}