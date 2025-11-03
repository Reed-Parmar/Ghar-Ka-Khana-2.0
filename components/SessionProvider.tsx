'use client';

import { ReactNode } from 'react';
import SessionProvider from '@/lib/authClient';

interface SessionProviderProps {
  children: ReactNode;
}

// Lightweight wrapper that delegates to the local auth shim. Keep this file so
// layout imports remain unchanged while NextAuth is removed.
export default function LocalSessionProvider({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}