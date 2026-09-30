import { describe, expect, it } from 'vitest';
import { buildVercelConfig } from '@/lib/vercel';
import { REDIRECTS } from '@/lib/redirects';
import { resolveFormDelivery } from '@/lib/form-delivery';
import { buildCsp, formEndpointOrigins } from '@/lib/security';
import { readRepoFile } from './helpers';

describe('vercel.json', () => {
  const committed = JSON.parse(readRepoFile('vercel.json'));

  it('is in sync with src/lib/vercel.ts (run `npm run vercel:config` if this fails)', () => {
    expect(committed).toEqual(buildVercelConfig());
  });

  it('mirrors every Netlify redirect as a permanent redirect', () => {
    expect(committed.redirects).toEqual(REDIRECTS.map((r) => ({ source: r.from, destination: r.to, permanent: true })));
  });

  it('serves extensionless URLs and keeps the temporary host out of search results', () => {
    expect(committed.cleanUrls).toBe(true);
    expect(committed.trailingSlash).toBe(false);
    const global = committed.headers.find((h: { source: string }) => h.source === '/(.*)');
    const keys = global.headers.map((h: { key: string }) => h.key);
    expect(keys).toEqual(expect.arrayContaining(['X-Robots-Tag', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options']));
  });
});

describe('resolveFormDelivery', () => {
  it('defaults to Netlify Forms off Vercel', () => {
    expect(resolveFormDelivery({})).toEqual({ mode: 'netlify', endpoint: null });
  });
  it('falls back to a labeled preview on Vercel without an endpoint, so nothing is silently lost', () => {
    expect(resolveFormDelivery({ onVercel: true })).toEqual({ mode: 'preview', endpoint: null });
  });
  it('uses a configured endpoint on any host', () => {
    const endpoint = 'https://formspree.io/f/abc123';
    expect(resolveFormDelivery({ endpoint, onVercel: true })).toEqual({ mode: 'endpoint', endpoint });
  });
  it('honors an explicit mode', () => {
    expect(resolveFormDelivery({ mode: 'preview' }).mode).toBe('preview');
    expect(resolveFormDelivery({ mode: 'netlify', onVercel: true }).mode).toBe('netlify');
  });
  it('rejects unsafe or incomplete configuration at build time', () => {
    expect(() => resolveFormDelivery({ endpoint: 'http://insecure.example' })).toThrow(/https/);
    expect(() => resolveFormDelivery({ mode: 'endpoint' })).toThrow(/PUBLIC_FORM_ENDPOINT/);
    expect(() => resolveFormDelivery({ mode: 'email' })).toThrow(/Unknown/);
  });
});

describe('CSP with an external form endpoint', () => {
  it('allows only that origin for fetch and form posts', () => {
    const origins = formEndpointOrigins('<form data-endpoint="https://formspree.io/f/abc123"></form>');
    expect(origins).toEqual(['https://formspree.io']);
    const csp = buildCsp([], { analytics: false, formOrigins: origins });
    expect(csp).toContain("connect-src 'self' https://formspree.io");
    expect(csp).toContain("form-action 'self' https://formspree.io");
  });
});
