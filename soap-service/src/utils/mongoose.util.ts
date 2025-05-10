import { Types } from 'mongoose';

/**
 * Convierte de manera segura un ObjectId de MongoDB a string
 * Esto resuelve problemas de tipado en TypeScript
 */
export function toObjectIdString(id: unknown): string {
  if (id === undefined || id === null) {
    return '';
  }
  
  // Si ya es un string, devolverlo directamente
  if (typeof id === 'string') {
    return id;
  }
  
  // Si es un ObjectId de MongoDB
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }
  
  // Si es un objeto con toString(), intentar usarlo
  if (id && typeof (id as any).toString === 'function') {
    return (id as any).toString();
  }
  
  // Fallback
  return String(id);
}