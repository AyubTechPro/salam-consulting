import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Matcher ignores public files automatically since Next 13.
  matcher: ['/', '/(tg|ru|en)/:path*']
};
