import {defineRouting} from 'next-intl/routing';

/**
 * German is the default: the offer, its pricing and its legal framework are
 * German. English is the second language.
 *
 * Every locale is served under its own prefix (/de, /en), and every German
 * route carries a German slug. The bare domain redirects by browser language,
 * falling back to German.
 */
export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  /* No locale cookie: the language is always in the URL, so nothing has to be
     remembered — and the site can truthfully say it sets no cookies at all. */
  localeCookie: false,
  pathnames: {
    '/': '/',
    '/lisa': '/lisa',
    '/methode': {de: '/methode', en: '/method'},
    '/themen': {de: '/themen', en: '/topics'},
    '/preise': {de: '/preise', en: '/pricing'},
    '/fragen': {de: '/fragen', en: '/faq'},
    '/vormerken': {de: '/vormerken', en: '/register'},
    '/impressum': {de: '/impressum', en: '/legal-notice'},
    '/datenschutz': {de: '/datenschutz', en: '/privacy'},
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPath = keyof typeof routing.pathnames;
