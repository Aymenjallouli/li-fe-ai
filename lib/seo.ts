import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {SITE_URL} from '@/lib/site-config';

export type Href = Parameters<typeof getPathname>[0]['href'];

export function brandName(locale: string) {
  return locale === 'en' ? 'li-fe.ai' : 'li-fe.ai';
}

/** `getPathname` returns "/de" for the home route and "/de/impressum" below it. */
function absolute(locale: Locale, href: Href) {
  return `${SITE_URL}${getPathname({locale, href}).replace(/\/$/, '')}`;
}

/**
 * Page metadata with canonical and hreflang emitted together. Next merges
 * `alternates` as one unit, so a page that sets only `canonical` would wipe
 * the language map inherited from the layout.
 */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  absoluteTitle = false,
  index = true,
}: {
  locale: string;
  href: Href;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  index?: boolean;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const alt of routing.locales) languages[alt] = absolute(alt, href);
  /* The bare domain is the language selector (it redirects by browser
     language), which is what x-default is for. */
  languages['x-default'] = href === '/' ? `${SITE_URL}/` : absolute(routing.defaultLocale, href);

  const canonical = absolute(locale as Locale, href);
  const brand = brandName(locale);

  return {
    title: absoluteTitle ? {absolute: title} : title,
    description,
    alternates: {canonical, languages},
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: brand,
      title,
      description,
      locale: locale === 'en' ? 'en_GB' : 'de_DE',
      alternateLocale: locale === 'en' ? ['de_DE'] : ['en_GB'],
      images: [{url: '/og.png', width: 1200, height: 630, alt: brand}],
    },
    twitter: {card: 'summary_large_image', title, description, images: ['/og.png']},
    ...(index ? {} : {robots: {index: false, follow: true}}),
  };
}

/** FAQ answers are rendered on the page, so they can also be declared as data. */
export function faqJsonLd(items: Array<{q: string; a: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({q, a}) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {'@type': 'Answer', text: a},
    })),
  };
}
