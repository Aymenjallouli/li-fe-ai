import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {LEGAL_DRAFT, SITE_URL} from '@/lib/site-config';
import type {Href} from '@/lib/seo';

type Route = {
  href: Href;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

/* The legal pages are noindex while they are drafts, so they stay out of the
   sitemap until LEGAL_DRAFT is switched off. */
const ROUTES: Route[] = [
  {href: '/', changeFrequency: 'weekly', priority: 1},
  {href: '/lisa', changeFrequency: 'monthly', priority: 0.9},
  {href: '/methode', changeFrequency: 'monthly', priority: 0.9},
  {href: '/themen', changeFrequency: 'monthly', priority: 0.8},
  {href: '/preise', changeFrequency: 'monthly', priority: 0.9},
  {href: '/fragen', changeFrequency: 'monthly', priority: 0.7},
  {href: '/vormerken', changeFrequency: 'yearly', priority: 0.8},
  ...(LEGAL_DRAFT
    ? []
    : ([
        {href: '/impressum', changeFrequency: 'yearly', priority: 0.3},
        {href: '/datenschutz', changeFrequency: 'yearly', priority: 0.3},
      ] satisfies Route[])),
];

const url = (locale: (typeof routing.locales)[number], href: Href) =>
  `${SITE_URL}${getPathname({locale, href}).replace(/\/$/, '')}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const {href, changeFrequency, priority} of ROUTES) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) languages[locale] = url(locale, href);
    languages['x-default'] = href === '/' ? `${SITE_URL}/` : url(routing.defaultLocale, href);

    for (const locale of routing.locales) {
      entries.push({url: url(locale, href), lastModified: now, changeFrequency, priority, alternates: {languages}});
    }
  }

  return entries;
}
