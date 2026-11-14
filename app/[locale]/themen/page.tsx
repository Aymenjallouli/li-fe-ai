import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Reveal from '@/components/Reveal';
import {Closing, PageTop} from '@/components/ui/Blocks';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.topics.meta'});
  return buildMetadata({locale, href: '/themen', title: t('title'), description: t('description')});
}

type Topic = {title: string; start: string; ask: string; step: string};

export default async function TopicsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'pages.topics'});
  const topics = t.raw('items') as Topic[];

  return (
    <>
      <PageTop kicker={t('kicker')} title={t('title')} lead={t('lead')} sun="c" />

      {/* Seven topics as a short exchange each: what someone says, what Lisa asks. */}
      <section className="sec t-white">
        <div className="wrap">
          <ul className="talks">
            {topics.map((topic, i) => (
              <Reveal as="li" key={topic.title} className="talk" delay={(i % 3) * 50}>
                <h2>{topic.title}</h2>
                <div className="talk-lines">
                  <p className="talk-you">
                    <q>{topic.start}</q>
                  </p>
                  <p className="talk-lisa">
                    <q>{topic.ask}</q>
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="note">{t('note')}</p>
        </div>
      </section>

      <Closing />
    </>
  );
}
