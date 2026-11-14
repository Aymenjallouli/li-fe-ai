import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Reveal from '@/components/Reveal';
import Stop from '@/components/Stop';
import Cta from '@/components/Cta';
import {Closing, Rows} from '@/components/ui/Blocks';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.lisa.meta'});
  return buildMetadata({locale, href: '/lisa', title: t('title'), description: t('description')});
}

export default async function LisaPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.lisa'});
  const home = await getTranslations({locale, namespace: 'pages.home.hero'});

  return (
    <>
      {/* Lisa herself, large, with her first sentence. */}
      <section className="meet t-sky">
        <div className="wrap meet-in">
          <div className="meet-copy">
            <p className="kicker">{t('kicker')}</p>
            <h1 className="h1">
              <Stop>{t('title')}</Stop>
            </h1>
            <p className="lead">{t('lead')}</p>
            <Cta />
          </div>
          <figure className="meet-figure">
            <span className="sun" aria-hidden="true" />
            <div className="meet-face">
              <video src="/lisa.mp4" poster="/lisa.jpg" autoPlay muted loop playsInline preload="metadata" aria-label={home('alt')} />
            </div>
            <figcaption>
              <q>{t('opening')}</q>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="sec t-white">
        <div className="wrap">
          <Rows items={t.raw('traits') as Array<{title: string; text: string}>} />
          <p className="note">{t('note')}</p>
        </div>
      </section>

      <section className="sec t-navy statement">
        <div className="wrap">
          <Reveal>
            <h2 className="h1">
              <Stop>{t('accessTitle')}</Stop>
            </h2>
            <p className="lead">{t('accessText')}</p>
          </Reveal>
        </div>
      </section>

      <Closing />
    </>
  );
}
