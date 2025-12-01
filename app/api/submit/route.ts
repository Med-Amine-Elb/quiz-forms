import { NextRequest, NextResponse } from 'next/server';

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
    const powerAutomateUrl = process.env.POWER_AUTOMATE_SUBMIT_URL;

    if (!powerAutomateUrl) {
      return NextResponse.json(
        { error: 'Power Automate URL not configured. Please set POWER_AUTOMATE_SUBMIT_URL in .env.local' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { nom, prenom, userId, answers } = body;

    // Validate required fields
    if (!nom || !prenom) {
      return NextResponse.json(
        { error: 'Missing required fields: nom and prenom are required' },
        { status: 400 }
      );
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty answers array' },
        { status: 400 }
      );
    }

    // Generate userId if not provided
    const finalUserId = userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare data for Power Automate
    const payload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      userId: finalUserId,
      createdOn: new Date().toISOString(),
      answers: answers.map((answer: any) => ({
        questionId: answer.questionId,
        reponse: String(answer.answer), // Convert to string for Dataverse
      })),
    };

    // Call Power Automate flow
    const response = await fetch(powerAutomateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    return NextResponse.json(
      { 
        success: true, 
        message: 'Data submitted successfully',
        userId: finalUserId,
        ...data 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


