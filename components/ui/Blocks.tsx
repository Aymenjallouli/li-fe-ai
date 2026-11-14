import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {AppPath} from '@/i18n/routing';
import {APP_URL} from '@/lib/site-config';
import Reveal from '@/components/Reveal';
import Stop from '@/components/Stop';
import Cta from '@/components/Cta';

/** Text link with an arrow. */
export function More({href, children}: {href: AppPath; children: React.ReactNode}) {
  return (
    <Link href={href} className="more">
      <span>{children}</span>
      <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
        <path d="M2.5 8h10M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/**
 * The top of every subpage: sky, one very large headline, one sentence — and
 * the coral sun, placed differently on each page (`sun` picks the position).
 */
export function PageTop({
  kicker,
  title,
  lead,
  sun = 'a',
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  sun?: 'a' | 'b' | 'c' | 'd';
  children?: React.ReactNode;
}) {
  return (
    <section className={`top t-sky top--${sun}`}>
      <span className="sun" aria-hidden="true" />
      <div className="wrap top-in">
        <p className="kicker">{kicker}</p>
        <h1 className="h1">
          <Stop>{title}</Stop>
        </h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

/**
 * Large typographic rows: a word or name on the left, one sentence on the
 * right. The site's replacement for cards.
 */
export function Rows({items}: {items: Array<{title: string; text: string; meta?: string}>}) {
  return (
    <ul className="rows">
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} className="row" delay={i * 50}>
          <h3>
            {item.meta ? <small>{item.meta}</small> : null}
            <Stop>{item.title}</Stop>
          </h3>
          <p>{item.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/** The closing moment of every page: the whole band is the coral sun. */
export function Closing() {
  const t = useTranslations('common.band');
  const live = Boolean(APP_URL);
  return (
    <section className="closing t-coral">
      <div className="wrap closing-in">
        <h2 className="h1">
          <Stop>{live ? t('liveTitle') : t('title')}</Stop>
        </h2>
        <p className="lead">{live ? t('liveLead') : t('lead')}</p>
        <Cta variant="dark" />
      </div>
    </section>
  );
}

/** Questions and answers on native <details>: works without JavaScript. */
export function FaqList({items}: {items: Array<{q: string; a: string}>}) {
  return (
    <div className="faq">
      {items.map(item => (
        <details key={item.q}>
          <summary>
            <span>{item.q}</span>
            <i aria-hidden="true" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export type PriceRow = {name: string; what: string; price: string; per: string};

/** Prices as a plain, very large table — no cards, no badges. */
export function PriceTable({rows}: {rows: PriceRow[]}) {
  return (
    <ul className="ptable">
      {rows.map((row, i) => (
        <Reveal as="li" key={row.name} className="prow" delay={i * 50}>
          <h3>{row.name}</h3>
          <p>{row.what}</p>
          <p className="prow-price">
            <span>{row.price}</span>
            <small>{row.per}</small>
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
