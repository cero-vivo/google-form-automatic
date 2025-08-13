'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/domain/entities/question';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface FormData {
  title: string;
  description: string;
  collectEmails: boolean;
  limitResponses: boolean;
  maxResponses?: number;
}

interface LivePreviewProps {
  formData: FormData;
  questions: Question[];
  viewMode: 'desktop' | 'mobile';
}

export default function LivePreview({ formData, questions, viewMode }: LivePreviewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
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

  const renderQuestionPreview = (question: Question, index: number) => {
    const isRequired = question.required;
    
    return (
      <motion.div
        key={question.id}
        variants={itemVariants}
        className="space-y-3"
      >
        <div>
          <Label className="text-sm font-medium flex items-center">
            <span className="mr-2">{getQuestionIcon(question.type)}</span>
            {question.title}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {question.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {question.description}
            </p>
          )}
        </div>

        {renderInputPreview(question)}
      </motion.div>
    );
  };

  const renderInputPreview = (question: Question) => {
    switch (question.type) {
      case 'short_text':
        return (
          <Input
            placeholder="Tu respuesta aquí"
            className="w-full"
            disabled
          />
        );

      case 'long_text':
        return (
          <Textarea
            placeholder="Tu respuesta aquí"
            className="w-full min-h-[80px]"
            disabled
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup className="space-y-2">
            {question.multipleChoiceConfig?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-option-${index}`} disabled />
                <Label htmlFor={`${question.id}-option-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkboxes':
        return (
          <div className="space-y-2">
            {question.multipleChoiceConfig?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${question.id}-checkbox-${index}`} disabled />
                <Label htmlFor={`${question.id}-checkbox-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {question.multipleChoiceConfig?.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'linear_scale':
        const min = question.linearScaleConfig?.min || 1;
        const max = question.linearScaleConfig?.max || 5;
        const minLabel = question.linearScaleConfig?.minLabel || 'Muy malo';
        const maxLabel = question.linearScaleConfig?.maxLabel || 'Muy bueno';
        
        return (
          <div className="space-y-3">
            <Slider
              defaultValue={[Math.floor((min + max) / 2)]}
              min={min}
              max={max}
              step={1}
              disabled
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{minLabel} ({min})</span>
              <span>{maxLabel} ({max})</span>
            </div>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            className="w-full"
            disabled
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder="tu@email.com"
            className="w-full"
            disabled
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="0"
            className="w-full"
            disabled
          />
        );

      default:
        return (
          <Input
            placeholder="Tu respuesta aquí"
            className="w-full"
            disabled
          />
        );
    }
  };

  const containerClasses = viewMode === 'mobile' 
    ? 'max-w-sm mx-auto' 
    : 'max-w-2xl';

  return (
    <div className={containerClasses}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardTitle className="text-lg">
            {formData.title || 'Formulario sin título'}
          </CardTitle>
          {formData.description && (
            <CardDescription>
              {formData.description}
            </CardDescription>
          )}
          {formData.collectEmails && (
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              📧 Se recopilarán direcciones de correo electrónico
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Email field if collectEmails is enabled */}
            {formData.collectEmails && (
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>
                  📧 Correo electrónico
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full"
                  disabled
                />
              </motion.div>
            )}

            {/* Questions */}
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                variants={itemVariants}
                className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 pb-6 last:pb-0"
              >
                {renderQuestionPreview(question, index)}
              </motion.div>
            ))}

            {questions.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 text-slate-500"
              >
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm">Tu formulario aparecerá aquí</p>
                <p className="text-xs mt-1">Agrega preguntas en el panel de edición</p>
              </motion.div>
            )}

            {/* Submit button preview */}
            {questions.length > 0 && (
              <motion.div variants={itemVariants} className="pt-4">
                <button
                  disabled
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md opacity-50 cursor-not-allowed"
                >
                  Enviar respuesta
                </button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Response counter preview */}
      {formData.limitResponses && formData.maxResponses && (
        <div className="text-center mt-4 text-sm text-slate-500">
          Límite de {formData.maxResponses} respuestas
        </div>
      )}
    </div>
  );
}