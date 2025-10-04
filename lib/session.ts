import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/login');
  }
  
  return session;
}

export async function getOptionalAuth() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}