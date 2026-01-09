import { NextRequest, NextResponse } from 'next/server';
import { getConfirmationEmailTemplate } from '@/lib/emailTemplates';

/**
 * Test route to preview the confirmation email template
 * GET /api/test-email?nom=Doe&prenom=John
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nom = searchParams.get('nom') || 'Doe';
  const prenom = searchParams.get('prenom') || 'John';
  
  // Get base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' :
                  'https://your-domain.com';
  
  const { html } = getConfirmationEmailTemplate(nom, prenom, baseUrl);
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

