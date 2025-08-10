import { FormId, UserId, FormStatus } from '../types';
import { Question, QuestionEntity } from './question';

export interface Form {
  id: FormId;
  title: string;
  description: string;
  questions: Question[];
  status: FormStatus;
  userId: UserId;
  
  // Metadatos de Google Forms
  googleFormId?: string;
  googleFormUrl?: string;
  
  // Estadísticas
  responseCount?: number;
  viewCount?: number;
  
  // Configuraciones
  settings: FormSettings;
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface FormSettings {
  allowAnonymous: boolean;
  requireSignIn: boolean;
  allowEdit: boolean;
  showProgressBar: boolean;
  shuffleQuestions: boolean;
  limitOneResponse: boolean;
  collectEmailAddresses: boolean;
  confirmationMessage?: string;
  redirectUrl?: string;
}

export class FormEntity implements Form {
  constructor(
    public id: FormId,
    public title: string,
    public description: string,
    public userId: UserId,
    public questions: Question[] = [],
    public status: FormStatus = FormStatus.DRAFT,
    public settings: FormSettings = {
      allowAnonymous: true,
      requireSignIn: false,
      allowEdit: false,
      showProgressBar: true,
      shuffleQuestions: false,
      limitOneResponse: false,
      collectEmailAddresses: false
    },
    public googleFormId?: string,
    public googleFormUrl?: string,
    public responseCount: number = 0,
    public viewCount: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public publishedAt?: Date
  ) {}

  // Métodos de dominio para el formulario
  updateTitle(newTitle: string): void {
    if (!newTitle.trim()) {
      throw new Error('El título del formulario no puede estar vacío');
    }
    this.title = newTitle.trim();
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string): void {
    this.description = newDescription.trim();
    this.updatedAt = new Date();
  }

  updateSettings(newSettings: Partial<FormSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.updatedAt = new Date();
  }

  // Métodos para gestión de preguntas
  addQuestion(question: Question): void {
    // Asignar orden automáticamente
    question.order = this.questions.length;
    this.questions.push(question);
    this.updatedAt = new Date();
  }

  removeQuestion(questionId: string): void {
    const index = this.questions.findIndex(q => q.id === questionId);
    if (index === -1) {
      throw new Error('Pregunta no encontrada');
    }
    
    this.questions.splice(index, 1);
    // Reordenar las preguntas restantes
    this.reorderQuestions();
    this.updatedAt = new Date();
  }

  updateQuestion(questionId: string, updates: Partial<Question>): void {
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new Error('Pregunta no encontrada');
    }

    this.questions[questionIndex] = { 
      ...this.questions[questionIndex], 
      ...updates,
      updatedAt: new Date()
    };
    this.updatedAt = new Date();
  }

  reorderQuestions(): void {
    this.questions.forEach((question, index) => {
      question.order = index;
    });
    this.updatedAt = new Date();
  }

  moveQuestion(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= this.questions.length ||
        toIndex < 0 || toIndex >= this.questions.length) {
      throw new Error('Índices de pregunta inválidos');
    }

    const [movedQuestion] = this.questions.splice(fromIndex, 1);
    this.questions.splice(toIndex, 0, movedQuestion);
    this.reorderQuestions();
  }

  // Métodos de estado
  publish(): void {
    const validationErrors = this.validate();
    if (validationErrors.length > 0) {
      throw new Error(`No se puede publicar el formulario: ${validationErrors.join(', ')}`);
    }

    this.status = FormStatus.PUBLISHED;
    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.status = FormStatus.DRAFT;
    this.publishedAt = undefined;
    this.updatedAt = new Date();
  }

  archive(): void {
    this.status = FormStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  duplicate(newId: string, newTitle: string): FormEntity {
    const duplicatedForm = new FormEntity(
      newId,
      newTitle,
      this.description,
      this.userId,
      this.questions.map(q => ({ ...q, id: `${newId}_${q.id}` })),
      FormStatus.DRAFT,
      { ...this.settings }
    );
    return duplicatedForm;
  }

  // Métodos de integración con Google Forms
  linkGoogleForm(googleFormId: string, googleFormUrl: string): void {
    this.googleFormId = googleFormId;
    this.googleFormUrl = googleFormUrl;
    this.updatedAt = new Date();
  }

  unlinkGoogleForm(): void {
    this.googleFormId = undefined;
    this.googleFormUrl = undefined;
    this.updatedAt = new Date();
  }

  // Métodos de estadísticas
  incrementResponseCount(): void {
    this.responseCount = (this.responseCount || 0) + 1;
    this.updatedAt = new Date();
  }

  incrementViewCount(): void {
    this.viewCount = (this.viewCount || 0) + 1;
    this.updatedAt = new Date();
  }

  // Validaciones de dominio
  validate(): string[] {
    const errors: string[] = [];

    if (!this.title.trim()) {
      errors.push('El título es requerido');
    }

    if (this.questions.length === 0) {
      errors.push('El formulario debe tener al menos una pregunta');
    }

    // Validar cada pregunta
    this.questions.forEach((question, index) => {
      const questionEntity = QuestionEntity.fromJSON(question);
      const questionErrors = questionEntity.validate();
      questionErrors.forEach(error => {
        errors.push(`Pregunta ${index + 1}: ${error}`);
      });
    });

    return errors;
  }

  isValid(): boolean {
    return this.validate().length === 0;
  }

  canPublish(): boolean {
    return this.isValid() && this.status === FormStatus.DRAFT;
  }

  canEdit(): boolean {
    return this.status === FormStatus.DRAFT;
  }

  isPublished(): boolean {
    return this.status === FormStatus.PUBLISHED;
  }

  isArchived(): boolean {
    return this.status === FormStatus.ARCHIVED;
  }

  // Métodos para serialización
  toJSON(): Form {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      questions: this.questions,
      status: this.status,
      userId: this.userId,
      googleFormId: this.googleFormId,
      googleFormUrl: this.googleFormUrl,
      responseCount: this.responseCount,
      viewCount: this.viewCount,
      settings: this.settings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      publishedAt: this.publishedAt
    };
  }

  static fromJSON(data: Form): FormEntity {
    return new FormEntity(
      data.id,
      data.title,
      data.description,
      data.userId,
      data.questions,
      data.status,
      data.settings,
      data.googleFormId,
      data.googleFormUrl,
      data.responseCount,
      data.viewCount,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.publishedAt ? new Date(data.publishedAt) : undefined
    );
  }
} 