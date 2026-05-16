import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PREFIXES = ['/account', '/checkout'];
const ADMIN_PREFIX = '/admin';

const SESSION_COOKIE_NAMES = [
  '__Secure-authjs.session-token',
  'authjs.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.session-token',
] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isProtectedRoute = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isAdminRoute && !isProtectedRoute) return NextResponse.next();

  const cookieName = SESSION_COOKIE_NAMES.find((name) => req.cookies.has(name));

  if (isAdminRoute) {
    const token = cookieName
      ? await getToken({ req, secret: process.env.AUTH_SECRET, cookieName })
      : null;

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isProtectedRoute) {
    if (!cookieName) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/account')) {
      const token = await getToken({ req, secret: process.env.AUTH_SECRET, cookieName });
      if (token?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/checkout', '/admin', '/admin/:path*'],
};
