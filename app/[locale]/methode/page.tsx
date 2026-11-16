import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import DesignPage, {designTitle} from '@/components/DesignPage';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.home.meta'});
  return buildMetadata({
    locale,
    href: '/methode',
    title: designTitle(locale, 'method'),
    description: t('description'),
    absoluteTitle: true,
  });
}

/** Rendered exactly as designed — see components/DesignPage.tsx. */
export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <DesignPage locale={locale} page="method" />;
}
