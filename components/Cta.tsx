import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {APP_URL, appStartUrl} from '@/lib/site-config';

function Arrow() {
  return (
    <svg className="btn-arrow" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
      <path d="M2.5 8h10M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The site's one call to action: the gold button.
 *
 * While the product does not exist yet (APP_URL empty) it leads to the
 * register page. Once NEXT_PUBLIC_APP_URL is set, the very same buttons open
 * the free introductory conversation in the app — no page has to change.
 *
 * No 'use client': next-intl's hooks work in both trees, so the header (a
 * client component) and the server-rendered pages share this file.
 */
export default function Cta({
  variant = 'primary',
  short = false,
  mic = false,
  label,
  role,
  onNavigate,
}: {
  variant?: 'primary' | 'dark' | 'outline';
  short?: boolean;
  /** Shows the microphone before the label, as on the large hero buttons. */
  mic?: boolean;
  /** Overrides the default wording. */
  label?: string;
  /** Opens the register page with the partner option pre-selected. */
  role?: 'partner';
  onNavigate?: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations('common.cta');
  const live = Boolean(APP_URL) && role !== 'partner';
  const text = label ?? (live ? t(short ? 'startShort' : 'start') : t(short ? 'interestShort' : 'interest'));
  const className = `btn btn--${variant}${mic ? ' btn--big' : ''}`;
  const inner = (
    <>
      {mic ? <MicIcon /> : null}
      <span>{text}</span>
      {short ? null : <Arrow />}
    </>
  );

  if (live) {
    return (
      <a className={className} href={appStartUrl(locale)} rel="nofollow" onClick={onNavigate}>
        {inner}
      </a>
    );
  }

  return (
    <Link
      className={className}
      href={role === 'partner' ? {pathname: '/vormerken', query: {anliegen: 'partner'}} : '/vormerken'}
      onClick={onNavigate}
    >
      {inner}
    </Link>
  );
}
