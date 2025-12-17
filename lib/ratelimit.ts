/**
 * Rate Limiting Implementation
 * 
 * Protects API endpoints from abuse by limiting requests per IP address.
 * 
 * Options:
 * 1. In-Memory (Simple, no dependencies) - Current implementation
 * 2. Redis/Upstash (Production-ready, distributed)
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (for single-instance deployments)
// For production with multiple instances, use Redis/Upstash
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

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
 * Check if a request should be rate limited
 * 
 * @param identifier - IP address or user identifier
 * @param config - Rate limit configuration
 * @returns Object with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = rateLimitConfigs.default
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or expired - create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
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
 * const ip = getClientIP(request);
 * const { success, remaining, resetTime } = checkRateLimit(ip, rateLimitConfigs.submit);
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

