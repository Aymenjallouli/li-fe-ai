import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import {EMERGENCY} from '@/lib/site-config';
import Reveal from '@/components/Reveal';
import Stop from '@/components/Stop';
import {Closing, PageTop, Rows} from '@/components/ui/Blocks';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.safety.meta'});
  return buildMetadata({locale, href: '/sicherheit', title: t('title'), description: t('description')});
}

export default async function SafetyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.safety'});
  const is = t.raw('is') as string[];
  const isNot = t.raw('isNot') as string[];

  return (
    <>
      <PageTop kicker={t('kicker')} title={t('title')} lead={t('lead')} sun="a" />

      {/* Two plain lists, set large: what Lisa is for, and what she is not. */}
      <section className="sec t-white">
        <div className="wrap pair">
          <Reveal className="pair-col pair-col--yes">
            <h2 className="kicker">{t('isTitle')}</h2>
            <ul>
              {is.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="pair-col pair-col--no" delay={80}>
            <h2 className="kicker">{t('isNotTitle')}</h2>
            <ul>
              {isNot.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* The emergency numbers. They come from lib/site-config.ts. */}
      <section className="sec t-navy sos">
        <div className="wrap sos-in">
          <Reveal>
            <h2 className="h2">
              <Stop>{t('crisisTitle')}</Stop>
            </h2>
            <p className="lead">{t('crisisText')}</p>
          </Reveal>
          <Reveal as="div" className="sos-nums" delay={80}>
            <p>
              <span>{t('emergency')}</span>
              <a href={`tel:${EMERGENCY.general.tel}`}>{EMERGENCY.general.display}</a>
            </p>
            <p>
              <span>
                {t('counselling')} · {t('counsellingNote')}
              </span>
              <a href={`tel:${EMERGENCY.counselling[0].tel}`}>{EMERGENCY.counselling[0].display}</a>
              <a href={`tel:${EMERGENCY.counselling[1].tel}`} className="sos-alt">
                {EMERGENCY.counselling[1].display}
              </a>
              <a href={`tel:${EMERGENCY.counselling[2].tel}`} className="sos-alt">
                {EMERGENCY.counselling[2].display}
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec t-white">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="h2">
              <Stop>{t('dataTitle')}</Stop>
            </h2>
          </Reveal>
          <Rows items={t.raw('data') as Array<{title: string; text: string}>} />
        </div>
      </section>

      <Closing />
    </>
  );
}
