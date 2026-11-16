/**
 * Turn the Claude Design export (design-export/*.dc.html) into what the site
 * serves, without redrawing anything:
 *
 *   design-export/<Page>[-en].dc.html  →  content/<locale>/<page>.html
 *   design-export/assets, bg-*.svg     →  public/design/
 *   the design's hover rules           →  app/design-hover.css
 *
 * The export is plain HTML with inline styles, so the markup is kept exactly
 * as designed. Only four things change: the design runtime's wrappers are
 * dropped, its <image-slot> becomes a plain <img>, file links become site
 * routes, and asset paths point at /design/.
 *
 * Re-run after a new export:  node scripts/import-design.mjs
 */
import {cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'design-export');

/** Design file name → page key, and page key → route per language. */
const PAGES = {
  'Landing Page': 'home',
  'Lisa-Felix': 'lisa',
  Ablauf: 'method',
  Themen: 'topics',
  Preise: 'pricing',
  FAQ: 'faq',
  Footer: 'footer',
};
const ROUTES = {
  home: {de: '', en: ''},
  lisa: {de: '/lisa', en: '/lisa'},
  method: {de: '/methode', en: '/method'},
  topics: {de: '/themen', en: '/topics'},
  pricing: {de: '/preise', en: '/pricing'},
  faq: {de: '/fragen', en: '/faq'},
};
const REGISTER = {de: '/vormerken', en: '/register'};

const hovers = new Map();
const hoverClass = rule => {
  if (!hovers.has(rule)) hovers.set(rule, `hv-${hovers.size + 1}`);
  return hovers.get(rule);
};

function convert(html, locale) {
  let out = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
  out = out.replace(/<helmet>[\s\S]*?<\/helmet>/g, '');
  out = out.replace(/<dc-import[^>]*><\/dc-import>/g, '');

  // The design's image slots fill their frame; a plain image does the same.
  out = out.replace(/<image-slot([^>]*)><\/image-slot>/g, (_, attrs) => {
    const src = attrs.match(/src="([^"]+)"/)[1];
    const alt = (attrs.match(/placeholder="([^"]*)"/) || [, ''])[1];
    return `<img src="/design/${src}" alt="${alt}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">`;
  });

  // Hover styles were an attribute the design runtime understood; here they
  // become a class with a real :hover rule.
  out = out.replace(/\sstyle-hover="([^"]*)"/g, (_, rule) => ` class="${hoverClass(rule)}"`);

  // Links between design files become site routes. A bare "#" was a button
  // with nowhere to go yet: it leads to the register page.
  out = out.replace(/href="([^"]*)"/g, (whole, href) => {
    if (href === '#') return `href="/${locale}${REGISTER[locale]}"`;
    const m = href.match(/^([^#]+?)(?:-en)?\.dc\.html(#.*)?$/);
    if (!m) return whole;
    const key = PAGES[decodeURIComponent(m[1])];
    if (!key || !ROUTES[key]) return whole;
    return `href="/${locale}${ROUTES[key][locale]}${m[2] || ''}"`;
  });

  // A sharper .webp beside an exported .png (see scripts/make-portraits.py) wins.
  out = out.replace(/assets\/([\w-]+)\.png/g, (whole, name) => (existsSync(join(SRC, 'assets', `${name}.webp`)) ? `assets/${name}.webp` : whole));

  out = out.replace(/url\((['"]?)(assets\/|bg-)/g, 'url($1/design/$2');
  out = out.replace(/src="(bg-[^"]+|assets\/[^"]+)"/g, 'src="/design/$1"');
  return out.trim() + '\n';
}

/**
 * Places where the export still carried placeholders or dead links.
 *
 *   Pricing  the two plans were left as "Abo 1 / – €": filled with the prices
 *            from the concept paper (Basic 59 €, Plus 99 €, 5 and 10
 *            conversations of 30 minutes), and the dashed "enter here" box
 *            becomes an ordinary line of text.
 *   Footer   Impressum and Datenschutz pointed nowhere: they lead to the
 *            site's legal pages. There is no terms page yet, so AGB goes to
 *            the legal notice too.
 */
function fillIns(out, key, locale) {
  if (key === 'home' && existsSync(join(SRC, 'assets', 'call.webp'))) {
    // The export draws a laptop and a phone with CSS around two small
    // pictures. One photographed call (scripts/make-portraits.py) replaces both.
    const alt = locale === 'de'
      ? 'Videogespräch mit Felix am Laptop und mit Lisa auf dem Smartphone'
      : 'Video call with Felix on a laptop and with Lisa on a phone';
    out = out.replace(
      /<div style="flex:1 1 440px[\s\S]*?(?=<div style="flex:1 1 360px)/,
      `<div style="flex:1 1 440px;min-width:0;display:flex;justify-content:center">\n    <img src="/design/assets/call.webp" alt="${alt}" width="1498" height="896" style="display:block;width:100%;max-width:560px;height:auto">\n  </div>\n  `,
    );
  }
  const en = locale === 'en';
  if (key === 'pricing') {
    const plans = en
      ? [['Plan 1', 'Basic', '€59', '5 conversations of 30 minutes per month.'], ['Plan 2', 'Plus', '€99', '10 conversations of 30 minutes per month.']]
      : [['Abo 1', 'Basic', '59 €', '5 Gespräche à 30 Minuten pro Monat.'], ['Abo 2', 'Plus', '99 €', '10 Gespräche à 30 Minuten pro Monat.']];
    const placeholder = en ? 'Add price and features here.' : 'Preis und Leistungsumfang hier eintragen.';
    for (const [from, name, price, text] of plans) {
      out = out.replace(`>${from}<`, `>${name}<`).replace('>– €<', `>${price}<`).replace(placeholder, text);
    }
    out = out.replaceAll('border:1px dashed rgba(233,181,74,.6);border-radius:10px;padding:10px 12px', 'padding:0');
  }
  if (key === 'footer') {
    const legal = en ? '/en/legal-notice' : '/de/impressum';
    const privacy = en ? '/en/privacy' : '/de/datenschutz';
    const link = (label, href) => {
      out = out.replace(new RegExp(`href="[^"]*"([^>]*>${label}<)`), `href="${href}"$1`);
    };
    link(en ? 'Legal notice' : 'Impressum', legal);
    link(en ? 'Privacy' : 'Datenschutz', privacy);
    link(en ? 'Terms' : 'AGB', legal);
  }
  return out;
}


let count = 0;
const titles = {de: {}, en: {}};
for (const file of readdirSync(SRC)) {
  const m = file.match(/^(.+?)(-en)?\.dc\.html$/);
  if (!m || !PAGES[m[1]]) continue;
  const locale = m[2] ? 'en' : 'de';
  const dir = join(ROOT, 'content', locale);
  mkdirSync(dir, {recursive: true});
  const title = readFileSync(join(SRC, file), 'utf8').match(/<title>([^<]*)<\/title>/);
  if (title) titles[locale][PAGES[m[1]]] = title[1].trim();
  writeFileSync(join(dir, `${PAGES[m[1]]}.html`), fillIns(convert(readFileSync(join(SRC, file), 'utf8'), locale), PAGES[m[1]], locale));
  count++;
}

// Page titles, as the design wrote them.
for (const locale of ['de', 'en']) writeFileSync(join(ROOT, 'content', locale, 'titles.json'), JSON.stringify(titles[locale], null, 2));

mkdirSync(join(ROOT, 'public', 'design'), {recursive: true});
cpSync(join(SRC, 'assets'), join(ROOT, 'public', 'design', 'assets'), {recursive: true});
for (const file of readdirSync(SRC)) {
  if (/^bg-.*\.svg$/.test(file)) cpSync(join(SRC, file), join(ROOT, 'public', 'design', file));
}

const css =
  '/* Generated by scripts/import-design.mjs from the design\'s hover rules. */\n' +
  [...hovers].map(([rule, cls]) => `.dc .${cls}:hover { ${rule.split(';').filter(Boolean).map(d => `${d} !important`).join('; ')}; }`).join('\n') +
  '\n';
writeFileSync(join(ROOT, 'app', 'design-hover.css'), css);

console.log(`Imported ${count} design files, ${hovers.size} hover rules.`);
