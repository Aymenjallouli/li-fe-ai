import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata, faqJsonLd} from '@/lib/seo';
import {Closing, FaqList, PageTop} from '@/components/ui/Blocks';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.faq.meta'});
  return buildMetadata({locale, href: '/fragen', title: t('title'), description: t('description')});
}

export default async function FaqPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.faq'});
  const items = t.raw('items') as Array<{q: string; a: string}>;

  return (
    <>
      {/* The answers are on the page; this declares the same content as data. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd(items))}} />
      <PageTop kicker={t('kicker')} title={t('title')} sun="c" />
      <section className="sec t-white">
        <div className="wrap">
          <FaqList items={items} />
        </div>
      </section>
      <Closing />
    </>
  );
}
