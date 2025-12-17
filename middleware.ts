import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS Middleware
 * 
 * Protects API endpoints by only allowing requests from authorized origins.
 * 
 * Configuration:
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins (env variable)
 * - In development: Allows localhost automatically
 * - In production: Only allows configured origins
 */

/**
 * Get allowed origins from environment or use defaults
 */
function getAllowedOrigins(): string[] {
  // Get from environment variable (comma-separated)
  const envOrigins = process.env.ALLOWED_ORIGINS;
  
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim());
  }
  
  // Default: Allow localhost in development
  if (process.env.NODE_ENV === 'development') {
    return [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ];
  }
  
  // Production: No defaults, must be configured
  return [];
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {
    // Same-origin requests (no origin header) - always allow
    return true;
  }
  
  // In development, also allow localhost variations
  if (process.env.NODE_ENV === 'development') {
    const localhostPatterns = [
      'http://localhost',
      'http://127.0.0.1',
      'http://0.0.0.0',
    ];
    const isLocalhost = localhostPatterns.some(pattern => origin.startsWith(pattern));
    if (isLocalhost) {
      return true;
    }
  }
  
  return allowedOrigins.includes(origin);
}

/**
 * Get CORS headers for allowed origin
 */
function getCorsHeaders(origin: string | null, allowedOrigins: string[]): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
  
  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  return headers;
}

export function middleware(request: NextRequest) {
  // Only apply to API routes
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // In development, allow auth routes without strict CORS check
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/api/auth/')) {
    const origin = request.headers.get('origin');
    const response = NextResponse.next();
    
    // Add permissive CORS headers for development
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  }

  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get('origin');
  const method = request.method;

  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    const headers = getCorsHeaders(origin, allowedOrigins);
    
    // If origin is not allowed, return 403
    if (origin && !isOriginAllowed(origin, allowedOrigins)) {
      return new NextResponse(null, {
        status: 403,
        statusText: 'Forbidden - Origin not allowed',
        headers: {
          ...headers,
        },
      });
    }
    
    return new NextResponse(null, {
      status: 200,
      headers,
    });
  }

  // Handle actual requests (GET, POST, etc.)
  if (origin && !isOriginAllowed(origin, allowedOrigins)) {
    // Origin is present but not allowed
    return new NextResponse(
      JSON.stringify({
        error: 'Forbidden',
        message: 'Origin not allowed',
        details: 'Cette origine n\'est pas autorisée à accéder à cette API',
      }),
      {
        status: 403,
        statusText: 'Forbidden - Origin not allowed',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Origin is allowed or same-origin request
  // Create response and add CORS headers
  const response = NextResponse.next();
  
  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    const corsHeaders = getCorsHeaders(origin, allowedOrigins);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};

