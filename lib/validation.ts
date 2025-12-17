/**
 * Validation Schemas using Zod
 * 
 * Provides strict validation for API requests to prevent:
 * - Invalid data types
 * - Malformed input
 * - Injection attacks
 * - Data corruption
 */

import { z } from 'zod';

/**
 * Validation for French names (with accents and special characters)
 * Allows: Letters (including À-ÿ), spaces, hyphens, apostrophes
 */
const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

/**
 * Answer schema - validates individual answer objects
 */
export const answerSchema = z.object({
  questionId: z.union([
    z.string().min(1, 'Question ID is required'),
    z.number().int().positive('Question ID must be a positive number'),
  ]).transform((val) => String(val)), // Normalize to string
  questionText: z.string().min(1, 'Question text is required').max(500, 'Question text too long'),
  answer: z.union([
    z.string().min(1, 'Answer is required').max(1000, 'Answer too long'),
    z.number().transform((val) => String(val)), // Convert numbers to strings
  ]).transform((val) => String(val)), // Normalize to string
});

/**
 * Submit request schema - validates the entire submission
 */
export const submitRequestSchema = z.object({
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(nameRegex, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes')
    .transform((val) => val.trim()), // Trim whitespace
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(nameRegex, 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes')
    .transform((val) => val.trim()), // Trim whitespace
  email: z
    .string()
    .email('Format d\'email invalide')
    .transform((val) => val.trim().toLowerCase()), // Normalize email
  userId: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  answers: z
    .array(answerSchema)
    .min(1, 'Au moins une réponse est requise')
    .max(100, 'Trop de réponses (maximum 100)'),
});

/**
 * Type inference from schema
 */
export type SubmitRequest = z.infer<typeof submitRequestSchema>;
export type Answer = z.infer<typeof answerSchema>;

/**
 * Validate submit request
 * 
 * @param data - Raw request data
 * @returns Validation result with success status and data/errors
 */
export function validateSubmitRequest(data: unknown): {
  success: boolean;
  data?: SubmitRequest;
  errors?: z.ZodError;
} {
  const result = submitRequestSchema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }
  
  return {
    success: false,
    errors: result.error,
  };
}

/**
 * Format Zod errors for user-friendly messages
 * 
 * @param error - Zod error object
 * @returns Array of formatted error messages
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    const message = err.message;
    
    // Custom messages for common fields
    if (path === 'nom') {
      return `Nom: ${message}`;
    }
    if (path === 'prenom') {
      return `Prénom: ${message}`;
    }
    if (path.startsWith('answers')) {
      const index = err.path[1];
      const field = err.path[2];
      return `Réponse ${index !== undefined ? `#${Number(index) + 1}` : ''}${field ? ` (${field})` : ''}: ${message}`;
    }
    
    return `${path ? `${path}: ` : ''}${message}`;
  });
}

/**
 * Sanitize string input (additional security layer)
 * Removes potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/\0/g, ''); // Remove null bytes
}

