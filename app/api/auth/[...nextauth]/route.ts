import { handlers } from '@/lib/auth';

// Force Node.js runtime for NextAuth to avoid Edge Runtime issues
export const runtime = 'nodejs';

const { GET, POST } = handlers;

export { GET, POST };