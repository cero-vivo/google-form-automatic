// Enums del dominio
export enum QuestionType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  MULTIPLE_CHOICE = 'multiple_choice',
  CHECKBOXES = 'checkboxes',
  DROPDOWN = 'dropdown',
  LINEAR_SCALE = 'linear_scale',
  DATE = 'date',
  TIME = 'time',
  EMAIL = 'email',
  NUMBER = 'number',
  PHONE = 'phone',
  RATING = 'rating',
  URL = 'url'
}

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum ValidationRuleType {
  REQUIRED = 'required',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  EMAIL_FORMAT = 'email_format',
  NUMBER_RANGE = 'number_range',
  REGEX_PATTERN = 'regex_pattern'
}

// Tipos base
export type QuestionId = string;
export type FormId = string;
export type UserId = string;

// Interfaces de validación
export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
  message?: string;
}

// Configuraciones específicas por tipo de pregunta
export interface MultipleChoiceConfig {
  options: string[];
  allowOther?: boolean;
}

export interface LinearScaleConfig {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}