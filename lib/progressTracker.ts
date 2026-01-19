/**
 * Survey Progress Tracker
 * 
 * Saves and restores survey progress based on email address.
 * Allows users to continue their survey on different devices/browsers.
 * 
 * Uses Upstash Redis for persistent storage (production-ready).
 * Falls back to in-memory store if Redis is not configured (dev mode).
 */

import { Redis } from '@upstash/redis';

interface ProgressRecord {
  email: string;
  answers: Array<{
    questionId: number;
    answer: string | number | string[];
  }>;
  currentIndex: number;
  isCompleted: boolean;
  lastUpdated: number;
  expiresAt: number;
}

// Redis key prefix for progress storage
const REDIS_KEY_PREFIX = 'quiz-forms:progress:';

// Initialize Upstash Redis client if credentials are available
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
      console.log('[progressTracker] Using Upstash Redis for progress storage');
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[progressTracker] Upstash not configured, using in-memory storage (dev mode)');
    }
  }
} catch (error) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[progressTracker] Failed to initialize Upstash Redis, falling back to in-memory storage:', error);
  }
  useUpstash = false;
}

// In-memory store (fallback for dev mode or if Redis fails)
const progressStore = new Map<string, ProgressRecord>();

// Cleanup old entries every 10 minutes (only for in-memory cache)
// Redis handles expiration automatically via TTL, so we only clean memory cache
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of progressStore.entries()) {
    if (record.expiresAt < now) {
      progressStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Configuration for progress tracking
 */
export const progressConfig = {
  // How long to keep progress (default: 30 days)
  // After submission, progress is kept for 7 days for reference
  rememberDuration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  submittedRememberDuration: 7 * 24 * 60 * 60 * 1000, // 7 days after submission
} as const;

/**
 * Normalize email address (lowercase, trim)
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Save progress for an email
 * 
 * @param email - User email address
 * @param answers - Current answers
 * @param currentIndex - Current question index
 * @param isCompleted - Whether survey is completed
 */
export async function saveProgress(
  email: string,
  answers: Array<{
    questionId: number;
    answer: string | number | string[];
  }>,
  currentIndex: number,
  isCompleted: boolean
): Promise<void> {
  const normalized = normalizeEmail(email);
  const now = Date.now();
  
  // Use shorter expiration if completed (already submitted)
  const expiresAt = isCompleted 
    ? now + progressConfig.submittedRememberDuration
    : now + progressConfig.rememberDuration;
  
  const record: ProgressRecord = {
    email: normalized,
    answers,
    currentIndex,
    isCompleted,
    lastUpdated: now,
    expiresAt,
  };

  // Try to save to Redis first
  if (useUpstash && redisClient) {
    try {
      const key = `${REDIS_KEY_PREFIX}${normalized}`;
      const ttlSeconds = Math.ceil((expiresAt - now) / 1000);
      
      // Upstash Redis automatically serializes objects
      await redisClient.set(key, record, { ex: ttlSeconds });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('[saveProgress] Progress saved to Upstash Redis for:', normalized.substring(0, 3) + '***');
      }
      
      // Also save to in-memory cache for fast access
      progressStore.set(normalized, record);
      return;
    } catch (error) {
      // Fallback to in-memory if Redis fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[saveProgress] Upstash Redis failed, falling back to in-memory storage:', error);
      }
    }
  }
  
  // Fallback to in-memory storage
  progressStore.set(normalized, record);
}

/**
 * Load progress for an email
 * 
 * @param email - User email address
 * @returns Progress record or null if not found/expired
 */
export async function loadProgress(
  email: string
): Promise<{
  answers: Array<{
    questionId: number;
    answer: string | number | string[];
  }>;
  currentIndex: number;
  isCompleted: boolean;
} | null> {
  const normalized = normalizeEmail(email);
  const now = Date.now();

  // Try to load from Redis first
  if (useUpstash && redisClient) {
    try {
      const key = `${REDIS_KEY_PREFIX}${normalized}`;
      const record = await redisClient.get<ProgressRecord>(key);
      
      if (record) {
        // Check if record has expired (double-check, Redis TTL should handle this)
        // But we check anyway in case of clock drift or manual expiration
        if (record.expiresAt < now) {
          // Expired - delete from Redis and cache
          try {
            await redisClient.del(key);
          } catch (delError) {
            // Ignore deletion errors - Redis TTL will handle it automatically
          }
          progressStore.delete(normalized);
          return null;
        }
        
        // Valid record - update in-memory cache and return
        progressStore.set(normalized, record);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('[loadProgress] Progress loaded from Upstash Redis for:', normalized.substring(0, 3) + '***');
        }
        
        return {
          answers: record.answers,
          currentIndex: record.currentIndex,
          isCompleted: record.isCompleted,
        };
      }
    } catch (error) {
      // Fallback to in-memory if Redis fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[loadProgress] Upstash Redis failed, falling back to in-memory storage:', error);
      }
    }
  }

  // Fallback to in-memory storage
  const record = progressStore.get(normalized);
  
  if (!record) {
    return null;
  }
  
  // Check if record has expired
  if (record.expiresAt < now) {
    progressStore.delete(normalized);
    
    // Also try to delete from Redis if available
    if (useUpstash && redisClient) {
      try {
        const key = `${REDIS_KEY_PREFIX}${normalized}`;
        await redisClient.del(key);
      } catch (error) {
        // Ignore Redis deletion errors
      }
    }
    
    return null;
  }
  
  return {
    answers: record.answers,
    currentIndex: record.currentIndex,
    isCompleted: record.isCompleted,
  };
}

/**
 * Clear progress for an email
 * 
 * @param email - User email address
 */
export async function clearProgress(email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  
  // Delete from in-memory cache
  progressStore.delete(normalized);
  
  // Also delete from Redis if available
  if (useUpstash && redisClient) {
    try {
      const key = `${REDIS_KEY_PREFIX}${normalized}`;
      await redisClient.del(key);
    } catch (error) {
      // Ignore Redis deletion errors
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[clearProgress] Failed to delete from Redis:', error);
      }
    }
  }
}

/**
 * Get progress statistics (for monitoring)
 */
export function getProgressStats(): {
  totalRecords: number;
  activeRecords: number;
} {
  const now = Date.now();
  let activeRecords = 0;
  
  for (const record of progressStore.values()) {
    if (record.expiresAt >= now) {
      activeRecords++;
    }
  }
  
  return {
    totalRecords: progressStore.size,
    activeRecords,
  };
}

/**
 * Progress tracker helper
 */
export const progressTracker = {
  save: saveProgress,
  load: loadProgress,
  clear: clearProgress,
  stats: getProgressStats,
  config: progressConfig,
};

