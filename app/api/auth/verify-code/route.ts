import { NextRequest, NextResponse } from 'next/server';
import {
  emailVerificationConfig,
  normalizeEmail,
  verifyCode as verifyCodeForEmail,
} from '@/lib/emailVerification';
import { createErrorResponse, handleApiError } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    // Safely parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      return createErrorResponse(
        parseError,
        400,
        { code: 'INVALID_JSON', context: 'POST /api/auth/verify-code', customMessage: 'Format de requête invalide' }
      );
    }

    const { email, code } = body || {};
    
    if (!email || typeof email !== 'string' || !code || typeof code !== 'string') {
      return createErrorResponse(
        new Error('Email and code are required'),
        400,
        { code: 'MISSING_FIELDS', context: 'POST /api/auth/verify-code', customMessage: 'Email et code requis' }
      );
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return createErrorResponse(
        new Error('Invalid code format'),
        400,
        { code: 'INVALID_CODE_FORMAT', context: 'POST /api/auth/verify-code', customMessage: 'Format de code invalide' }
      );
    }

    const normalized = normalizeEmail(email);
    
    // Debug logging (only in development - never log codes or emails in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verify-code] Email original:', email);
      console.log('[verify-code] Email normalisé:', normalized);
      console.log('[verify-code] Code reçu:', code);
      console.log('[verify-code] Code length:', code?.length);
    }
    
    const result = await verifyCodeForEmail(normalized, code);
    
    // Debug result (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verify-code] Résultat vérification:', result);
    } else {
      // Production: Only log success/failure without sensitive data
      console.log('[verify-code] Verification result:', result.ok ? 'success' : result.reason);
    }

    if (!result.ok) {
      const status =
        result.reason === 'expired'
          ? 410
          : result.reason === 'attempts_exceeded'
          ? 429
          : result.reason === 'not_found'
          ? 404
          : 400;
      
      let errorMessage = 'Code invalide';
      if (result.reason === 'expired') {
        errorMessage = 'Code expiré. Veuillez demander un nouveau code.';
      } else if (result.reason === 'attempts_exceeded') {
        errorMessage = 'Trop de tentatives. Veuillez demander un nouveau code.';
      } else if (result.reason === 'not_found') {
        errorMessage = 'Code non trouvé. Veuillez demander un nouveau code.';
      } else if (result.reason === 'invalid') {
        errorMessage = `Code incorrect. ${result.attemptsLeft !== undefined ? `${result.attemptsLeft} tentative(s) restante(s).` : ''}`;
      }
      
      return NextResponse.json(
        {
          error: errorMessage,
          reason: result.reason,
          attemptsLeft: result.attemptsLeft,
          ttlMs: emailVerificationConfig.ttlMs,
        },
        { status },
      );
    }

    // At this point, email is verified. Return verification token and email
    return NextResponse.json({ 
      verified: true,
      email: normalized,
      message: 'Email vérifié avec succès'
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/auth/verify-code');
  }
}


