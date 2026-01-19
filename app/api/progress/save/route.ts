import { NextRequest, NextResponse } from 'next/server';
import { progressTracker } from '@/lib/progressTracker';
import { createErrorResponse, handleApiError } from '@/lib/errorHandler';
import { z } from 'zod';

/**
 * API Route: POST /api/progress/save
 * 
 * Saves survey progress for an email address.
 * Allows users to continue their survey on different devices.
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "answers": [
 *     { "questionId": 1, "answer": "Yes" },
 *     { "questionId": 2, "answer": "No" }
 *   ],
 *   "currentIndex": 5,
 *   "isCompleted": false
 * }
 */
const saveProgressSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  answers: z.array(z.object({
    questionId: z.number().int().positive(),
    answer: z.union([z.string(), z.number(), z.array(z.string())]),
  })),
  currentIndex: z.number().int().min(0),
  isCompleted: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return createErrorResponse(
        new Error('Invalid JSON format'),
        400,
        { code: 'INVALID_JSON', context: 'POST /api/progress/save', customMessage: 'Format JSON invalide' }
      );
    }

    // Validate request data
    const validation = saveProgressSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: 'Les données fournies sont invalides',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, answers, currentIndex, isCompleted } = validation.data;

    // Save progress (now async - uses Redis)
    await progressTracker.save(email, answers, currentIndex, isCompleted);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[progress/save] Progress saved for: ${email}, index: ${currentIndex}, answers: ${answers.length}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Progression sauvegardée',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/progress/save');
  }
}

