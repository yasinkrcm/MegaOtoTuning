// This file is no longer needed - authentication is handled by AuthContext
// Kept for backwards compatibility

export const authOptions = {
  providers: [],
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
};
