import { createHash } from 'node:crypto';

/**
 * Content Security Policy built per page at build time. Inline scripts are
 * allowed only by their exact SHA-256 hash, so injected scripts cannot run.
 * JSON-LD blocks are data, not script, and are not subject to script-src.
 */

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

export function inlineScriptHashes(html: string): string[] {
  const hashes = new Set<string>();
  for (const match of html.matchAll(INLINE_SCRIPT)) {
    const attrs = match[1] ?? '';
    const body = match[2] ?? '';
    if (/type=["']?application\/(ld\+)?json/i.test(attrs)) continue;
    if (!body.trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
  return [...hashes].sort();
}

export const ANALYTICS_ORIGINS = {
  script: ['https://www.googletagmanager.com'],
  connect: ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com'],
  img: ['https://*.google-analytics.com', 'https://www.googletagmanager.com'],
};

export function buildCsp(scriptHashes: string[], opts: { analytics: boolean; formOrigins?: string[] }): string {
  const a = opts.analytics;
  const forms = opts.formOrigins ?? [];
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", ...scriptHashes, ...(a ? ANALYTICS_ORIGINS.script : [])],
    // Component-scoped styles and CSS custom-property style attributes.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', ...(a ? ANALYTICS_ORIGINS.img : [])],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...forms, ...(a ? ANALYTICS_ORIGINS.connect : [])],
    'form-action': ["'self'", ...forms],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
  };
  return Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(' ')}`)
    .join('; ');
}

/** Origins of external form endpoints used on a page (data-endpoint attributes). */
export function formEndpointOrigins(html: string): string[] {
  const origins = new Set<string>();
  for (const m of html.matchAll(/data-endpoint="(https:\/\/[^"]+)"/g)) origins.add(new URL(m[1]!).origin);
  return [...origins].sort();
}

/** Inserts a CSP <meta> immediately after <meta charset>, before any script. */
export function injectCspMeta(html: string, csp: string): string {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, '&quot;')}">`;
  const charset = /<meta charset=["']?utf-8["']?\s*\/?>/i;
  if (charset.test(html)) return html.replace(charset, (m) => `${m}${tag}`);
  return html.replace(/<head>/i, `<head>${tag}`);
}

/** Response headers for every path (Netlify `_headers` format). */
export function netlifyHeaders(): string {
  return `# Generated at build time by src/integrations/site-artifacts.ts
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Content-Security-Policy: frame-ancestors 'none'; upgrade-insecure-requests
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/brand/*
  Cache-Control: public, max-age=2592000

/og/*
  Cache-Control: public, max-age=2592000
`;
}
