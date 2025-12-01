import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/questions
 * 
 * This route calls your Power Automate flow to get questions from Dataverse.
 * 
 * Power Automate Flow Setup:
 * 1. Create an "Instant cloud flow" with "When an HTTP request is received" trigger
 * 2. Add "List rows" action from Microsoft Dataverse
 * 3. Select your "question" table
 * 4. Order by "ordre" ascending
 * 5. Add "Response" action with status 200 and the questions array
 * 6. Copy the HTTP trigger URL and add it to your .env.local file as POWER_AUTOMATE_QUESTIONS_URL
 */

export async function GET(request: NextRequest) {
  try {
    const powerAutomateUrl = process.env.POWER_AUTOMATE_QUESTIONS_URL;

    if (!powerAutomateUrl) {
      return NextResponse.json(
        { error: 'Power Automate URL not configured. Please set POWER_AUTOMATE_QUESTIONS_URL in .env.local' },
        { status: 500 }
      );
    }

    // Call Power Automate flow
    const response = await fetch(powerAutomateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty body, or add any required parameters
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Power Automate error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch questions from Power Automate', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Power Automate returns the data in the response body
    // Adjust this based on your actual Power Automate response structure
    const questions = data.questions || data.value || data;

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


