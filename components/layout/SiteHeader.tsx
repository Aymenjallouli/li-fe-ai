'use client';

import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {NAV_MAIN, NAV_MORE} from '@/lib/nav';
import Logo from '@/components/Logo';
import Cta from '@/components/Cta';

export default function SiteHeader() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  const other = locale === 'de' ? 'en' : 'de';

  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Any navigation closes the menu. */
  useEffect(() => setOpen(false), [pathname]);

  /* The open menu covers the page: the page behind must not scroll, and
     Escape has to close it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`hdr${stuck ? ' is-stuck' : ''}${open ? ' is-open' : ''}`}>
      <div className="wrap hdr-in">
        <Link href="/" className="brand" aria-label={t('brand.home')}>
          <Logo prefix={t('brand.prefix')} />
        </Link>

        <nav className="nav" aria-label={t('nav.label')}>
          {NAV_MAIN.map(item => (
            <Link key={item.key} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hdr-tools">
          <Link
            href={pathname as never}
            locale={other}
            className="lang"
            aria-label={t('nav.switchLabel')}
            lang={other}
            hrefLang={other}
          >
            <span className={locale === 'de' ? 'is-on' : undefined}>DE</span>
            <span className={locale === 'en' ? 'is-on' : undefined}>EN</span>
          </Link>
          <span className="hdr-cta">
            <Cta short />
          </span>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mnav"
            aria-label={open ? t('nav.close') : t('nav.open')}
            onClick={() => setOpen(o => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mnav" id="mnav" hidden={!open}>
        <nav className="wrap mnav-in" aria-label={t('nav.label')}>
          {[...NAV_MAIN, ...NAV_MORE.filter(item => item.key !== 'register')].map(item => (
            <Link key={item.key} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="mnav-foot">
            <Cta />
            <Link href={pathname as never} locale={other} className="mnav-lang" lang={other} hrefLang={other}>
              {t('nav.switchTo')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
