import type {Metadata, Viewport} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Analytics} from '@vercel/analytics/next';
import {routing} from '@/i18n/routing';
import {SITE_URL} from '@/lib/site-config';
import {brandName} from '@/lib/seo';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';
import '@fontsource/montserrat/700-italic.css';
import '@fontsource/montserrat/800-italic.css';
import '@fontsource/allison/400.css';
import '../globals.css';
import '../design-hover.css';

/* Typefaces: Quicksand, Montserrat italic and Allison, the three the design
   uses. They are bundled with the site (@fontsource), so no request leaves it. */

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.home.meta'});
  const brand = brandName(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {default: t('title'), template: `%s | ${brand}`},
    description: t('description'),
    applicationName: brand,
    formatDetection: {email: false, address: false, telephone: false},
    robots: {index: true, follow: true},
  };
}

export const viewport: Viewport = {
  themeColor: '#070604',
  colorScheme: 'light',
};

/* Scroll reveals start hidden and are shown by a small client component.
   Without JavaScript nothing would show them, so this undoes the hidden
   state — as plain CSS, which cannot be lost on a client-side navigation the
   way a class written onto <html> by a script can. */
const NOSCRIPT_CSS =
  '.rv{opacity:1!important;transform:none!important}';

/* Sets --z, the factor by which the design scales on screens wider than the
   1280px it was drawn at (see `.dc` in globals.css). It runs before first
   paint, so the page never jumps, and again whenever the window is resized.
   Switching language re-renders <html> and drops the value, so SiteHeader
   calls window.__dcScale() again after every navigation. */
const SCALE_BOOTSTRAP =
  `(function(){var d=document.documentElement;function s(){d.style.setProperty('--z',Math.min(1.5,Math.max(1,d.clientWidth/1280)).toFixed(4))}` +
  `s();addEventListener('resize',s);window.__dcScale=s})();`;

function websiteJsonLd(locale: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: brandName(locale),
    description,
    inLanguage: locale === 'en' ? 'en-GB' : 'de-DE',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const all = (await getMessages()) as Record<string, unknown>;
  const t = await getTranslations({locale, namespace: 'common'});
  const meta = await getTranslations({locale, namespace: 'pages.home.meta'});

  return (
    /* The font variable classes go on <html>: globals.css reads them in :root,
       and a var() inside a custom property resolves on the element that
       declares it. */
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: SCALE_BOOTSTRAP}} />
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
      </head>
      <body>
        {/* Only what the client components read: the header, the buttons and
            the interest form all live in `common`. */}
        <NextIntlClientProvider locale={locale} messages={{common: all.common} as never}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(websiteJsonLd(locale, meta('description')))}}
          />
          <a className="skip" href="#main">
            {t('skip')}
          </a>
          <SiteHeader />
          <div id="main">{children}</div>
          <SiteFooter />
          {/* Vercel Web Analytics: cookieless, aggregated page views. It only
              reports from a Vercel deployment; locally it does nothing. */}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
