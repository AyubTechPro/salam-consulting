import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Exclude API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // Check if it's an admin route (e.g. /en/admin, /tg/admin)
  // The path will look like /[locale]/admin/...
  const isAdminRoute = /\/(en|tg|ru)\/admin/.test(pathname);
  const isLoginRoute = /\/(en|tg|ru)\/admin\/login/.test(pathname);

  if (isAdminRoute && !isLoginRoute) {
    const token = req.cookies.get('admin_token')?.value;
    
    if (!token) {
      const url = req.nextUrl.clone();
      // redirect to login
      const localeMatch = pathname.match(/^\/(en|tg|ru)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'default_secret_for_development_only'
      );
      await jwtVerify(token, secret);
    } catch (err) {
      // Invalid token
      const url = req.nextUrl.clone();
      const localeMatch = pathname.match(/^\/(en|tg|ru)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
  }

  // Apply next-intl middleware for all UI routes
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(tg|ru|en)/:path*']
};
