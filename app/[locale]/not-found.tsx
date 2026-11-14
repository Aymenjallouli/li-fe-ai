import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Stop from '@/components/Stop';

export default function NotFound() {
  const t = useTranslations('common.notFound');
  return (
    <section className="legal">
      <div className="wrap legal-in">
        <h1 className="h2">
          <Stop>{t('title')}</Stop>
        </h1>
        <p className="lead">{t('text')}</p>
        <p>
          <Link href="/" className="btn btn--primary">
            <span>{t('back')}</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
