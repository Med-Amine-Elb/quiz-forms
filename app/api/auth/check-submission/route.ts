import { NextRequest, NextResponse } from 'next/server';
import { submissionTracker } from '@/lib/submissionTracker';
import { createErrorResponse, handleApiError } from '@/lib/errorHandler';

/**
 * API Route: GET /api/auth/check-submission?email=xxx
 * 
 * Checks if an email has already submitted the survey.
 * Used to prevent access if already submitted and to allow resume if in progress.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email || typeof email !== 'string') {
      return createErrorResponse(
        new Error('Email is required'),
        400,
        { code: 'MISSING_EMAIL', context: 'GET /api/auth/check-submission', customMessage: 'Email requis' }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if this email has already submitted
    const submissionCheck = submissionTracker.checkByEmail(normalizedEmail);

    return NextResponse.json({
      email: normalizedEmail,
      hasSubmitted: submissionCheck.hasSubmitted,
      submittedAt: submissionCheck.submittedAt || null,
      message: submissionCheck.hasSubmitted 
        ? 'Cette adresse email a déjà soumis le formulaire.'
        : 'L\'adresse email peut accéder au formulaire.',
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/auth/check-submission');
  }
}

