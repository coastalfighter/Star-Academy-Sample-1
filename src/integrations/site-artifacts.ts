import type { AstroIntegration } from 'astro';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { toNetlifyRedirects } from '../lib/redirects';
import { buildCsp, injectCspMeta, inlineScriptHashes, netlifyHeaders } from '../lib/security';

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return e.name === 'admin' ? [] : htmlFiles(full);
      return e.name.endsWith('.html') ? [full] : [];
    }),
  );
  return nested.flat();
}

/**
 * Post-build: per-page hashed CSP, security headers and URL redirects.
 * Output is plain files, so the site stays portable between hosts.
 */
export default function siteArtifacts(): AstroIntegration {
  return {
    name: 'stars-site-artifacts',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const files = await htmlFiles(out);
        for (const file of files) {
          const html = await readFile(file, 'utf8');
          // Allow analytics origins only on pages that actually load analytics.
          const analytics = html.includes('googletagmanager.com/gtag/js');
          const csp = buildCsp(inlineScriptHashes(html), { analytics });
          await writeFile(file, injectCspMeta(html, csp));
        }
        await writeFile(join(out, '_redirects'), toNetlifyRedirects());
        await writeFile(join(out, '_headers'), netlifyHeaders());
        logger.info(`CSP injected into ${files.length} pages; _redirects and _headers written.`);
      },
    },
  };
}
