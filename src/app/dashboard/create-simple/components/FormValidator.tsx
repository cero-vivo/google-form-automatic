import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/domain/entities/question';

interface FormValidatorProps {
  questions: Question[];
  formTitle: string;
  formDescription: string;
}

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  questionId?: string;
}

const FormValidator: React.FC<FormValidatorProps> = ({
  questions,
  formTitle,
  formDescription,
}) => {
  const issues: ValidationIssue[] = [];

  // Validar título del formulario
  if (!formTitle.trim()) {
    issues.push({
      type: 'error',
      message: 'El título del formulario es requerido',
      field: 'title',
    });
  } else if (formTitle.length < 3) {
    issues.push({
      type: 'warning',
      message: 'El título es muy corto (mínimo 3 caracteres)',
      field: 'title',
    });
  }

  // Validar preguntas
  if (questions.length === 0) {
    issues.push({
      type: 'error',
      message: 'Debes agregar al menos una pregunta',
    });
  }

  questions.forEach((question, index) => {
    // Validar título de la pregunta
    if (!question.title.trim()) {
      issues.push({
        type: 'error',
        message: `Pregunta ${index + 1}: El título es requerido`,
        questionId: question.id,
      });
    }

    // Validar opciones para preguntas de selección
    if (['multiple_choice', 'checkboxes', 'dropdown'].includes(question.type)) {
      const options = question.multipleChoiceConfig?.options;
      if (!options || options.length < 2) {
        issues.push({
          type: 'error',
          message: `Pregunta ${index + 1}: Debes proporcionar al menos 2 opciones`,
          questionId: question.id,
        });
      }
    }

    // Validar escala lineal
    if (question.type === 'linear_scale') {
      const scale = question.linearScaleConfig;
      if (!scale || scale.min >= scale.max) {
        issues.push({
          type: 'error',
          message: `Pregunta ${index + 1}: La escala debe tener un rango válido`,
          questionId: question.id,
        });
      }
    }

    // Advertencias
    if (question.title && question.title.length > 100) {
      issues.push({
        type: 'warning',
        message: `Pregunta ${index + 1}: El título es muy largo`,
        questionId: question.id,
      });
    }
  });

  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const info = issues.filter(i => i.type === 'info');

  if (issues.length === 0) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">¡Tu formulario está listo!</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="font-medium">Validación del formulario</span>
          <div className="ml-auto flex gap-2">
            {errors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errors.length} error{errors.length > 1 ? 'es' : ''}
              </Badge>
            )}
            {warnings.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                {warnings.length} advertencia{warnings.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {issues.map((issue, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 text-sm ${
                issue.type === 'error' ? 'text-red-600' :
                issue.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
              }`}
            >
              {issue.type === 'error' ? (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : issue.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FormValidator;