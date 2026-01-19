import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/mailer';
import {
  emailVerificationConfig,
  generateCode,
  isAllowedDomain,
  normalizeEmail,
  saveCode,
} from '@/lib/emailVerification';
import { createErrorResponse, handleApiError } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    // Parse request body with proper error handling
    let body: { email?: string };
    try {
      body = await request.json();
    } catch (error) {
      return createErrorResponse(
        error,
        400,
        { code: 'INVALID_JSON', context: 'POST /api/auth/request-code', customMessage: 'Format JSON invalide' }
      );
    }

    const { email } = body;
    if (!email || typeof email !== 'string') {
      return createErrorResponse(
        new Error('Email is required'),
        400,
        { code: 'MISSING_EMAIL', context: 'POST /api/auth/request-code', customMessage: 'Email requis' }
      );
    }

    const normalized = normalizeEmail(email);
    
    // Debug logging (only in development - never log emails in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[request-code] Email original:', email);
      console.log('[request-code] Email normalisé:', normalized);
    }
    
    if (!isAllowedDomain(normalized)) {
      return createErrorResponse(
        new Error(`Domain not allowed. Only @${emailVerificationConfig.allowedDomain} emails are allowed`),
        403,
        { code: 'DOMAIN_NOT_ALLOWED', context: 'POST /api/auth/request-code', customMessage: 'Domaine non autorisé' }
      );
    }

    const code = generateCode(6);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[request-code] Code généré:', code);
    }
    await saveCode(normalized, code);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[request-code] Code sauvegardé pour:', normalized);
    } else {
      console.log('[request-code] Verification code generated and saved');
    }
    
    // Send email - wait for it to complete to ensure it was sent successfully
    try {
      await sendVerificationEmail(normalized, code);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[request-code] Verification email sent successfully to:', normalized);
      }
      
      return NextResponse.json({
        message: 'Code envoyé',
        ttlMs: emailVerificationConfig.ttlMs,
        attempts: emailVerificationConfig.maxAttempts,
      });
    } catch (emailError: any) {
      // Log the error with details
      console.error('[request-code] Failed to send verification email:', emailError);
      
      // Clean up the saved code since email failed
      try {
        const { clearCode } = await import('@/lib/emailVerification');
        clearCode(normalized);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      
      // Return error response
      return createErrorResponse(
        emailError,
        500,
        { 
          code: 'EMAIL_SEND_FAILED', 
          context: 'POST /api/auth/request-code', 
          customMessage: 'Échec de l\'envoi de l\'email. Veuillez vérifier votre configuration SMTP ou réessayer plus tard.' 
        }
      );
    }
  } catch (error: any) {
    return handleApiError(error, 'POST /api/auth/request-code');
  }
}

