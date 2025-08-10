import { User, UserEntity } from '../entities/user';
import { UserId } from '../types';

export interface UserRepository {
  // Operaciones CRUD básicas
  save(user: UserEntity): Promise<void>;
  findById(userId: UserId): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(userId: UserId, updates: Partial<User>): Promise<void>;
  delete(userId: UserId): Promise<void>;
  
  // Verificaciones de existencia
  exists(userId: UserId): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  
  // Estadísticas de usuario
  updateFormCount(userId: UserId, increment: boolean): Promise<void>;
  updateResponseCount(userId: UserId, increment: boolean): Promise<void>;
  updateLastLogin(userId: UserId): Promise<void>;
  
  // Google OAuth tokens
  updateGoogleTokens(userId: UserId, accessToken: string, refreshToken?: string, expiryDate?: Date): Promise<void>;
  clearGoogleTokens(userId: UserId): Promise<void>;
  
  // Plan y subscripción
  updateUserPlan(userId: UserId, plan: string, subscriptionId?: string, expiryDate?: Date): Promise<void>;
  
  // Búsqueda y administración
  searchUsers(query: string): Promise<UserEntity[]>;
  findUsersByPlan(plan: string): Promise<UserEntity[]>;
  findInactiveUsers(daysSinceLastLogin: number): Promise<UserEntity[]>;
} 