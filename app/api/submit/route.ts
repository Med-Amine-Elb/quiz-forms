import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitConfigs } from '@/lib/ratelimit';
import { validateSubmitRequest, formatValidationErrors } from '@/lib/validation';
import { submissionTracker } from '@/lib/submissionTracker';
import { sendConfirmationEmail } from '@/lib/mailer';

/**
 * API Route: POST /api/submit
 * 
 * This route calls your Power Automate flow to save user data and answers to Dataverse.
 * 
 * Expected request body:
 * {
 *   "nom": "Doe",
 *   "prenom": "John",
 *   "userId": "123" (optional, can be generated),
 *   "answers": [
 *     { "questionId": 1, "reponse": "Yes" },
 *     { "questionId": 2, "reponse": "No" }
 *   ]
 * }
 * 
 * Power Automate Flow Setup:
 * 1. Create an "Instant cloud flow" with "When an HTTP request is received" trigger
 * 2. Define the JSON schema (see POWER_AUTOMATE_SETUP.md)
 * 3. Add "Add a new row" action for User table
 * 4. Map fields: nom, prenom, userID, createdOn
 * 5. Add "Apply to each" loop for answers array
 * 6. Inside loop: Add "Add a new row" for Answer table
 * 7. Map fields: userId (from User row), questionId, reponse, createdOn
 * 8. Add "Response" action with status 200
 * 9. Copy the HTTP trigger URL and add it to your .env.local file as POWER_AUTOMATE_SUBMIT_URL
 */

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - Prevent spam submissions
    const ip = rateLimit.getIP(request);
    const { success, remaining, resetTime } = rateLimit.check(ip, rateLimitConfigs.submit);
    
    if (!success) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { 
          error: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
          message: 'Too many requests. Please try again later.'
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toString(),
            'Retry-After': retryAfter.toString(),
          }
        }
      );
    }

    const powerAutomateUrl = process.env.POWER_AUTOMATE_SUBMIT_URL;
    const apiKey = process.env.POWER_AUTOMATE_API_KEY;

    if (!powerAutomateUrl) {
      return NextResponse.json(
        { error: 'Power Automate URL not configured. Please set POWER_AUTOMATE_SUBMIT_URL in .env.local' },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set POWER_AUTOMATE_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON format',
          message: 'Le format de la requête est invalide'
        },
        { status: 400 }
      );
    }

    // Validate request data with Zod schema
    const validation = validateSubmitRequest(body);
    
    if (!validation.success || !validation.data) {
      const errorMessages = validation.errors 
        ? formatValidationErrors(validation.errors)
        : ['Données invalides'];
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'Les données soumises sont invalides',
          details: errorMessages
        },
        { status: 400 }
      );
    }

    const { nom, prenom, email, answers } = validation.data;

    // Check for duplicate submission
    const browserFingerprint = request.headers.get('x-browser-fingerprint');
    const userIdentifier = submissionTracker.generateIdentifier(ip, browserFingerprint || undefined);
    const submissionCheck = submissionTracker.check(userIdentifier);
    
    if (submissionCheck.hasSubmitted) {
      const submittedDate = submissionCheck.submittedAt 
        ? new Date(submissionCheck.submittedAt).toLocaleString('fr-FR')
        : 'récemment';
      
      return NextResponse.json(
        { 
          error: 'Déjà soumis',
          message: 'Vous avez déjà soumis ce formulaire.',
          details: `Soumission précédente: ${submittedDate}`,
          code: 'DUPLICATE_SUBMISSION'
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Prepare data for Power Automate (matching your flow's expected format)
    // Note: Data is already validated and sanitized by Zod
    const payload = {
      nom,
      prenom,
      email,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        questionText: answer.questionText,
        reponse: answer.answer,
      })),
    };

    console.log('Submitting to Power Automate:', JSON.stringify(payload, null, 2));

    // Call Power Automate flow with API key for authentication
    const response = await fetch(powerAutomateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // Send API key in header
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Power Automate error:', errorText);
      return NextResponse.json(
        { error: 'Failed to submit data to Power Automate', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Record successful submission to prevent duplicates
    submissionTracker.record(userIdentifier, ip, browserFingerprint || undefined);

    // Send confirmation email asynchronously (don't wait for it)
    sendConfirmationEmail(email, nom, prenom).catch((error) => {
      console.error('Failed to send confirmation email:', error);
      // Email sending failed, but submission was successful
      // Don't fail the request if email fails
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Data submitted successfully to Dataverse',
        ...data 
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Error submitting data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


