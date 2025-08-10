import { 
  QuestionType, 
  QuestionId, 
  ValidationRule, 
  MultipleChoiceConfig, 
  LinearScaleConfig,
  DateTimeConfig 
} from '../types';

export interface Question {
  id: QuestionId;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  
  // Configuraciones específicas por tipo
  multipleChoiceConfig?: MultipleChoiceConfig;
  linearScaleConfig?: LinearScaleConfig;
  dateTimeConfig?: DateTimeConfig;
  
  // Validaciones personalizadas
  validation?: ValidationRule[];
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
}

export class QuestionEntity implements Question {
  constructor(
    public id: QuestionId,
    public type: QuestionType,
    public title: string,
    public required: boolean,
    public order: number,
    public description?: string,
    public multipleChoiceConfig?: MultipleChoiceConfig,
    public linearScaleConfig?: LinearScaleConfig,
    public dateTimeConfig?: DateTimeConfig,
    public validation?: ValidationRule[],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Métodos de dominio
  updateTitle(newTitle: string): void {
    if (!newTitle.trim()) {
      throw new Error('El título de la pregunta no puede estar vacío');
    }
    this.title = newTitle.trim();
    this.updatedAt = new Date();
  }

  updateType(newType: QuestionType): void {
    this.type = newType;
    // Limpiar configuraciones que no aplican al nuevo tipo
    this.cleanConfigForType(newType);
    this.updatedAt = new Date();
  }

  setRequired(required: boolean): void {
    this.required = required;
    this.updatedAt = new Date();
  }

  updateOrder(newOrder: number): void {
    if (newOrder < 0) {
      throw new Error('El orden no puede ser negativo');
    }
    this.order = newOrder;
    this.updatedAt = new Date();
  }

  addValidationRule(rule: ValidationRule): void {
    if (!this.validation) {
      this.validation = [];
    }
    this.validation.push(rule);
    this.updatedAt = new Date();
  }

  removeValidationRule(ruleType: string): void {
    if (this.validation) {
      this.validation = this.validation.filter(rule => rule.type !== ruleType);
      this.updatedAt = new Date();
    }
  }

  private cleanConfigForType(type: QuestionType): void {
    // Limpiar configuraciones que no aplican al tipo seleccionado
    if (type !== QuestionType.MULTIPLE_CHOICE && type !== QuestionType.CHECKBOXES && type !== QuestionType.DROPDOWN) {
      this.multipleChoiceConfig = undefined;
    }
    if (type !== QuestionType.LINEAR_SCALE) {
      this.linearScaleConfig = undefined;
    }
    if (type !== QuestionType.DATE && type !== QuestionType.TIME) {
      this.dateTimeConfig = undefined;
    }
  }

  // Validaciones de dominio
  validate(): string[] {
    const errors: string[] = [];

    if (!this.title.trim()) {
      errors.push('El título es requerido');
    }

    if (this.type === QuestionType.MULTIPLE_CHOICE || 
        this.type === QuestionType.CHECKBOXES || 
        this.type === QuestionType.DROPDOWN) {
      if (!this.multipleChoiceConfig?.options?.length) {
        errors.push('Se requieren opciones para este tipo de pregunta');
      }
    }

    if (this.type === QuestionType.LINEAR_SCALE) {
      if (!this.linearScaleConfig) {
        errors.push('Se requiere configuración de escala');
      } else if (this.linearScaleConfig.min >= this.linearScaleConfig.max) {
        errors.push('El valor mínimo debe ser menor al máximo');
      }
    }

    return errors;
  }

  isValid(): boolean {
    return this.validate().length === 0;
  }

  // Métodos para serialización
  toJSON(): Question {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      description: this.description,
      required: this.required,
      order: this.order,
      multipleChoiceConfig: this.multipleChoiceConfig,
      linearScaleConfig: this.linearScaleConfig,
      dateTimeConfig: this.dateTimeConfig,
      validation: this.validation,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(data: Question): QuestionEntity {
    return new QuestionEntity(
      data.id,
      data.type,
      data.title,
      data.required,
      data.order,
      data.description,
      data.multipleChoiceConfig,
      data.linearScaleConfig,
      data.dateTimeConfig,
      data.validation,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
} 