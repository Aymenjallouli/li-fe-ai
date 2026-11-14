import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Reveal from '@/components/Reveal';
import Stop from '@/components/Stop';
import Cta from '@/components/Cta';
import {Closing, PageTop, Rows} from '@/components/ui/Blocks';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.about.meta'});
  return buildMetadata({locale, href: '/ueber-uns', title: t('title'), description: t('description')});
}

/* The concept paper puts the project in "concept development and preparation
   for initial testing" — the first three of the six stages. */
const STAGES_UNDER_WAY = 3;

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.about'});
  const road = t.raw('road') as string[];

  return (
    <>
      <PageTop kicker={t('kicker')} title={t('title')} lead={t('lead')} sun="b" />

      <section className="sec t-white">
        <div className="wrap">
          <Rows items={t.raw('parties') as Array<{title: string; text: string; meta: string}>} />
        </div>
      </section>

      {/* The pilot, as one figure. */}
      <section className="sec t-navy pilot">
        <div className="wrap">
          <Reveal>
            <p className="pilot-fig">{t('pilotFigure')}</p>
            <h2 className="h2">{t('pilotTitle')}</h2>
            <p className="lead">{t('pilotText')}</p>
            <Cta label={t('pilotCta')} />
          </Reveal>
        </div>
      </section>

      {/* Six stages in one line; the ones under way are lit. */}
      <section className="sec t-white">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="h2">
              <Stop>{t('roadTitle')}</Stop>
            </h2>
            <p className="hint">{t('roadStatus')}</p>
          </Reveal>
          <ol className="road">
            {road.map((stage, i) => (
              <li key={stage} className={i < STAGES_UNDER_WAY ? 'is-now' : undefined}>
                {stage}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec t-sky trust">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">
              <Stop>{t('partnersTitle')}</Stop>
            </h2>
            <p className="lead">{t('partnersText')}</p>
            <p className="trust-links">
              <Cta variant="dark" label={t('partnersCta')} role="partner" />
            </p>
          </Reveal>
        </div>
      </section>

      <Closing />
    </>
  );
}
