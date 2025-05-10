import * as crypto from 'crypto';
import jwt from 'jsonwebtoken'; // Cambiar importación a importación por defecto
import dotenv from 'dotenv';

dotenv.config();

// Definir la clave secreta como string
const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-key';

/**
 * Generates a random session ID for payment sessions
 * @returns A unique session ID string
 */
export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

/**
 * Generates a random numeric token for payment verification
 * @param length Length of the token (default: 6)
 * @returns A numeric token string
 */
export const generateToken = (length: number = 6): string => {
  // Generate a random numeric token
  const characters = '0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return token;
};

/**
 * Generate a JWT token
 * @param payload Data to encode in the token
 * @param expiresIn Expiration time (default: 30m)
 * @returns JWT token string
 */
export const generateJWT = (payload: object, expiresIn: string = '30m'): string => {
  // Usar el tipo más básico para evitar conflictos de tipado
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};