"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Backend-auth client for the frontend: stores JWT in localStorage and
// fetches the profile from /api/user/profile using Bearer token.

export type User = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
};

type SessionState = { user: User } | null;

type SessionContextValue = {
  data: SessionState;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const TOKEN_KEY = 'ghk_token';
const SESSION_KEY = 'ghk_session';
const AUTH_EVENT = 'ghk-auth-changed';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token: string | null, user: User | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
  else localStorage.removeItem(SESSION_KEY);

  try {
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch (e) {
    // ignore
  }
}

async function fetchProfile(token: string) {
  const res = await fetch('/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SessionState>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setData(null);
      setStatus('unauthenticated');
      return;
    }
    setStatus('loading');
    try {
      const profile = await fetchProfile(token);
      const user = profile?.user ?? profile; // accept either {user: {...}} or direct user
      setData({ user });
      // Cache for quick warm start
      try { localStorage.setItem(SESSION_KEY, JSON.stringify({ user })); } catch {}
      setStatus('authenticated');
    } catch (e) {
      setData(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    // Try cached user first for instant UI, then verify by fetching profile.
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user) {
          setData({ user: parsed.user });
          setStatus('authenticated');
        }
      }
    } catch {}

    load();

    const onAuth = () => load();
    if (typeof window !== 'undefined') {
      window.addEventListener(AUTH_EVENT, onAuth);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(AUTH_EVENT, onAuth);
      }
    };
  }, [load]);

  const value: SessionContextValue = { data, status, refresh: load };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) return { data: null, status: 'unauthenticated', refresh: async () => {} } as SessionContextValue;
  return ctx;
}

type SignInOptions = {
  email: string;
  password: string;
  redirect?: boolean;
};

type SignInResult = { error?: string; user?: User; token?: string };

export async function signIn(_provider: string | undefined, opts?: SignInOptions): Promise<SignInResult> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: opts?.email, password: opts?.password }),
    });
    if (!res.ok) {
      return { error: 'Invalid email or password' };
    }
    const data = await res.json();
    const token: string | undefined = data?.token;
    const user: User | undefined = data?.user;
    if (!token || !user) {
      return { error: 'Malformed login response' };
    }
    setSession(token, user);
    return { user, token };
  } catch (e) {
    return { error: 'Unable to reach server' };
  }
}

export async function signOut(opts?: { callbackUrl?: string }) {
  const token = getToken();
  try {
    // Best-effort logout — avoid triggering any browser BasicAuth prompts by
    // not calling a protected endpoint that may send a WWW-Authenticate header.
    // If you later add a backend logout, ensure it is permitAll.
  } catch {}
  setSession(null, null);
  if (opts?.callbackUrl && typeof window !== 'undefined') {
    window.location.href = opts.callbackUrl;
  }
}

export function getAuthToken() {
  return getToken();
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

export default SessionProvider;
