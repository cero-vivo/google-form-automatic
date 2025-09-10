// Para desarrollo, usamos el cliente SDK
import { db } from './config';

// Exportar el cliente SDK como fallback
export const adminDb = db;
export const adminDbFallback = db;