import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/auth/error',
  ];

  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth',
    '/api/health',
    '/api/meals',
    '/api/chefs',
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) ||
    publicApiRoutes.some(route => nextUrl.pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for session
  const sessionToken = req.cookies.get('next-auth.session-token') || 
                      req.cookies.get('__Secure-next-auth.session-token');

  // If no session token and trying to access protected route
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};