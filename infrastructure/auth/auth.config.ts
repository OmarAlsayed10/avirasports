import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { prisma } from '@/infrastructure/db/prisma';
import { loginSchema } from '@/modules/auth/auth.validators';
import { rateLimit, getClientIp } from '@/infrastructure/rate-limit/limiter';
import { encryptedPrismaAdapter } from './prisma-adapter-encrypted';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: encryptedPrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        const ip = getClientIp(req as Request);
        const rl = rateLimit(`signin:${ip}`, 5, 15 * 60 * 1000);
        if (!rl.allowed) return null;

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === 'google' && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });
        if (dbUser?.role === 'ADMIN') return false;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.sub = user.id;
        token.role = dbUser?.role ?? 'USER';
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.sub!;
      session.user.role = (token.role as string) ?? 'USER';
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
