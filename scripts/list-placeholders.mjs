/**
 * Lists every "CLIENT TO CONFIRM" placeholder still in the site, grouped by
 * file. Run before launch: `node scripts/list-placeholders.mjs`
 * Exits with code 1 when any remain and `--strict` is passed (use in the
 * production deploy pipeline to block launch until content is complete).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const f = join(d, n);
    if (statSync(f).isDirectory()) walk(f);
    else if (/\.(astro|md|json|ts)$/.test(n)) files.push(f);
  }
};
walk(join(root, 'src/pages'));
walk(join(root, 'src/components'));
walk(join(root, 'src/content'));

let total = 0;
for (const f of files.sort()) {
  const text = readFileSync(f, 'utf8');
  const notes = [
    ...[...text.matchAll(/\[CLIENT TO CONFIRM:\s*([^\]]+)\]/g)].map((m) => m[1].trim()),
    ...[...text.matchAll(/<Confirm note="([^"]+)"/g)].map((m) => m[1].trim()),
  ].filter((n) => n.length > 3 && !n.includes('${') && !n.startsWith('\\'));
  if (!notes.length) continue;
  total += notes.length;
  console.log(`\n${relative(root, f)}`);
  for (const n of notes) console.log(`  - ${n}`);
}
console.log(`\n${total} placeholder(s) remaining.`);
if (process.argv.includes('--strict') && total > 0) process.exit(1);
