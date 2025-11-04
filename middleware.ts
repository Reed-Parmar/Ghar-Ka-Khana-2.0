import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/auth/error',
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for JWT token
  const token = req.cookies.get('jwt')?.value;
  
  if (!token) {
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