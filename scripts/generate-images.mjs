/**
 * Renders the Open Graph share image and Apple touch icon from HTML using
 * the site's own fonts and colors. Run after changing brand details:
 *   node scripts/generate-images.mjs
 * Requires Playwright's Chromium (CHROMIUM_PATH overrides the binary).
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const font = (p) => readFileSync(`${root}node_modules/${p}`).toString('base64');
const fraunces = font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2');
const frauncesItalic = font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2');
const figtree = font('@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2');

const star = `<svg viewBox="0 0 48 48" width="64" height="64"><path d="M24 3.5 29.6 17l14.4 1.2-11 9.5 3.4 14.2L24 34.3l-12.4 7.6L15 27.7 4 18.2 18.4 17Z" fill="#f2c230" stroke="#c4323a" stroke-width="1.6" stroke-linejoin="round"/><path d="m24 14.5 1.9 4.4 4.7.4-3.6 3.1 1.1 4.6-4.1-2.5-4.1 2.5 1.1-4.6-3.6-3.1 4.7-.4Z" fill="#221f55"/></svg>`;

const base = `
<style>
@font-face{font-family:F;src:url(data:font/woff2;base64,${fraunces}) format('woff2');font-weight:100 900}
@font-face{font-family:F;font-style:italic;src:url(data:font/woff2;base64,${frauncesItalic}) format('woff2');font-weight:100 900}
@font-face{font-family:S;src:url(data:font/woff2;base64,${figtree}) format('woff2');font-weight:300 900}
*{margin:0;box-sizing:border-box}
</style>`;

const og = `${base}
<body style="width:1200px;height:630px;background:#17153a;color:#fff;font-family:S;position:relative;overflow:hidden">
  <svg viewBox="0 0 48 48" style="position:absolute;right:-120px;top:-110px;width:620px;height:620px"><path d="M24 3.5 29.6 17l14.4 1.2-11 9.5 3.4 14.2L24 34.3l-12.4 7.6L15 27.7 4 18.2 18.4 17Z" fill="none" stroke="#f2c230" stroke-opacity=".16" stroke-width=".3"/></svg>
  <div style="position:absolute;inset:72px 80px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:16px">${star}
      <div><div style="font-family:F;font-weight:650;font-size:40px;letter-spacing:.06em;line-height:1">STARS</div>
      <div style="font-size:14px;font-weight:700;letter-spacing:.34em;color:#f2c230;margin-top:6px">ACADEMY</div></div>
    </div>
    <div>
      <div style="font-family:F;font-weight:380;font-size:68px;line-height:1.05;letter-spacing:-.02em;max-width:900px">Therapy, learning and care for young children, <em style="color:#f2c230">woven into one full day.</em></div>
      <div style="margin-top:28px;font-size:24px;color:#c7c5dc">Pediatric developmental day treatment · Batesville, Arkansas</div>
    </div>
  </div>
</body>`;

const icon = `${base}
<body style="width:180px;height:180px;background:#17153a;display:grid;place-items:center">
  <svg viewBox="0 0 48 48" width="128" height="128"><path d="M24 3.5 29.6 17l14.4 1.2-11 9.5 3.4 14.2L24 34.3l-12.4 7.6L15 27.7 4 18.2 18.4 17Z" fill="#f2c230" stroke="#c4323a" stroke-width="1.6" stroke-linejoin="round"/></svg>
</body>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(og, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}public/og/default.png` });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(icon, { waitUntil: 'load' });
await page.screenshot({ path: `${root}public/apple-touch-icon.png` });
await browser.close();
console.log('Wrote public/og/default.png and public/apple-touch-icon.png');
