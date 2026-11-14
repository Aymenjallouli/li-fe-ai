import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Reveal from '@/components/Reveal';
import Stop from '@/components/Stop';
import {Closing, PageTop, Rows} from '@/components/ui/Blocks';
import Scene from '@/components/home/Scene';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.method.meta'});
  return buildMetadata({locale, href: '/methode', title: t('title'), description: t('description')});
}

export default async function MethodPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.method'});
  const home = await getTranslations({locale, namespace: 'pages.home.scene'});

  return (
    <>
      <PageTop kicker={t('kicker')} title={t('title')} lead={t('lead')} sun="b" />

      <Scene steps={home.raw('steps') as Array<{word: string; text: string}>} unit={home('unit')} />

      {/* The guiding question, alone on the page. */}
      <section className="sec t-sky statement">
        <div className="wrap">
          <Reveal as="figure">
            <blockquote className="h1">
              <q>{t('question')}</q>
            </blockquote>
            <figcaption className="kicker">{t('questionLabel')}</figcaption>
          </Reveal>
        </div>
      </section>

      <section className="sec t-white">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="h2">
              <Stop>{t('journeyTitle')}</Stop>
            </h2>
          </Reveal>
          <Rows items={t.raw('journey') as Array<{title: string; text: string}>} />
          <p className="note">{t('credit')}</p>
        </div>
      </section>

      <Closing />
    </>
  );
}
