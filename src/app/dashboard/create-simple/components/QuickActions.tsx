import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2, Settings, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Question } from '@/domain/entities/question';

interface QuickActionsProps {
  questions: Question[];
  onAddQuestion: (type: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onPreview: () => void;
  onShare: () => void;
  selectedQuestionId?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  questions,
  onAddQuestion,
  onDuplicateQuestion,
  onDeleteQuestion,
  onPreview,
  onShare,
  selectedQuestionId,
}) => {
  const commonQuestionTypes = [
    { type: 'short_text', label: 'Texto corto', icon: 'T' },
    { type: 'multiple_choice', label: 'Opción múltiple', icon: '◉' },
    { type: 'checkboxes', label: 'Casillas', icon: '☐' },
    { type: 'dropdown', label: 'Desplegable', icon: '▼' },
  ];

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg border p-3 flex flex-col gap-2">
          {/* Add Question Types */}
          <div className="flex gap-1">
            {commonQuestionTypes.map((type) => (
              <Tooltip key={type.type}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onAddQuestion(type.type)}
                  >
                    <span className="text-sm font-bold">{type.icon}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{type.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="h-px bg-gray-200" />

          {/* Question Actions */}
          {selectedQuestionId && (
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDuplicateQuestion(selectedQuestionId)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicar pregunta</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => onDeleteQuestion(selectedQuestionId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar pregunta</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className="h-px bg-gray-200" />

          {/* Form Actions */}
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onPreview}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vista previa</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartir</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default QuickActions;