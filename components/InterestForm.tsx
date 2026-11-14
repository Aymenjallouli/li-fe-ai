'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

type Status = 'idle' | 'sending' | 'done' | 'error';
type ErrorKey = 'name' | 'email' | 'consent' | 'message' | 'rate' | 'send';

/**
 * The interest form: name, email, private or partner, an optional message.
 *
 * Posts JSON to /api/interest, which sends the mail server-side. The server
 * answers with the name of the field it rejected, so the message can point at
 * the problem rather than only report that there was one.
 *
 */
export default function InterestForm({contactEmail}: {contactEmail: string}) {
  const locale = useLocale();
  const t = useTranslations('common.form');
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<ErrorKey | null>(null);
  const [role, setRole] = useState<'private' | 'partner'>('private');

  /* Links from the partner page arrive as /vormerken?anliegen=partner. Read
     here rather than on the server, so the page itself stays static. */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('anliegen') === 'partner') setRole('partner');
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      role,
      pilot: data.get('pilot') === 'on',
      message: String(data.get('message') ?? ''),
      consent: data.get('consent') === 'on',
      website: String(data.get('website') ?? ''),
      locale,
    };

    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as {ok?: boolean; error?: string} | null;
      if (res.ok && body?.ok) {
        setStatus('done');
        return;
      }
      const key = body?.error;
      setError(key === 'name' || key === 'email' || key === 'consent' || key === 'message' || key === 'rate' ? key : 'send');
      setStatus('error');
    } catch {
      setError('send');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="form-done" role="status">
        <h3>{t('successTitle')}</h3>
        <p>{t('successText')}</p>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${uid}-name`}>{t('name')}</label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          required
          aria-invalid={error === 'name' || undefined}
        />
      </div>

      <div className="field">
        <label htmlFor={`${uid}-email`}>{t('email')}</label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          required
          aria-invalid={error === 'email' || undefined}
        />
      </div>

      <fieldset className="field field--choice">
        <legend>{t('roleLegend')}</legend>
        <label className="choice">
          <input type="radio" name="role" checked={role === 'private'} onChange={() => setRole('private')} />
          <span>{t('rolePrivate')}</span>
        </label>
        <label className="choice">
          <input type="radio" name="role" checked={role === 'partner'} onChange={() => setRole('partner')} />
          <span>{t('rolePartner')}</span>
        </label>
      </fieldset>

      {role === 'private' ? (
        <label className="check">
          <input type="checkbox" name="pilot" />
          <span>{t('pilot')}</span>
        </label>
      ) : null}

      <div className="field">
        <label htmlFor={`${uid}-message`}>
          {t('message')} <span className="field-opt">({t('optional')})</span>
        </label>
        <textarea id={`${uid}-message`} name="message" rows={3} maxLength={3000} />
      </div>

      {/* A field no person sees or fills in; anything in it is automated. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="check check--consent">
        <input type="checkbox" name="consent" required aria-invalid={error === 'consent' || undefined} />
        <span>
          {t('consent')} <Link href="/datenschutz">{t('privacyLink')}</Link>
        </span>
      </label>

      <div className="form-foot">
        <button type="submit" className="btn btn--primary" disabled={sending}>
          <span>{sending ? t('sending') : t('submit')}</span>
        </button>
        <p className="form-error" role="alert">
          {error === 'send' && contactEmail ? (
            <>
              {t('errors.sendWithMail')} <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </>
          ) : error ? (
            t(`errors.${error}`)
          ) : null}
        </p>
      </div>
    </form>
  );
}
