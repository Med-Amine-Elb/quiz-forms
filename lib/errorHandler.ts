import { NextResponse } from 'next/server';

/**
 * Error Handler for Production
 * 
 * Centralized error handling that:
 * - Hides technical details from clients in production
 * - Logs full error details server-side
 * - Provides user-friendly error messages
 * - Maintains detailed errors in development
 */

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

/**
 * Standard error messages for production
 * These are user-friendly and don't expose system internals
 */
const PRODUCTION_ERROR_MESSAGES = {
  // Client errors (4xx)
  BAD_REQUEST: 'Requête invalide. Veuillez vérifier vos données.',
  UNAUTHORIZED: 'Authentification requise.',
  FORBIDDEN: 'Accès refusé.',
  NOT_FOUND: 'Ressource non trouvée.',
  CONFLICT: 'Conflit détecté. Cette action a déjà été effectuée.',
  TOO_MANY_REQUESTS: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
  GONE: 'Cette ressource n\'est plus disponible.',
  
  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 'Une erreur serveur s\'est produite. Veuillez réessayer plus tard.',
  SERVICE_UNAVAILABLE: 'Service temporairement indisponible. Veuillez réessayer plus tard.',
  GATEWAY_TIMEOUT: 'Le service a pris trop de temps à répondre. Veuillez réessayer.',
  
  // Specific errors
  VALIDATION_ERROR: 'Les données soumises sont invalides.',
  EXTERNAL_SERVICE_ERROR: 'Erreur de communication avec un service externe.',
  DATABASE_ERROR: 'Erreur de base de données.',
  EMAIL_ERROR: 'Erreur lors de l\'envoi de l\'email.',
} as const;

/**
 * Map HTTP status codes to error messages
 */
function getErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return PRODUCTION_ERROR_MESSAGES.BAD_REQUEST;
    case 401:
      return PRODUCTION_ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return PRODUCTION_ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return PRODUCTION_ERROR_MESSAGES.NOT_FOUND;
    case 409:
      return PRODUCTION_ERROR_MESSAGES.CONFLICT;
    case 410:
      return PRODUCTION_ERROR_MESSAGES.GONE;
    case 429:
      return PRODUCTION_ERROR_MESSAGES.TOO_MANY_REQUESTS;
    case 500:
      return PRODUCTION_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    case 503:
      return PRODUCTION_ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    case 504:
      return PRODUCTION_ERROR_MESSAGES.GATEWAY_TIMEOUT;
    default:
      return PRODUCTION_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }
}

/**
 * Log error with appropriate detail level
 */
function logError(error: unknown, context?: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const prefix = context ? `[${context}]` : '[errorHandler]';
  
  if (isProduction) {
    // In production: log minimal info (no stack traces, no sensitive data)
    if (error instanceof Error) {
      console.error(`${prefix} ${error.message}`);
    } else {
      console.error(`${prefix} Unknown error occurred`);
    }
  } else {
    // In development: log full details
    console.error(`${prefix} Error:`, error);
    if (error instanceof Error) {
      console.error(`${prefix} Stack:`, error.stack);
    }
  }
}

/**
 * Create a standardized error response
 * 
 * @param error - The error object or message
 * @param statusCode - HTTP status code
 * @param options - Additional options (code, details, context)
 * @returns NextResponse with error
 */
export function createErrorResponse(
  error: unknown,
  statusCode: number = 500,
  options?: {
    code?: string;
    details?: any;
    context?: string;
    customMessage?: string;
  }
): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  const { code, details, context, customMessage } = options || {};
  
  // Log error server-side
  logError(error, context);
  
  // Determine error message
  let message: string;
  if (customMessage) {
    message = customMessage;
  } else if (isProduction) {
    // Production: use generic message
    message = getErrorMessage(statusCode);
  } else {
    // Development: show actual error message
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = getErrorMessage(statusCode);
    }
  }
  
  // Build response body
  const responseBody: any = {
    error: message,
  };
  
  // Add code if provided
  if (code) {
    responseBody.code = code;
  }
  
  // Add details only in development
  if (!isProduction && details) {
    responseBody.details = details;
  }
  
  // Add error details in development (for debugging)
  if (!isProduction && error instanceof Error) {
    responseBody._debug = {
      message: error.message,
      name: error.name,
      // Don't include stack in response, only in logs
    };
  }
  
  return NextResponse.json(responseBody, { status: statusCode });
}

/**
 * Handle unexpected errors in API routes
 * 
 * Usage:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   try {
 *     // ... your code
 *   } catch (error) {
 *     return handleApiError(error, 'POST /api/submit');
 *   }
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  context?: string
): NextResponse {
  // Determine status code from error
  let statusCode = 500;
  
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      statusCode = 400;
    } else if (error.message.includes('unauthorized') || error.message.includes('auth')) {
      statusCode = 401;
    } else if (error.message.includes('forbidden') || error.message.includes('permission')) {
      statusCode = 403;
    } else if (error.message.includes('not found')) {
      statusCode = 404;
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
    }
  }
  
  return createErrorResponse(error, statusCode, { context });
}

/**
 * Create validation error response
 */
export function createValidationErrorResponse(
  errors: string[] | Record<string, string[]>,
  context?: string
): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  
  logError(new Error('Validation failed'), context);
  
  return NextResponse.json(
    {
      error: PRODUCTION_ERROR_MESSAGES.VALIDATION_ERROR,
      code: 'VALIDATION_ERROR',
      ...(isProduction ? {} : { details: errors }),
    },
    { status: 400 }
  );
}

/**
 * Create external service error response
 * (e.g., Power Automate, SMTP, etc.)
 */
export function createExternalServiceErrorResponse(
  service: string,
  error: unknown,
  context?: string
): NextResponse {
  logError(error, context || `external-service:${service}`);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json(
    {
      error: isProduction
        ? PRODUCTION_ERROR_MESSAGES.EXTERNAL_SERVICE_ERROR
        : `Error communicating with ${service}`,
      code: 'EXTERNAL_SERVICE_ERROR',
      service,
      ...(isProduction ? {} : { details: error instanceof Error ? error.message : String(error) }),
    },
    { status: 502 } // Bad Gateway
  );
}

/**
 * Create email error response
 */
export function createEmailErrorResponse(
  error: unknown,
  context?: string
): NextResponse {
  logError(error, context || 'email');
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json(
    {
      error: isProduction
        ? PRODUCTION_ERROR_MESSAGES.EMAIL_ERROR
        : 'Failed to send email',
      code: 'EMAIL_ERROR',
      ...(isProduction ? {} : { details: error instanceof Error ? error.message : String(error) }),
    },
    { status: 500 }
  );
}

