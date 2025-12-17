import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/mailer';
import {
  emailVerificationConfig,
  generateCode,
  isAllowedDomain,
  normalizeEmail,
  saveCode,
} from '@/lib/emailVerification';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const normalized = normalizeEmail(email);
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[request-code] Email normalisé:', normalized);
    }
    
    if (!isAllowedDomain(normalized)) {
      return NextResponse.json({ 
        error: 'Domaine non autorisé',
        message: `Seuls les emails @${emailVerificationConfig.allowedDomain} sont autorisés`
      }, { status: 403 });
    }

    const code = generateCode(6);
    saveCode(normalized, code);
    
    // Send email asynchronously - don't wait for it to complete
    // This makes the API response much faster
    sendVerificationEmail(normalized, code).catch((error) => {
      console.error('Failed to send verification email:', error);
      // Email sending failed, but code is already saved
      // User can request a new code if needed
    });

    // Return immediately - email is being sent in background
    return NextResponse.json({
      message: 'Code envoyé',
      ttlMs: emailVerificationConfig.ttlMs,
      attempts: emailVerificationConfig.maxAttempts,
    });
  } catch (error) {
    console.error('request-code error', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

