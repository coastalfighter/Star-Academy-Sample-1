// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteArtifacts from './src/integrations/site-artifacts.ts';

// Canonical production origin. Change only if STARS moves domains.
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://www.mystarsacademy.org';

// Utility pages that should never appear in search results.
const NOINDEX = ['/thank-you', '/404'];

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    siteArtifacts(),
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.replace(/\/$/, '').endsWith(p)),
    }),
  ],
});
