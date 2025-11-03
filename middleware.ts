import { NextRequest, NextResponse } from 'next/server';

// No-op middleware: we removed NextAuth. Let the backend handle auth.
// If you need route protection, implement it client-side or switch to
// HttpOnly cookie auth and validate here.
export async function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};