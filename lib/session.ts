import { redirect } from 'next/navigation';

// Server-side session helpers are disabled now that auth is handled fully by the backend
// and client. For server routes that must be protected, implement backend session (cookies)
// or move checks client-side.

export async function requireAuth() {
  // Without a server-readable session, redirect to login for protected pages.
  redirect('/login');
}

export async function getOptionalAuth() {
  // No server session available; return null.
  return null;
}