import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Reveal from '@/components/Reveal';
import Stop from '@/components/Stop';
import Cta from '@/components/Cta';
import {Closing, More, PriceTable, type PriceRow} from '@/components/ui/Blocks';
import LisaStage, {type StageLine} from '@/components/home/LisaStage';
import Ask, {type AskTopic} from '@/components/home/Ask';
import Scene from '@/components/home/Scene';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.home.meta'});
  return buildMetadata({locale, href: '/', title: t('title'), description: t('description'), absoluteTitle: true});
}

/**
 * Six moments, a few words each:
 *   Lisa — try her — thirty minutes — the price — what she is not — meet her.
 */
export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.home'});
  const p = await getTranslations({locale, namespace: 'pages'});

  const claim = t.raw('hero.claim') as string[];
  const assurances = t.raw('hero.assurances') as string[];

  return (
    <>
      {/* 1 — Lisa, in the middle of the conversation. */}
      <section className="hero t-sky">
        <div className="wrap">
          <p className="kicker">{t('hero.kicker')}</p>
          <h1 className="mega">
            {claim.map(word => (
              <span key={word}>
                <Stop>{word}</Stop>{' '}
              </span>
            ))}
          </h1>

          <div className="stage">
            <div className="stage-left">
              <p className="stage-lead">{t('hero.lead')}</p>
              <div className="stage-cta">
                <Cta />
                <More href="/methode">{t('hero.secondary')}</More>
              </div>
              <ul className="stage-notes">
                {assurances.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="status">{t('hero.status')}</p>
            </div>
            <LisaStage
              lines={t.raw('hero.lines') as StageLine[]}
              labels={{alt: t('hero.alt'), listening: t('hero.listening'), says: t('hero.says')}}
            />
          </div>
        </div>
      </section>

      {/* 2 — Try her: pick a topic, Lisa answers with a question. */}
      <section className="sec t-white">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="h2">{t('ask.title')}</h2>
            <p className="hint">{t('ask.hint')}</p>
          </Reveal>
          <Ask
            topics={p.raw('topics.items') as AskTopic[]}
            labels={{reply: t('ask.replyLabel'), step: t('ask.stepLabel'), alt: t('hero.alt')}}
          />
          <p className="sec-foot">
            <More href="/themen">{t('ask.link')}</More>
          </p>
        </div>
      </section>

      {/* 3 — Thirty minutes, told by scrolling. */}
      <Scene steps={t.raw('scene.steps') as Array<{word: string; text: string}>} unit={t('scene.unit')}>
        <More href="/methode">{t('scene.link')}</More>
      </Scene>

      {/* 4 — The price, as a plain table. */}
      <section className="sec t-white">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="h2">
              <Stop>{t('prices.title')}</Stop>
            </h2>
          </Reveal>
          <PriceTable rows={p.raw('pricing.rows') as PriceRow[]} />
          <p className="sec-foot">
            <More href="/preise">{t('prices.link')}</More>
          </p>
        </div>
      </section>

      {/* 5 — What Lisa is not. */}
      <section className="sec t-sky trust">
        <div className="wrap">
          <Reveal>
            <h2 className="h2">
              <Stop>{t('trust.title')}</Stop>
            </h2>
            <p className="lead">{t('trust.text')}</p>
            <p className="trust-links">
              <More href="/sicherheit">{t('trust.safety')}</More>
              <More href="/ueber-uns">{t('trust.about')}</More>
            </p>
          </Reveal>
        </div>
      </section>

      <Closing />
    </>
  );
}
