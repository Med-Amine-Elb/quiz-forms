import nodemailer from 'nodemailer';
import { getVerificationEmailTemplate, getConfirmationEmailTemplate } from './emailTemplates';

// Shared transporter for all email sends - optimized for speed
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER?.trim(),
    // Remove all spaces from app password (Gmail app passwords sometimes have spaces for readability)
    pass: process.env.SMTP_PASS?.replace(/\s+/g, '').trim(),
  },
  // Optimize connection timeouts for faster response
  connectionTimeout: 5000, // 5 seconds max to establish connection
  greetingTimeout: 3000, // 3 seconds max for greeting
  socketTimeout: 10000, // 10 seconds max for socket operations
  // Use connection pooling for better performance
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
});

export async function sendVerificationEmail(to: string, code: string) {
  // Validate SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration manquante. Vérifiez SMTP_USER et SMTP_PASS dans .env.local');
  }

  // Use SMTP_FROM if configured, otherwise fallback to SMTP_USER
  const from = process.env.SMTP_FROM?.trim() || `Enquête Satisfaction <${process.env.SMTP_USER}>`;
  const subject = 'Votre code de vérification - Enquête Castel Afrique';
  
  // Debug: Log the from address being used
  if (process.env.NODE_ENV !== 'production') {
    console.log('[sendVerificationEmail] Using FROM address:', from);
  }
  
  // Get base URL for logo - same logic as confirmation email
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:3000';
    } else {
      baseUrl = 'https://your-domain.com';
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('[sendVerificationEmail] Using baseUrl for logo:', baseUrl);
  }
  
  // Get HTML and text templates with baseUrl for logo
  const { html, text } = getVerificationEmailTemplate(code, baseUrl);

  try {
    await transporter.sendMail({
      from, // This should be "Quiz Forms <no-reply@enquetteonline.com>"
      to,
      subject,
      text, // Plain text fallback for email clients that don't support HTML
      html, // HTML version with beautiful design
    });
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error(
        'Erreur d\'authentification Gmail. Vérifiez que:\n' +
        '1. Le mot de passe d\'application est correct (sans espaces)\n' +
        '2. L\'authentification à deux facteurs est activée\n' +
        '3. Un mot de passe d\'application a été généré dans votre compte Google'
      );
    }
    throw error;
  }
}

export async function sendConfirmationEmail(to: string, nom: string, prenom: string) {
  // Validate SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration manquante. Vérifiez SMTP_USER et SMTP_PASS dans .env.local');
  }

  // Use SMTP_FROM if configured, otherwise fallback to SMTP_USER
  const from = process.env.SMTP_FROM?.trim() || `Enquête Satisfaction <${process.env.SMTP_USER}>`;
  const subject = 'Confirmation de soumission - Enquête Castel Afrique';
  
  // Debug: Log the from address being used
  if (process.env.NODE_ENV !== 'production') {
    console.log('[sendConfirmationEmail] Using FROM address:', from);
  }
  
  // Get base URL for logo - prioritize NEXT_PUBLIC_BASE_URL, then VERCEL_URL, then localhost for dev
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NODE_ENV === 'development') {
      // For local development, use localhost
      baseUrl = 'http://localhost:3000';
    } else {
      // Fallback - user should set NEXT_PUBLIC_BASE_URL in production
      baseUrl = 'https://your-domain.com';
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('[sendConfirmationEmail] Using baseUrl for logo:', baseUrl);
  }
  
  // Get HTML and text templates
  const { html, text } = getConfirmationEmailTemplate(nom, prenom, baseUrl);

  try {
    await transporter.sendMail({
      from, // This should be "Quiz Forms <no-reply@enquetteonline.com>"
      to,
      subject,
      text, // Plain text fallback for email clients that don't support HTML
      html, // HTML version with beautiful design
    });
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error(
        'Erreur d\'authentification Gmail. Vérifiez que:\n' +
        '1. Le mot de passe d\'application est correct (sans espaces)\n' +
        '2. L\'authentification à deux facteurs est activée\n' +
        '3. Un mot de passe d\'application a été généré dans votre compte Google'
      );
    }
    throw error;
  }
}

