export interface QuestionType {
  type: string;
  icon: string;
  label: string;
  description: string;
  color: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  questions: number;
  category: string;
  preview: {
    title: string;
    description: string;
    questions: Array<{
      type: string;
      title: string;
      required: boolean;
    }>;
  };
}

export interface FormSettings {
  title: string;
  description: string;
  collectEmails: boolean;
  limitResponses: boolean;
  maxResponses?: number;
  customMessage?: string;
  shuffleQuestions: boolean;
  allowEditResponses: boolean;
}

export interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface DragState {
  isDragging: boolean;
  draggedItem: string | null;
  draggedOverItem: string | null;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}