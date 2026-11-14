import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import {LEGAL, LEGAL_DRAFT} from '@/lib/site-config';
import LegalShell, {Pending} from '@/components/pages/LegalShell';

type Section = {title: string; body: string[]};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'legal.privacy.meta'});
  return buildMetadata({
    locale,
    href: '/datenschutz',
    title: t('title'),
    description: t('description'),
    index: !LEGAL_DRAFT,
  });
}

export default async function PrivacyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'legal.privacy'});
  const sections = t.raw('sections') as Section[];

  return (
    <LegalShell title={t('title')} intro={t('intro')}>
      {sections.map(section => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.body.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}

      <section>
        <h2>{t('hostingTitle')}</h2>
        <p>
          {t('hostingText')} <Pending value={LEGAL.hosting} />
        </p>
      </section>

      <p className="legal-updated">{t('updated')}</p>
    </LegalShell>
  );
}
