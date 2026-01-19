import { NextRequest, NextResponse } from 'next/server';
import { progressTracker } from '@/lib/progressTracker';
import { createErrorResponse, handleApiError } from '@/lib/errorHandler';

/**
 * API Route: GET /api/progress/load?email=xxx
 * 
 * Loads survey progress for an email address.
 * Returns null if no progress found or expired.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email || typeof email !== 'string') {
      return createErrorResponse(
        new Error('Email is required'),
        400,
        { code: 'MISSING_EMAIL', context: 'GET /api/progress/load', customMessage: 'Email requis' }
      );
    }

    // Load progress (now async - uses Redis)
    const progress = await progressTracker.load(email);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[progress/load] Progress loaded for: ${email}, found: ${progress !== null}`);
    }

    if (!progress) {
      return NextResponse.json({
        success: true,
        progress: null,
        message: 'Aucune progression trouvée',
      });
    }

    return NextResponse.json({
      success: true,
      progress,
      message: 'Progression restaurée',
    });
  } catch (error: any) {
    return handleApiError(error, 'GET /api/progress/load');
  }
}

