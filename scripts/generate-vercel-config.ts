/** Writes vercel.json from src/lib/vercel.ts. Run: npm run vercel:config */
import { writeFileSync } from 'node:fs';
import { buildVercelConfig } from '../src/lib/vercel.ts';

writeFileSync(new URL('../vercel.json', import.meta.url), `${JSON.stringify(buildVercelConfig(), null, 2)}\n`);
console.log('Wrote vercel.json');
