import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import {LEGAL, LEGAL_DRAFT} from '@/lib/site-config';
import LegalShell, {Pending} from '@/components/pages/LegalShell';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'legal.imprint.meta'});
  return buildMetadata({
    locale,
    href: '/impressum',
    title: t('title'),
    description: t('description'),
    index: !LEGAL_DRAFT,
  });
}

export default async function ImprintPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'legal.imprint'});

  return (
    <LegalShell title={t('title')} intro={t('intro')}>
      <section>
        <h2>{t('providerTitle')}</h2>
        <p>
          <Pending value={LEGAL.operator} />
          <br />
          <Pending value={LEGAL.street} />
          <br />
          <Pending value={LEGAL.postalCity} />
          <br />
          {LEGAL.country}
        </p>
      </section>

      <section>
        <h2>{t('contactTitle')}</h2>
        <p>
          {t('email')}: {LEGAL.email ? <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> : <Pending value="" />}
          <br />
          {t('phone')}: <Pending value={LEGAL.phone} />
        </p>
      </section>

      <section>
        <h2>{t('vatTitle')}</h2>
        <p>
          <Pending value={LEGAL.vatId} />
        </p>
      </section>

      <section>
        <h2>{t('responsibleTitle')}</h2>
        <p>
          <Pending value={LEGAL.operator} />
        </p>
      </section>

      <section>
        <h2>{t('techTitle')}</h2>
        <p>{t('techText')}</p>
      </section>

      <section>
        <h2>{t('noticeTitle')}</h2>
        <p>{t('noticeText')}</p>
      </section>
    </LegalShell>
  );
}
