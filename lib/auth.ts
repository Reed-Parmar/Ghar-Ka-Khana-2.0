// NextAuth has been removed. This file remains to satisfy any legacy imports
// but exports no-op stubs to avoid pulling next-auth into the bundle.

export const handlers = {} as const;
export async function auth() {
  return null;
}
export async function signIn() {
  return { error: 'next-auth-removed' } as const;
}
export async function signOut() {
  return undefined;
}