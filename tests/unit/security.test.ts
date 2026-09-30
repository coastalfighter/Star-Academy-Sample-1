import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildCsp, injectCspMeta, inlineScriptHashes, netlifyHeaders } from '@/lib/security';

const sha = (s: string) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;

describe('inlineScriptHashes', () => {
  it('hashes inline scripts, ignoring external scripts and JSON-LD', () => {
    const html = `
      <script>alert(1)</script>
      <script type="module">import x from 'y'</script>
      <script src="/a.js"></script>
      <script type="application/ld+json">{"a":1}</script>`;
    expect(inlineScriptHashes(html)).toEqual([sha('alert(1)'), sha("import x from 'y'")].sort());
  });
  it('deduplicates identical scripts', () => {
    expect(inlineScriptHashes('<script>a</script><script>a</script>')).toHaveLength(1);
  });
});

describe('buildCsp', () => {
  it('is strict by default', () => {
    const csp = buildCsp(["'sha256-abc'"], { analytics: false });
    expect(csp).toContain("script-src 'self' 'sha256-abc'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).not.toContain('googletagmanager');
  });
  it('allows analytics origins only when analytics is present', () => {
    expect(buildCsp([], { analytics: true })).toContain('https://www.googletagmanager.com');
  });
});

describe('injectCspMeta', () => {
  it('places the policy before any script', () => {
    const out = injectCspMeta('<html><head><meta charset="utf-8"><script>x</script></head></html>', "default-src 'self'");
    expect(out.indexOf('Content-Security-Policy')).toBeLessThan(out.indexOf('<script>'));
  });
});

describe('netlifyHeaders', () => {
  it('sets core security headers', () => {
    const h = netlifyHeaders();
    for (const header of ['Strict-Transport-Security', 'X-Content-Type-Options: nosniff', 'X-Frame-Options: DENY', 'Referrer-Policy']) {
      expect(h).toContain(header);
    }
  });
});
