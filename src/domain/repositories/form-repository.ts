import { Form, FormEntity } from '../entities/form';
import { FormId, UserId, FormStatus } from '../types';

export interface FormRepository {
  // Operaciones CRUD básicas
  save(form: FormEntity): Promise<void>;
  findById(formId: FormId): Promise<FormEntity | null>;
  findByUserId(userId: UserId): Promise<FormEntity[]>;
  update(formId: FormId, updates: Partial<Form>): Promise<void>;
  delete(formId: FormId): Promise<void>;
  
  // Consultas específicas
  findByStatus(userId: UserId, status: FormStatus): Promise<FormEntity[]>;
  findPublishedForms(userId: UserId): Promise<FormEntity[]>;
  findDraftForms(userId: UserId): Promise<FormEntity[]>;
  findArchivedForms(userId: UserId): Promise<FormEntity[]>;
  
  // Búsqueda y filtrado
  searchForms(userId: UserId, query: string): Promise<FormEntity[]>;
  findFormsByDateRange(userId: UserId, startDate: Date, endDate: Date): Promise<FormEntity[]>;
  
  // Estadísticas
  getTotalFormsCount(userId: UserId): Promise<number>;
  getTotalResponsesCount(userId: UserId): Promise<number>;
  getFormStats(formId: FormId): Promise<FormStats>;
  
  // Operaciones en lote
  duplicateForm(formId: FormId, newTitle: string): Promise<FormEntity>;
  archiveMultipleForms(formIds: FormId[]): Promise<void>;
  deleteMultipleForms(formIds: FormId[]): Promise<void>;
}

export interface FormStats {
  totalResponses: number;
  totalViews: number;
  conversionRate: number;
  averageCompletionTime?: number;
  lastResponseAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 