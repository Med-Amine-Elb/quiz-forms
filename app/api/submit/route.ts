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
    const body = await request.json();
    const { nom, prenom, answers } = body;

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

    // Prepare data for Power Automate (matching your flow's expected format)
    // Note: We're sending question text instead of Dataverse GUID since questions are hardcoded
    const payload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      answers: answers.map((answer: any) => ({
        questionId: String(answer.questionId), // Numeric ID from hardcoded questions
        questionText: answer.questionText || `Question ${answer.questionId}`, // Question text for reference
        reponse: String(answer.answer), // Convert to string for Dataverse
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

    return NextResponse.json(
      { 
        success: true, 
        message: 'Data submitted successfully to Dataverse',
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


