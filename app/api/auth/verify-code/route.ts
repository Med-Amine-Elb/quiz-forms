import { NextRequest, NextResponse } from 'next/server';
import {
  emailVerificationConfig,
  normalizeEmail,
  verifyCode as verifyCodeForEmail,
} from '@/lib/emailVerification';

export async function POST(request: NextRequest) {
  try {
    // Safely parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[verify-code] JSON parse error:', parseError);
      }
      
      return NextResponse.json(
        { 
          error: 'Format de requête invalide',
          message: 'Vérifiez que email et code sont bien envoyés au format JSON'
        },
        { status: 400 }
      );
    }

    const { email, code } = body || {};
    
    if (!email || typeof email !== 'string' || !code || typeof code !== 'string') {
      return NextResponse.json(
        { 
          error: 'Email et code requis',
          message: 'Veuillez fournir un email et un code valides'
        },
        { status: 400 }
      );
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { 
          error: 'Format de code invalide',
          message: 'Le code doit contenir exactement 6 chiffres'
        },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verify-code] Email normalisé:', normalized);
    }
    
    const result = verifyCodeForEmail(normalized, code);

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
    console.error('verify-code error:', error);
    console.error('verify-code error stack:', error?.stack);
    
    // Return more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}


