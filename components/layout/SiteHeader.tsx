'use client';

import {useEffect, useLayoutEffect, useState} from 'react';
import {useLocale} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import type {AppPath} from '@/i18n/routing';

/* The six pages of the design's menu, in its order and with its labels. */
const ITEMS: Array<{href: AppPath; de: string; en: string}> = [
  {href: '/', de: 'Home', en: 'Home'},
  {href: '/lisa', de: 'Lisa & Felix', en: 'Lisa & Felix'},
  {href: '/methode', de: 'So funktioniert’s', en: 'How it works'},
  {href: '/themen', de: 'Themen', en: 'Topics'},
  {href: '/preise', de: 'Preise', en: 'Pricing'},
  {href: '/fragen', de: 'FAQ', en: 'FAQ'},
];

const GOLD_BTN = 'linear-gradient(180deg,#f8d98a,#dba036)';

/**
 * The header from the design (Header.dc.html), with its inline styles kept
 * as they were. The design switched between the desktop and the mobile bar
 * in script at 1120px; here both are rendered and CSS shows the right one
 * (.dc-desk / .dc-mob in globals.css), so the server and the browser agree.
 */
export default function SiteHeader() {
  const locale = useLocale();
  const pathname = usePathname();
  const en = locale === 'en';
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  /* A language switch re-renders <html> and drops the --z scale factor set in
     the layout's head script; put it back before the browser paints. */
  useLayoutEffect(() => {
    (window as unknown as {__dcScale?: () => void}).__dcScale?.();
  });

  const langs = (pad: string) => (
    <div style={{display: 'flex', flex: 'none', border: '1px solid rgba(233,181,74,.55)', borderRadius: 10, overflow: 'hidden'}}>
      {(['de', 'en'] as const).map(l => (
        <Link
          key={l}
          href={pathname as never}
          locale={l}
          hrefLang={l}
          style={{
            padding: pad,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            background: l === locale ? '#e9b54a' : 'transparent',
            color: l === locale ? '#1a1206' : '#f4efe6',
          }}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  const cta = en ? 'Start for free' : 'Jetzt kostenlos starten';

  return (
    <header
      className="dc dc-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'block',
        background: 'rgba(8,6,3,.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(233,181,74,.18)',
        fontFamily: "'Quicksand',sans-serif",
        color: '#f4efe6',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '10px 24px',
          minHeight: 68,
        }}
      >
        <Link
          href="/"
          aria-label="li-fe.ai"
          style={{
            position: 'relative',
            display: 'inline-block',
            flex: 'none',
            font: "italic 800 30px/1 'Montserrat',sans-serif",
            color: '#fff',
            letterSpacing: -1,
            padding: '9px 4px 0 10px',
            textDecoration: 'none',
          }}
        >
          <svg
            viewBox="0 0 120 20"
            preserveAspectRatio="none"
            style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 14}}
            fill="none"
            stroke="#e9b54a"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M3 18C20 2 80 0 117 8" />
          </svg>
          li-fe<span style={{color: '#f0c060'}}>.ai</span>
        </Link>

        <div className="dc-desk" style={{alignItems: 'center', gap: 20, flex: 1, justifyContent: 'flex-end'}}>
          <nav style={{display: 'flex', alignItems: 'center', gap: 28, marginRight: 'auto', marginLeft: 'auto'}}>
            {ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hv-2"
                  aria-current={active ? 'page' : undefined}
                  style={{
                    color: active ? '#ffffff' : '#f4efe6',
                    padding: '6px 0',
                    borderBottom: `2px solid ${active ? '#e9b54a' : 'transparent'}`,
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {en ? item.en : item.de}
                </Link>
              );
            })}
          </nav>
          {langs('8px 11px')}
          <a
            href={`/${locale}/lisa#wahl`}
            className="hv-1"
            style={{
              flex: 'none',
              background: GOLD_BTN,
              color: '#1a1206',
              fontWeight: 700,
              fontSize: 15,
              padding: '11px 22px',
              borderRadius: 12,
              boxShadow: '0 0 18px rgba(233,181,74,.35)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {cta}
          </a>
        </div>

        <div className="dc-mob" style={{alignItems: 'center', gap: 12}}>
          {langs('13px 12px')}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={open}
            style={{
              width: 46,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid rgba(233,181,74,.5)',
              borderRadius: 12,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0c060" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="dc-mob-menu"
          style={{display: 'flex', flexDirection: 'column', padding: '4px 24px 20px', borderTop: '1px solid rgba(233,181,74,.18)'}}
        >
          {ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: pathname === item.href ? '#ffffff' : '#f4efe6',
                padding: '14px 0',
                borderBottom: '1px solid rgba(233,181,74,.14)',
                fontSize: 18,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {en ? item.en : item.de}
            </Link>
          ))}
          <a
            href={`/${locale}/lisa#wahl`}
            style={{
              marginTop: 18,
              textAlign: 'center',
              background: GOLD_BTN,
              color: '#1a1206',
              fontWeight: 700,
              fontSize: 17,
              padding: '14px 22px',
              borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            {cta}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
