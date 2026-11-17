import {readFileSync} from 'node:fs';
import {join} from 'node:path';

export type DesignKey = 'home' | 'lisa' | 'method' | 'topics' | 'pricing' | 'faq' | 'footer';

/** The imported design markup for one page (content/<locale>/<page>.html). */
export function designHtml(locale: string, page: DesignKey): string {
  return readFileSync(join(process.cwd(), 'content', locale === 'en' ? 'en' : 'de', `${page}.html`), 'utf8');
}

/** The page title the design gave this page. */
export function designTitle(locale: string, page: DesignKey): string {
  const titles = JSON.parse(
    readFileSync(join(process.cwd(), 'content', locale === 'en' ? 'en' : 'de', 'titles.json'), 'utf8'),
  ) as Record<string, string>;
  return titles[page] ?? 'li-fe.ai';
}

/**
 * Renders a page exactly as it was designed.
 *
 * The markup lives in content/<locale>/<page>.html (taken from the Claude
 * Design export) and is read here at build time. It is the project's own
 * file, not user input. Everything inside `.dc` is shielded from the
 * site's other styles (see app/globals.css), so the inline styles of the
 * design are the only thing that applies.
 */
export default function DesignPage({locale, page}: {locale: string; page: DesignKey}) {
  return <div className="dc" dangerouslySetInnerHTML={{__html: designHtml(locale, page)}} />;
}
