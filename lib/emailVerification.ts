import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

type Entry = {
  codeHash: string;
  expiresAt: number;
  attempts: number;
};

// In-memory cache for fast access (fallback)
const store = new Map<string, Entry>();

// File-based persistent cache (fallback)
const CACHE_FILE = path.join(process.cwd(), '.next', 'verification-codes.json');

const ALLOWED_DOMAIN = 'castel-afrique.com';
const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

// Redis key prefix for verification codes
const REDIS_KEY_PREFIX = 'quiz-forms:verification:';

/**
 * Initialize Upstash Redis client if credentials are available
 */
let redisClient: Redis | null = null;
let useUpstash = false;

try {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    redisClient = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
    useUpstash = true;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[emailVerification] Using Upstash Redis for verification codes storage');
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[emailVerification] Upstash not configured, using file-based storage (dev mode)');
    }
  }
} catch (error) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[emailVerification] Failed to initialize Upstash Redis, falling back to file storage:', error);
  }
  useUpstash = false;
}

// Load cache from file on startup (only for file-based fallback)
function loadCacheFromFile() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      const entries = JSON.parse(data);
      const now = Date.now();
      
      // Only load non-expired entries
      for (const [email, entry] of Object.entries(entries)) {
        const entryData = entry as Entry;
        if (entryData.expiresAt > now) {
          store.set(email, entryData);
        }
      }
      
      // Clean up expired entries from file
      saveCacheToFile();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[emailVerification] Loaded', store.size, 'codes from cache file');
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[emailVerification] Error loading cache:', error);
    }
  }
}

// Save cache to file (only for file-based fallback)
function saveCacheToFile() {
  try {
    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Convert Map to object and save
    const entries: Record<string, Entry> = {};
    const now = Date.now();
    
    for (const [email, entry] of store.entries()) {
      // Only save non-expired entries
      if (entry.expiresAt > now) {
        entries[email] = entry;
      }
    }
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[emailVerification] Error saving cache:', error);
    }
  }
}

// Clean up expired entries periodically (only for file-based fallback)
function cleanupExpiredEntries() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [email, entry] of store.entries()) {
    if (entry.expiresAt <= now) {
      store.delete(email);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    saveCacheToFile();
    if (process.env.NODE_ENV !== 'production') {
      console.log('[emailVerification] Cleaned up', cleaned, 'expired entries');
    }
  }
}

// Load cache on module initialization (only for file-based fallback, only in Node.js environment)
if (!useUpstash && typeof window === 'undefined' && typeof process !== 'undefined') {
  loadCacheFromFile();
}

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

/**
 * Save verification code using Upstash Redis or file fallback
 */
export async function saveCode(email: string, code: string): Promise<void> {
  const now = Date.now();
  const entry: Entry = {
    codeHash: hashCode(code),
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
  };

  if (useUpstash && redisClient) {
    try {
      const key = `${REDIS_KEY_PREFIX}${email}`;
      // Store entry in Redis with TTL (expires automatically)
      // Upstash Redis automatically serializes objects, so we can pass the object directly
      await redisClient.set(key, entry, { ex: Math.ceil(CODE_TTL_MS / 1000) });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[saveCode] Code saved to Upstash Redis for:', email.substring(0, 3) + '***' + email.substring(email.indexOf('@')));
      }
    } catch (error) {
      // Fallback to file storage if Redis fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[saveCode] Upstash Redis failed, falling back to file storage:', error);
      }
      store.set(email, entry);
      if (typeof window === 'undefined' && typeof process !== 'undefined') {
        saveCacheToFile();
      }
    }
  } else {
    // File-based storage (fallback)
    store.set(email, entry);
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      saveCacheToFile();
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[saveCode] Code saved to file for:', email.substring(0, 3) + '***' + email.substring(email.indexOf('@')));
    }
  }
  
  // Debug logging (only in development - never log codes or emails in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[saveCode] Code hash:', entry.codeHash.substring(0, 8) + '...');
    console.log('[saveCode] Expires at:', new Date(entry.expiresAt).toISOString());
  }
}

/**
 * Verify code using Upstash Redis or file fallback
 */
export async function verifyCode(email: string, code: string): Promise<{ ok: boolean; reason?: 'not_found' | 'expired' | 'attempts_exceeded' | 'invalid'; attemptsLeft?: number }> {
  let entry: Entry | null = null;

  if (useUpstash && redisClient) {
    try {
      const key = `${REDIS_KEY_PREFIX}${email}`;
      const entryData = await redisClient.get<Entry>(key);
      
      if (entryData) {
        // Upstash Redis automatically deserializes JSON, so entryData is already an object
        entry = entryData as Entry;
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[verifyCode] Email searched in Upstash:', email.substring(0, 3) + '***' + email.substring(email.indexOf('@')));
        console.log('[verifyCode] Entry found:', !!entry);
      }
    } catch (error) {
      // Fallback to file storage if Redis fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[verifyCode] Upstash Redis failed, falling back to file storage:', error);
      }
      
      // Try to load from file
      if (typeof window === 'undefined' && typeof process !== 'undefined') {
        loadCacheFromFile();
        cleanupExpiredEntries();
      }
      entry = store.get(email) || null;
    }
  } else {
    // File-based storage (fallback)
    // Reload from file in case it was updated by another process or server restart
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      loadCacheFromFile();
      // Clean up expired entries before verification
      cleanupExpiredEntries();
    }
    
    entry = store.get(email) || null;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Email searched in file:', email.substring(0, 3) + '***' + email.substring(email.indexOf('@')));
      console.log('[verifyCode] Store size:', store.size);
    }
  }

  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] No entry found for this email');
    } else {
      console.log('[verifyCode] Code verification failed: not_found');
    }
    return { ok: false, reason: 'not_found' };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[verifyCode] Entry found:', {
      codeHash: entry.codeHash.substring(0, 8) + '...',
      expiresAt: new Date(entry.expiresAt).toISOString(),
      attempts: entry.attempts,
    });
  }

  const now = Date.now();
  if (entry.expiresAt < now) {
    // Delete expired entry
    if (useUpstash && redisClient) {
      try {
        const key = `${REDIS_KEY_PREFIX}${email}`;
        await redisClient.del(key);
      } catch (error) {
        // Ignore error, entry will expire automatically
      }
    } else {
      store.delete(email);
      if (typeof window === 'undefined' && typeof process !== 'undefined') {
        saveCacheToFile();
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Code expired');
    }
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    // Delete entry after max attempts
    if (useUpstash && redisClient) {
      try {
        const key = `${REDIS_KEY_PREFIX}${email}`;
        await redisClient.del(key);
      } catch (error) {
        // Ignore error
      }
    } else {
      store.delete(email);
      if (typeof window === 'undefined' && typeof process !== 'undefined') {
        saveCacheToFile();
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Too many attempts');
    }
    return { ok: false, reason: 'attempts_exceeded' };
  }

  const codeHash = hashCode(code);
  const isMatch = entry.codeHash === codeHash;
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('[verifyCode] Hash provided:', codeHash.substring(0, 8) + '...');
    console.log('[verifyCode] Hash expected:', entry.codeHash.substring(0, 8) + '...');
    console.log('[verifyCode] Match:', isMatch);
  }
  
  entry.attempts += 1;

  if (!isMatch) {
    // Update attempts in storage
    if (useUpstash && redisClient) {
      try {
        const key = `${REDIS_KEY_PREFIX}${email}`;
        const ttl = Math.ceil((entry.expiresAt - now) / 1000);
        // Upstash Redis automatically serializes objects
        await redisClient.set(key, entry, { ex: ttl });
      } catch (error) {
        // Fallback to file if Redis fails
        store.set(email, entry);
        if (typeof window === 'undefined' && typeof process !== 'undefined') {
          saveCacheToFile();
        }
      }
    } else {
      store.set(email, entry);
      if (typeof window === 'undefined' && typeof process !== 'undefined') {
        saveCacheToFile();
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[verifyCode] Code does not match, attempts remaining:', MAX_ATTEMPTS - entry.attempts);
    }
    return { ok: false, reason: 'invalid', attemptsLeft: MAX_ATTEMPTS - entry.attempts };
  }

  // Code is valid - delete entry
  if (useUpstash && redisClient) {
    try {
      const key = `${REDIS_KEY_PREFIX}${email}`;
      await redisClient.del(key);
    } catch (error) {
      // Ignore error
    }
  } else {
    store.delete(email);
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      saveCacheToFile();
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('[verifyCode] Code valid!');
  }
  return { ok: true };
}

export function clearCode(email: string) {
  if (useUpstash && redisClient) {
    const key = `${REDIS_KEY_PREFIX}${email}`;
    redisClient.del(key).catch(() => {
      // Ignore error, fallback to file
      store.delete(email);
    });
  } else {
    store.delete(email);
  }
}

export const emailVerificationConfig = {
  allowedDomain: ALLOWED_DOMAIN,
  ttlMs: CODE_TTL_MS,
  maxAttempts: MAX_ATTEMPTS,
};
