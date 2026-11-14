import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import {CONTACT_EMAIL} from '@/lib/site-config';
import Stop from '@/components/Stop';
import InterestForm from '@/components/InterestForm';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.register.meta'});
  return buildMetadata({locale, href: '/vormerken', title: t('title'), description: t('description')});
}

export default async function RegisterPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.register'});
  const points = t.raw('points') as string[];

  return (
    <section className="reg t-sky">
      <span className="sun" aria-hidden="true" />
      <div className="wrap reg-in">
        <div className="reg-copy">
          <p className="kicker">{t('kicker')}</p>
          <h1 className="h1">
            <Stop>{t('title')}</Stop>
          </h1>
          <p className="lead">{t('lead')}</p>
          <ul className="stage-notes">
            {points.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="reg-form">
          <InterestForm contactEmail={CONTACT_EMAIL} />
        </div>
      </div>
    </section>
  );
}
