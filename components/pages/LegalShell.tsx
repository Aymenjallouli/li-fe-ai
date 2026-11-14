import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LEGAL_DRAFT} from '@/lib/site-config';
import Stop from '@/components/Stop';

/** Shared frame for the legal notice and the privacy page. */
export default function LegalShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const t = useTranslations('legal');
  return (
    <article className="legal t-white">
      <div className="wrap legal-in">
        <Link href="/" className="legal-back">
          {t('back')}
        </Link>
        <h1 className="h2">
          <Stop>{title}</Stop>
        </h1>
        <p className="lead">{intro}</p>
        {LEGAL_DRAFT ? <p className="legal-draft">{t('draft')}</p> : null}
        <div className="legal-body">{children}</div>
      </div>
    </article>
  );
}

/** A value from the site configuration, or a visible "to be added" marker. */
export function Pending({value}: {value: string}) {
  const t = useTranslations('legal');
  return value ? <>{value}</> : <em className="legal-pending">{t('pending')}</em>;
}
