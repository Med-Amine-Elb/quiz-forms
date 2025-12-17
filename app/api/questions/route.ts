import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitConfigs } from '@/lib/ratelimit';

/**
 * API Route: GET /api/questions
 * 
 * This route calls your Power Automate flow to get questions from Dataverse.
 * 
 * Expected Power Automate Response:
 * {
 *   "questions": [
 *     {
 *       "id": "6cb1ff92-5606-434f-aa6a-ac7180f6e3a4",
 *       "titre": "Âge",
 *       "ordre": 1,
 *       "type": "numérique"
 *     },
 *     ...
 *   ]
 * }
 */

export async function GET(request: NextRequest) {
  try {
    // Rate limiting - Prevent excessive requests
    const ip = rateLimit.getIP(request);
    const { success, remaining, resetTime } = rateLimit.check(ip, rateLimitConfigs.questions);
    
    if (!success) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { 
          error: 'Trop de requêtes. Veuillez patienter.',
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

    const powerAutomateUrl = process.env.POWER_AUTOMATE_QUESTIONS_URL;
    const apiKey = process.env.POWER_AUTOMATE_API_KEY;

    if (!powerAutomateUrl) {
      return NextResponse.json(
        { error: 'Power Automate URL not configured. Please set POWER_AUTOMATE_QUESTIONS_URL in .env.local' },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set POWER_AUTOMATE_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Call Power Automate flow with API key for authentication
    const response = await fetch(powerAutomateUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // Send API key in header
      },
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
    
    // Extract questions array from Power Automate response
    const questions = data.questions || data.value || data;

    // Transform Dataverse questions to match the app's format
    // Handle both correct format and malformed format from Power Automate
    const transformedQuestions = Array.isArray(questions) ? questions.map((q: any, index: number) => {
      // Check if the response has proper keys (id, titre, ordre, type)
      if (q.id && q.titre && q.ordre && q.type) {
        // Correct format
        return {
          id: index + 1,
          dataverseId: q.id,
          type: q.type === 'numérique' ? 'rating' : 'text',
          question: q.titre,
          ordre: q.ordre,
          required: true,
        };
      } else {
        // Malformed format - keys are the values themselves
        // Extract the actual values from the object
        const keys = Object.keys(q);
        const values = Object.values(q);
        
        // Find the GUID (id) - it's a long string with dashes
        const guidKey = keys.find(k => k.includes('-') && k.length > 30);
        const dataverseId = guidKey || '';
        
        // Find the type - it's either "numérique" or "texte"
        const typeKey = keys.find(k => k === 'numérique' || k === 'texte');
        const questionType = typeKey || 'texte';
        
        // Find the ordre (number)
        const ordreKey = keys.find(k => !isNaN(Number(k)) && Number(k) > 0 && Number(k) < 100);
        const ordre = ordreKey ? Number(ordreKey) : index + 1;
        
        // Find the titre (text that's not type or ordre)
        const titreKey = keys.find(k => 
          k !== guidKey && 
          k !== typeKey && 
          k !== ordreKey && 
          isNaN(Number(k))
        );
        const titre = titreKey || 'Question';
        
        return {
          id: index + 1,
          dataverseId: dataverseId,
          type: questionType === 'numérique' ? 'rating' : 'text',
          question: titre,
          ordre: ordre,
          required: true,
        };
      }
    }) : [];

    return NextResponse.json({ 
      questions: transformedQuestions,
      success: true 
    }, { 
      status: 200,
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


