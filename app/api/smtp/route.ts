import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '@/lib/mailer';
import { createErrorResponse, createEmailErrorResponse } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    // Parse request body with proper error handling
    let body: { email?: string; subject?: string; text?: string };
    try {
      body = await request.json();
    } catch (error) {
      return createErrorResponse(
        error,
        400,
        { code: 'INVALID_JSON', context: 'POST /api/smtp', customMessage: 'Format JSON invalide' }
      );
    }

    const { email, subject, text } = body;

    if (!email) {
      return createErrorResponse(
        new Error('Recipient email is required'),
        400,
        { code: 'MISSING_EMAIL', context: 'POST /api/smtp' }
      );
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Enquête Satisfaction <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject || 'Code de vérification',
      text: text || 'Votre code est : 123456',
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return createEmailErrorResponse(error, 'POST /api/smtp');
  }
}