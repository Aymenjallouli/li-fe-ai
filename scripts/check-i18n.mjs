/**
 * Verify that the German and English message files describe the same tree.
 *
 * TypeScript cannot catch a missing translation: `t('hero.lead')` is just a
 * string, so a key present in one language and absent in the other compiles
 * happily and throws MISSING_MESSAGE at request time.
 *
 * Checks, per namespace file:
 *   1. both locales have the file
 *   2. every key path exists in both (arrays are compared by length and shape)
 *   3. no value is an empty string
 *
 * Run with `npm run check:i18n`. Exits non-zero on any problem.
 */
import {readFileSync, readdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['de', 'en'];

const messages = {};
for (const locale of LOCALES) {
  messages[locale] = {};
  const dir = join(ROOT, 'messages', locale);
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    messages[locale][file.slice(0, -5)] = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  }
}

/** Every leaf path in a tree, with array indices included. */
function leaves(node, prefix = '', out = new Map()) {
  if (Array.isArray(node)) {
    node.forEach((value, i) => leaves(value, `${prefix}[${i}]`, out));
  } else if (node !== null && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) leaves(value, prefix ? `${prefix}.${key}` : key, out);
  } else {
    out.set(prefix, node);
  }
  return out;
}

const problems = [];
const [a, b] = LOCALES;

for (const ns of new Set([...Object.keys(messages[a]), ...Object.keys(messages[b])])) {
  if (!(ns in messages[a])) {
    problems.push(`messages/${a}/${ns}.json is missing`);
    continue;
  }
  if (!(ns in messages[b])) {
    problems.push(`messages/${b}/${ns}.json is missing`);
    continue;
  }
  const left = leaves(messages[a][ns]);
  const right = leaves(messages[b][ns]);

  for (const path of left.keys()) if (!right.has(path)) problems.push(`${ns}: "${path}" exists in ${a} but not in ${b}`);
  for (const path of right.keys()) if (!left.has(path)) problems.push(`${ns}: "${path}" exists in ${b} but not in ${a}`);

  for (const [locale, tree] of [[a, left], [b, right]]) {
    for (const [path, value] of tree) {
      if (typeof value === 'string' && value.trim() === '') problems.push(`${ns}: "${path}" is empty in ${locale}`);
    }
  }
}

if (problems.length) {
  console.error(`i18n check failed — ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error('  ' + problem);
  process.exit(1);
}

const count = [...Object.values(messages[a])].reduce((n, tree) => n + leaves(tree).size, 0);
console.log(`i18n check passed — ${count} messages, ${LOCALES.join(' and ')} in step.`);
