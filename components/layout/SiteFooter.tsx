import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {EMERGENCY} from '@/lib/site-config';
import {NAV_LEGAL, NAV_MAIN, NAV_MORE} from '@/lib/nav';
import Logo from '@/components/Logo';

export default function SiteFooter() {
  const t = useTranslations('common');
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo prefix={t('brand.prefix')} />
            <p className="foot-claim">{t('brand.claim')}</p>
            <p className="foot-about">{t('footer.about')}</p>
          </div>

          <nav className="foot-col" aria-label={t('footer.navTitle')}>
            <h2>{t('footer.navTitle')}</h2>
            <ul>
              {NAV_MAIN.map(item => (
                <li key={item.key}>
                  <Link href={item.href}>{t(`nav.${item.key}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="foot-col" aria-label={t('footer.moreTitle')}>
            <h2>{t('footer.moreTitle')}</h2>
            <ul>
              {NAV_MORE.map(item => (
                <li key={item.key}>
                  <Link href={item.href}>{t(`nav.${item.key}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="foot-col foot-crisis">
            <h2>{t('footer.crisisTitle')}</h2>
            <p>{t('footer.crisisText')}</p>
            <ul>
              <li>
                <span>{t('footer.crisisEmergency')}</span>
                <a href={`tel:${EMERGENCY.general.tel}`}>{EMERGENCY.general.display}</a>
              </li>
              <li>
                <span>{t('footer.crisisCounselling')}</span>
                <a href={`tel:${EMERGENCY.counselling[0].tel}`}>{EMERGENCY.counselling[0].display}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-base">
          <p>{t('footer.copyright', {year: new Date().getFullYear()})}</p>
          <p>{t('footer.tech')}</p>
          <ul>
            {NAV_LEGAL.map(item => (
              <li key={item.key}>
                <Link href={item.href}>{t(`nav.${item.key}`)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
