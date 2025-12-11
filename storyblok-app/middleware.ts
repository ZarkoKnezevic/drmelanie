import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add pathname to cookie for Server Components (more reliable than headers in Next.js 16)
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Set pathname in cookie - expires in 1 hour, httpOnly for security
  response.cookies.set('x-pathname', pathname, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600, // 1 hour
  });

  // Also set in headers as fallback
  response.headers.set('x-pathname', pathname);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Setting pathname: ${pathname} for URL: ${request.url}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

