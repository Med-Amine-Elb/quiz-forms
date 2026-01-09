/**
 * Rate Limiting Implementation
 * 
 * Protects API endpoints from abuse by limiting requests per IP address.
 * 
 * Uses Upstash Redis for distributed rate limiting in production.
 * Falls back to in-memory store if Upstash is not configured (development).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

// In-memory store (fallback for development when Upstash is not configured)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const inMemoryStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes (only for in-memory fallback)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of inMemoryStore.entries()) {
      if (entry.resetTime < now) {
        inMemoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

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
      console.log('[ratelimit] Using Upstash Redis for distributed rate limiting');
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[ratelimit] Upstash not configured, using in-memory rate limiting (dev mode)');
    }
  }
} catch (error) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[ratelimit] Failed to initialize Upstash Redis, falling back to in-memory:', error);
  }
  useUpstash = false;
}

/**
 * Rate limit configuration per endpoint
 */
export const rateLimitConfigs = {
  // Submit endpoint - stricter limits (prevent spam submissions)
  submit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 submissions per minute
  },
  // Questions endpoint - more lenient (users might refresh)
  questions: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  // Default for other endpoints
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 requests per minute
  },
} as const;

/**
 * Create Upstash Ratelimit instance for a specific configuration
 */
function createUpstashRatelimit(config: RateLimitConfig): Ratelimit | null {
  if (!redisClient) {
    return null;
  }

  // Convert windowMs to seconds for Upstash
  const windowSeconds = Math.ceil(config.windowMs / 1000);

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${windowSeconds} s`),
    analytics: true,
    prefix: '@quiz-forms/ratelimit',
  });
}

/**
 * Check rate limit using Upstash Redis
 */
async function checkRateLimitUpstash(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const ratelimit = createUpstashRatelimit(config);
  
  if (!ratelimit) {
    // Fallback to in-memory if Upstash is not available
    return checkRateLimitInMemory(identifier, config);
  }

  try {
    const result = await ratelimit.limit(identifier);
    const now = Date.now();
    const windowMs = config.windowMs;
    
    // Calculate reset time (approximate, as Upstash uses sliding window)
    const resetTime = now + windowMs;

    return {
      success: result.success,
      remaining: result.remaining,
      resetTime: resetTime,
    };
  } catch (error) {
    // If Upstash fails, fallback to in-memory
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ratelimit] Upstash error, falling back to in-memory:', error);
    }
    return checkRateLimitInMemory(identifier, config);
  }
}

/**
 * Check rate limit using in-memory store (fallback)
 */
function checkRateLimitInMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = inMemoryStore.get(identifier);

  // No entry or expired - create new entry
  if (!entry || entry.resetTime < now) {
    inMemoryStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Entry exists and is valid
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - IP address or user identifier
 * @param config - Rate limit configuration
 * @returns Object with success status and remaining requests
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = rateLimitConfigs.default
): Promise<RateLimitResult> {
  if (useUpstash && redisClient) {
    return checkRateLimitUpstash(identifier, config);
  } else {
    return checkRateLimitInMemory(identifier, config);
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (for development)
  return '127.0.0.1';
}

/**
 * Rate limit middleware helper
 * 
 * Usage in API routes:
 * ```typescript
 * const ip = rateLimit.getIP(request);
 * const { success, remaining, resetTime } = await rateLimit.check(ip, rateLimitConfigs.submit);
 * 
 * if (!success) {
 *   return NextResponse.json(
 *     { error: 'Too many requests. Please try again later.' },
 *     { 
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Remaining': '0',
 *         'X-RateLimit-Reset': resetTime.toString(),
 *         'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
 *       }
 *     }
 *   );
 * }
 * ```
 */
export const rateLimit = {
  check: checkRateLimit,
  getIP: getClientIP,
  configs: rateLimitConfigs,
};
