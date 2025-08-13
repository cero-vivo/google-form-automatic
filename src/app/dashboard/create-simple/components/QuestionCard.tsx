'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Trash2, Copy, Settings, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Question } from '@/domain/entities/question';

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isLast: boolean;
}

export default function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onReorder,
  isLast
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleTitleChange = (value: string) => {
    onUpdate(question.id, { title: value });
  };

  const handleDescriptionChange = (value: string) => {
    onUpdate(question.id, { description: value });
  };

  const handleRequiredChange = (required: boolean) => {
    onUpdate(question.id, { required });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (question.multipleChoiceConfig?.options) {
      const newOptions = [...question.multipleChoiceConfig.options];
      newOptions[optionIndex] = value;
      onUpdate(question.id, {
        multipleChoiceConfig: {
          ...question.multipleChoiceConfig,
          options: newOptions
        }
      });
    }
  };

  const addOption = () => {
    if (question.multipleChoiceConfig?.options) {
      const newOptions = [...question.multipleChoiceConfig.options, `Opción ${question.multipleChoiceConfig.options.length + 1}`];
      onUpdate(question.id, {
        multipleChoiceConfig: {
          ...question.multipleChoiceConfig,
          options: newOptions
        }
      });
    }
  };

  const removeOption = (optionIndex: number) => {
    if (question.multipleChoiceConfig?.options && question.multipleChoiceConfig.options.length > 1) {
      const newOptions = question.multipleChoiceConfig.options.filter((_, i) => i !== optionIndex);
      onUpdate(question.id, {
        multipleChoiceConfig: {
          ...question.multipleChoiceConfig,
          options: newOptions
        }
      });
    }
  };

  const handleScaleChange = (field: 'min' | 'max' | 'minLabel' | 'maxLabel', value: string | number) => {
    if (question.linearScaleConfig) {
      onUpdate(question.id, {
        linearScaleConfig: {
          ...question.linearScaleConfig,
          [field]: value
        }
      });
    }
  };

  const getQuestionIcon = (type: string) => {
    const icons: Record<string, string> = {
      short_text: '📝',
      long_text: '📄',
      multiple_choice: '🔘',
      checkboxes: '☑️',
      dropdown: '📋',
      scale: '📊',
      date: '📅',
      email: '📧',
      number: '🔢'
    };
    return icons[type] || '📝';
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      short_text: 'Texto corto',
      long_text: 'Texto largo',
      multiple_choice: 'Opción múltiple',
      checkboxes: 'Casillas',
      dropdown: 'Desplegable',
      scale: 'Escala',
      date: 'Fecha',
      email: 'Email',
      number: 'Número'
    };
    return labels[type] || type;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Drag Handle */}
            <div className="mt-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4 text-slate-400" />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getQuestionIcon(question.type)}</span>
                  <Badge variant="outline" className="text-xs">
                    {getQuestionTypeLabel(question.type)}
                  </Badge>
                  <Badge 
                    variant={question.required ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {question.required ? 'Requerido' : 'Opcional'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Question Content */}
              <div className="space-y-2">
                <Input
                  value={question.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Escribe tu pregunta aquí"
                  className="font-medium"
                />
                
                <Textarea
                  value={question.description || ''}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Descripción opcional (aparece debajo de la pregunta)"
                  rows={2}
                  className="text-sm"
                />
              </div>

              {/* Options for choice-based questions */}
              {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Opciones</label>
                  {question.multipleChoiceConfig?.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(index)}
                        disabled={question.multipleChoiceConfig?.options?.length === 1}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={addOption}
                    className="text-sm"
                  >
                    + Agregar opción
                  </Button>
                </div>
              )}

              {/* Scale configuration */}
              {question.type === 'scale' && question.linearScaleConfig && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Mínimo</label>
                      <Input
                        type="number"
                        value={question.linearScaleConfig.min}
                        onChange={(e) => handleScaleChange('min', parseInt(e.target.value) || 1)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Máximo</label>
                      <Input
                        type="number"
                        value={question.linearScaleConfig.max}
                        onChange={(e) => handleScaleChange('max', parseInt(e.target.value) || 5)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Etiqueta mínima</label>
                      <Input
                        value={question.linearScaleConfig.minLabel}
                        onChange={(e) => handleScaleChange('minLabel', e.target.value)}
                        placeholder="Ej: Muy malo"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Etiqueta máxima</label>
                      <Input
                        value={question.linearScaleConfig.maxLabel}
                        onChange={(e) => handleScaleChange('maxLabel', e.target.value)}
                        placeholder="Ej: Muy bueno"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={question.required}
                    onCheckedChange={handleRequiredChange}
                  />
                  <label className="text-sm">Requerido</label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}