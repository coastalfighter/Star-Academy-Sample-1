import { REDIRECTS, type Redirect } from './redirects.ts';

/**
 * vercel.json for temporary/preview hosting on Vercel. Netlify remains the
 * recommended production host; this mirrors its _redirects and _headers.
 * `vercel.json` is committed and kept in sync by tests/unit/vercel.test.ts —
 * regenerate with `npm run vercel:config` after editing redirects or headers.
 */

const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; upgrade-insecure-requests" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Temporary host: keep it out of search results so it never competes with
  // mystarsacademy.org. Remove only if Vercel becomes the production host.
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

export function toVercelRedirects(rules: Redirect[] = REDIRECTS) {
  return rules.map((r) => ({ source: r.from, destination: r.to, permanent: r.status === 301 }));
}

export function buildVercelConfig() {
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: 'astro',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    cleanUrls: true,
    trailingSlash: false,
    redirects: toVercelRedirects(),
    headers: [
      { source: '/(.*)', headers: SECURITY_HEADERS },
      { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ],
  };
}
