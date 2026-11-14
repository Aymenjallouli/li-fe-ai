import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

/** One file per namespace under messages/<locale>/. All page copy is in `pages`. */
const NAMESPACES = ['common', 'pages', 'legal'] as const;

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages: Record<string, unknown> = {};
  for (const ns of NAMESPACES) {
    messages[ns] = (await import(`../messages/${locale}/${ns}.json`)).default;
  }

  /* Without an explicit zone next-intl falls back to the server's own, which
     on most hosts is UTC. The project is based in Germany. */
  return {locale, messages, timeZone: 'Europe/Berlin'};
});
