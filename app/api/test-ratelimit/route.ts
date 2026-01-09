import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitConfigs } from '@/lib/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * API Route: GET /api/test-ratelimit
 * 
 * Test endpoint to verify Upstash Redis configuration and rate limiting
 * 
 * Usage:
 * - Call this endpoint multiple times to test rate limiting
 * - Check the response headers for rate limit information
 * - Check the response body for Upstash connection status
 */

export async function GET(request: NextRequest) {
  try {
    // Check if Upstash is configured
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    let upstashStatus = 'not_configured';
    let upstashTest = null;
    
    if (upstashUrl && upstashToken) {
      upstashStatus = 'configured';
      
      // Try to connect to Upstash
      try {
        const redis = new Redis({
          url: upstashUrl,
          token: upstashToken,
        });
        
        // Test connection with a simple ping
        const testKey = 'test:connection';
        await redis.set(testKey, 'test', { ex: 10 }); // Set with 10s expiry
        const value = await redis.get(testKey);
        await redis.del(testKey);
        
        if (value === 'test') {
          upstashStatus = 'connected';
          upstashTest = {
            success: true,
            message: 'Upstash Redis connection successful',
          };
        } else {
          upstashStatus = 'connection_failed';
          upstashTest = {
            success: false,
            message: 'Upstash Redis connection test failed',
          };
        }
      } catch (error: any) {
        upstashStatus = 'connection_error';
        upstashTest = {
          success: false,
          message: error?.message || 'Unknown error',
          error: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
        };
      }
    }
    
    // Test rate limiting
    const ip = rateLimit.getIP(request);
    const testConfig = {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 requests per minute for testing
    };
    
    const rateLimitResult = await rateLimit.check(ip, testConfig);
    
    // Get current timestamp
    const now = Date.now();
    const resetTime = rateLimitResult.resetTime;
    const secondsUntilReset = Math.ceil((resetTime - now) / 1000);
    
    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        upstash: {
          status: upstashStatus,
          configured: !!(upstashUrl && upstashToken),
          url: upstashUrl ? `${upstashUrl.substring(0, 20)}...` : null,
          test: upstashTest,
        },
        rateLimit: {
          ip: ip,
          success: rateLimitResult.success,
          remaining: rateLimitResult.remaining,
          resetTime: new Date(resetTime).toISOString(),
          secondsUntilReset: secondsUntilReset,
          limit: testConfig.maxRequests,
          window: `${testConfig.windowMs / 1000}s`,
        },
        message: rateLimitResult.success
          ? `Rate limit OK. ${rateLimitResult.remaining} requests remaining.`
          : `Rate limit exceeded. Try again in ${secondsUntilReset} seconds.`,
      },
      {
        status: rateLimitResult.success ? 200 : 429,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString(),
          'X-RateLimit-Limit': testConfig.maxRequests.toString(),
          'Retry-After': rateLimitResult.success ? '0' : secondsUntilReset.toString(),
          'X-Upstash-Status': upstashStatus,
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

