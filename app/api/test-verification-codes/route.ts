import { NextRequest, NextResponse } from 'next/server';
import { saveCode, verifyCode, generateCode, normalizeEmail } from '@/lib/emailVerification';
import { Redis } from '@upstash/redis';

/**
 * API Route: GET /api/test-verification-codes
 * 
 * Test endpoint to verify verification codes storage with Upstash Redis
 * 
 * Usage:
 * - Call this endpoint to test saving and verifying codes
 * - Checks if Upstash is configured and working
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
        const testKey = 'test:verification:connection';
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
    
    // Test saving and verifying a code
    const testEmail = normalizeEmail('test@castel-afrique.com');
    const testCode = generateCode(6);
    
    let saveTest = null;
    let verifyTest = null;
    
    try {
      // Save code
      await saveCode(testEmail, testCode);
      saveTest = {
        success: true,
        message: 'Code saved successfully',
        email: testEmail.substring(0, 3) + '***' + testEmail.substring(testEmail.indexOf('@')),
      };
      
      // Verify code
      const verifyResult = await verifyCode(testEmail, testCode);
      verifyTest = {
        success: verifyResult.ok,
        message: verifyResult.ok ? 'Code verified successfully' : `Verification failed: ${verifyResult.reason}`,
        result: verifyResult,
      };
      
      // Try to verify again (should fail - code already used)
      const verifyResult2 = await verifyCode(testEmail, testCode);
      const secondVerifyTest = {
        success: !verifyResult2.ok,
        message: verifyResult2.ok ? 'ERROR: Code should not be valid after first use' : 'Correctly rejected reused code',
        result: verifyResult2,
      };
      
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        upstash: {
          status: upstashStatus,
          configured: !!(upstashUrl && upstashToken),
          url: upstashUrl ? `${upstashUrl.substring(0, 20)}...` : null,
          test: upstashTest,
        },
        verificationCodes: {
          save: saveTest,
          verify: verifyTest,
          secondVerify: secondVerifyTest,
        },
        message: upstashStatus === 'connected' 
          ? '✅ Verification codes storage is working with Upstash Redis!'
          : upstashStatus === 'configured'
          ? '⚠️ Upstash configured but connection failed. Using file fallback.'
          : 'ℹ️ Upstash not configured. Using file-based storage (dev mode).',
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: 'Test failed',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
        upstash: {
          status: upstashStatus,
          configured: !!(upstashUrl && upstashToken),
          test: upstashTest,
        },
      }, { status: 500 });
    }
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

