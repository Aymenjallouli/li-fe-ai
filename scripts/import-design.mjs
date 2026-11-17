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
/* Call controls drawn over the laptop and phone screens. Sizes are in cqw
   (share of the screen's width), so they scale with the device at any zoom. */
const ICONS = {
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  cam: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 11l6-3v8l-6-3z"/>',
  end: '<path d="M2.5 14.2c5.4-5.2 13.6-5.2 19 0l-2.6 2.6-3.6-2v-2.6c-2.1-.7-4.5-.7-6.6 0v2.6l-3.6 2z" fill="#fff" stroke="none"/>',
  people: '<circle cx="9" cy="9" r="3"/><path d="M3 19c0-3.3 2.7-5 6-5s6 1.700 6 5M16 6.500a3 3 0 0 1 0 5.500M17.500 14.500c2.200.600 3.500 2.100 3.500 4.500"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  full: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.600 5.600l2.100 2.100M16.300 16.300l2.100 2.100M18.400 5.600l-2.100 2.100M7.700 16.300l-2.100 2.100"/>',
};
const callButton = (icon, size, bg = 'rgba(38,38,40,.86)') =>
  `<span style="display:flex;align-items:center;justify-content:center;flex:none;width:${size}cqw;height:${size}cqw;border-radius:50%;background:${bg}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:54%;height:54%">${ICONS[icon]}</svg></span>`;

function callUi(device) {
  const phone = device === 'phone';
  const u = phone
    ? {pad: 6, top: 9, font: 7.5, dot: 5, small: 13, btn: 13.5, end: 16, gap: 2.6, bottom: 7}
    : {pad: 2.6, top: 2.6, font: 2.3, dot: 1.5, small: 4.6, btn: 5.8, end: 6.8, gap: 2.4, bottom: 3.6};
  const timer = `<span style="position:absolute;left:${u.pad}cqw;top:${u.top}cqw;display:flex;align-items:center;gap:${u.dot * 0.8}cqw;padding:${u.font * 0.36}cqw ${u.font * 0.8}cqw;border-radius:99px;background:rgba(38,38,40,.86);font:600 ${u.font}cqw/1.2 'Quicksand',sans-serif;color:#fff;font-variant-numeric:tabular-nums"><span style="display:block;width:${u.dot}cqw;height:${u.dot}cqw;border-radius:50%;background:#34c759"></span>00:12</span>`;
  const corner = `<span style="position:absolute;right:${u.pad}cqw;top:${u.top}cqw;display:flex;gap:${u.gap * 0.7}cqw">${callButton('full', u.small)}${phone ? '' : callButton('gear', u.small)}</span>`;
  const self = phone
    ? `<span style="position:absolute;right:${u.pad}cqw;bottom:${u.bottom + u.end + 5}cqw;display:block;width:27cqw;aspect-ratio:3/4;border-radius:4cqw;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.55),0 2px 8px rgba(0,0,0,.5);background:url(/design/assets/laptop.webp) 50% 20%/260% auto no-repeat"></span>`
    : '';
  const bar = `<span style="position:absolute;left:0;right:0;bottom:${u.bottom}cqw;display:flex;align-items:center;justify-content:center;gap:${u.gap}cqw">${callButton('mic', u.btn)}${callButton('cam', u.btn)}${callButton('end', u.end, '#ff3b30')}${callButton('people', u.btn)}${callButton('chat', u.btn)}</span>`;
  return `<div style="position:absolute;inset:0;container-type:inline-size;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.22),transparent 24%,transparent 68%,rgba(0,0,0,.38))">${timer}${corner}${self}${bar}</div>`;
}

function fillIns(out, key, locale) {
  if (key === 'home') {
    // The export's laptop and phone show a bare picture. On the site they
    // show a running call: timer, window buttons, call controls, self-view.
    out = out.replace(/(<img src="\/design\/assets\/laptop\.[a-z]+"[^>]*>)/, `$1${callUi('laptop')}`);
    out = out.replace(/(<img src="\/design\/assets\/phone\.[a-z]+"[^>]*>)/, `$1${callUi('phone')}`);
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
