import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { email, subject, text } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Enquête Satisfaction <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject || 'Code de vérification',
      text: text || 'Votre code est : 123456',
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('SMTP send error', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}