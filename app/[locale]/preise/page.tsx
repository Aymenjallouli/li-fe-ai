import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import {Closing, PageTop, PriceTable, type PriceRow} from '@/components/ui/Blocks';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.pricing.meta'});
  return buildMetadata({locale, href: '/preise', title: t('title'), description: t('description')});
}

export default async function PricingPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.pricing'});
  const fine = t.raw('fine') as string[];

  return (
    <>
      <PageTop kicker={t('kicker')} title={t('title')} lead={t('lead')} sun="d" />

      <section className="sec t-white">
        <div className="wrap">
          <PriceTable rows={t.raw('rows') as PriceRow[]} />
          <p className="included">{t('included')}</p>
          <ul className="fine">
            {fine.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <Closing />
    </>
  );
}
