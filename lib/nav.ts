import type {AppPath} from '@/i18n/routing';

/** `key` names the label in messages/<locale>/common.json → nav. */
export type NavItem = {key: string; href: AppPath};

/** The header: five pages, each with one job. */
export const NAV_MAIN: NavItem[] = [
  {key: 'lisa', href: '/lisa'},
  {key: 'method', href: '/methode'},
  {key: 'topics', href: '/themen'},
  {key: 'pricing', href: '/preise'},
  {key: 'about', href: '/ueber-uns'},
];

/** Reached from the footer and from links inside the pages. */
export const NAV_MORE: NavItem[] = [
  {key: 'safety', href: '/sicherheit'},
  {key: 'faq', href: '/fragen'},
  {key: 'register', href: '/vormerken'},
];

export const NAV_LEGAL: NavItem[] = [
  {key: 'imprint', href: '/impressum'},
  {key: 'privacy', href: '/datenschutz'},
];
