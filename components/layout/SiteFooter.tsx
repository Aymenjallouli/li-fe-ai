import {useLocale} from 'next-intl';
import DesignPage from '@/components/DesignPage';

/** The footer exactly as designed (Footer.dc.html). */
export default function SiteFooter() {
  const locale = useLocale();
  return <DesignPage locale={locale} page="footer" />;
}
