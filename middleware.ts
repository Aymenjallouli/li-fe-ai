import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

/**
 * `api` is excluded so route handlers are not treated as pages — otherwise
 * next-intl would redirect the form's POST to a locale-prefixed path and the
 * handler would never see the body. Paths with a dot (og.png, icon.svg,
 * sitemap.xml) are excluded by the last clause.
 */
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
