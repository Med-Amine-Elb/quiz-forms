import crypto from 'crypto';

type Entry = {
  codeHash: string;
  expiresAt: number;
  attempts: number;
};

const store = new Map<string, Entry>();

const ALLOWED_DOMAIN = 'castel-afrique.com';
const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAllowedDomain(email: string) {
  const domain = email.split('@')[1] || '';
  return domain === ALLOWED_DOMAIN;
}

export function generateCode(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
}

export function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export function saveCode(email: string, code: string) {
  const now = Date.now();
  const entry = {
    codeHash: hashCode(code),
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
  };
  store.set(email, entry);
  // Debug logging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[saveCode] Email:', email);
    console.log('[saveCode] Code hash:', entry.codeHash);
    console.log('[saveCode] Expires at:', new Date(entry.expiresAt).toISOString());
  }
}

export function verifyCode(email: string, code: string) {
  // Debug logging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[verifyCode] Email recherché:', email);
    console.log('[verifyCode] Store size:', store.size);
  }
  
  const entry = store.get(email);
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Aucune entrée trouvée pour cet email');
    }
    return { ok: false, reason: 'not_found' as const };
  }

  const now = Date.now();
  if (entry.expiresAt < now) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Code expiré');
    }
    store.delete(email);
    return { ok: false, reason: 'expired' as const };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Trop de tentatives');
    }
    store.delete(email);
    return { ok: false, reason: 'attempts_exceeded' as const };
  }

  const codeHash = hashCode(code);
  const isMatch = entry.codeHash === codeHash;
  
  entry.attempts += 1;

  if (!isMatch) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Code ne correspond pas, tentatives restantes:', MAX_ATTEMPTS - entry.attempts);
    }
    store.set(email, entry);
    return { ok: false, reason: 'invalid' as const, attemptsLeft: MAX_ATTEMPTS - entry.attempts };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[verifyCode] Code valide!');
  }
  store.delete(email);
  return { ok: true };
}

export function clearCode(email: string) {
  store.delete(email);
}

export const emailVerificationConfig = {
  allowedDomain: ALLOWED_DOMAIN,
  ttlMs: CODE_TTL_MS,
  maxAttempts: MAX_ATTEMPTS,
};

