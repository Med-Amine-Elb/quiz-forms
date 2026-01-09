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
    
    // Send email asynchronously in the background - don't wait for it
    // Use Promise.resolve().then() to ensure response is sent before email processing starts
    // This makes the API response instant even if email sending takes time
    Promise.resolve().then(() => {
      sendVerificationEmail(normalized, code).catch((error) => {
        // Log error but don't fail the request - code is already saved
        if (process.env.NODE_ENV !== 'production') {
          console.error('[request-code] Failed to send verification email:', error);
        } else {
          console.error('[request-code] Email send failed:', error?.message || 'Unknown error');
        }
        // Email sending failed, but code is already saved
        // User can request a new code if needed
      });
    });

    // Return immediately - email is being sent in background
    // This ensures fast response time (< 1s) even if email sending is slow (2-5s)
    return NextResponse.json({
      message: 'Code envoyé',
      ttlMs: emailVerificationConfig.ttlMs,
      attempts: emailVerificationConfig.maxAttempts,
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/auth/request-code');
  }
}

