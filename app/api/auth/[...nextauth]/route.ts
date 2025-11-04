import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authAPI } from "@/lib/api-client";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await authAPI.login(credentials.email, credentials.password);
          
          if (response?.user) {
            return {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name,
              role: response.user.role,
            };
          }
          
          return null;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export const { auth } = handler;

export { handler as GET, handler as POST };