# 06 — Migration, QA, launch & operations

## Migration plan (Wix → Astro on Netlify)

1. **Inventory.** All 14 legacy URLs are listed in `src/lib/redirects.ts` (`LEGACY_URLS`). A unit test fails the build if any legacy URL has no destination.
2. **URL preservation.** Service, tour, about and contact URLs are kept exactly. Five URLs get a 301 (`/enroll-now`, `/what-we-do`, `/general-8`, `/apply-now`, `/walk`), plus friendly aliases (`/tour`, `/jobs`, `/refer` …). `_redirects` is generated at build time.
3. **Metadata.** Every page has a unique title (≤ 65 characters, brand included), a meta description (≤ 160 characters), a canonical URL and Open Graph/Twitter tags. All of this is verified by tests.
4. **Analytics continuity.** Before launch, create or confirm the GA4 property under STARS' Google account and set `PUBLIC_GA4_ID` in Netlify. Add annotations for the launch date.
5. **Forms.** Netlify detects all five forms at deploy. Configure email notifications per form (Netlify → Forms → Notifications) to the right inboxes.
6. **Content & images.** Replace placeholders (see `05-client-input-needed.md`). Real photos go in `public/uploads` via the CMS; add `src` + `alt` in the photo fields.

## Launch procedure

| When | Step |
|---|---|
| T-7 days | Lower the DNS TTL on `mystarsacademy.org` to 300s. Confirm registrar access and 2FA. |
| T-7 days | Deploy to the Netlify preview URL (automatically `noindex`). Complete the QA checklist below. |
| T-3 days | STARS sign-off on content. `npm run placeholders -- --strict` passes (zero markers). |
| T-0 | Add the custom domain in Netlify and point DNS (`www` CNAME → Netlify; apex → Netlify load balancer). Netlify provisions the Let's Encrypt SSL certificate automatically. Force HTTPS. |
| T-0 | Smoke test: home, one service page, all 5 forms (submit test entries), a redirect check (`/enroll-now` → `/getting-started`), `sitemap-index.xml`, `robots.txt`. |
| T-0 | In Google Search Console, verify the domain property, submit `https://www.mystarsacademy.org/sitemap-index.xml`, and request indexing for the home page. |
| T+1 day | Update the Google Business Profile website/appointment links (home and `/schedule-a-tour`). |
| T+7 / T+30 | Review Search Console coverage and 404s. Add redirects for any unexpected legacy URLs. Compare GA4 traffic against the prior period. |
| After T+30 | Cancel the Wix premium plan **only after** the domain is confirmed transferred or pointed, and forms have been working for 30 days. |

## QA checklist (automated in `npm run verify`, plus manual)

**Automated (CI on every change):**
- [x] TypeScript/Astro type check: 0 errors
- [x] 98 unit tests: validation, CSP, redirects, SEO helpers, navigation/link integrity, content integrity
- [x] axe-core WCAG 2.0/2.1/2.2 A + AA + best-practice on all 20 indexable pages, desktop and mobile, with disclosures expanded: 0 violations
- [x] One H1 per page; no skipped heading levels; title/description/canonical present
- [x] No horizontal overflow at 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920px
- [x] Touch targets ≥ 44px for navigation, footer and buttons on mobile
- [x] Every internal link and in-page anchor resolves
- [x] Sitemap includes every indexable page and excludes utility pages; robots.txt correct
- [x] Hashed CSP on every page with zero violations; new-tab links have `rel="noopener"` and announce "opens in a new tab"
- [x] Forms: error summary with focus management, inline errors, success state, honeypot, network-failure fallback, no-PHI referral form
- [x] Keyboard: skip link, Services menu (Enter/Escape), mobile menu focus trap and Escape

**Manual before launch:**
- [ ] Safari (macOS and iOS), Firefox, Edge, Chrome on Android: visual pass of every template
- [ ] VoiceOver (iOS) and NVDA (Windows) pass on Home, Getting Started and one form
- [ ] 200% and 400% browser zoom on Home and Getting Started
- [ ] Lighthouse mobile on a production URL (target: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100)
- [ ] Real form submissions reach the right inboxes
- [ ] Real photography has descriptive alt text; decorative images have empty alt

## Backup & restore

- **Code and content:** every change is a git commit in STARS' GitHub repository. To restore, revert the commit (or use the CMS history).
- **Deploys:** Netlify keeps every deploy. To roll back instantly, go to Deploys → select a previous deploy → Publish.
- **Form submissions:** export CSVs from Netlify monthly (or forward them to a STARS mailbox that is backed up).
- **Media:** originals are kept in the repository (`public/uploads`) and in STARS' shared drive.

## Routine operations

| Task | Who | How |
|---|---|---|
| Open/close a job | Staff | CMS → Careers — Positions → set status |
| Post an announcement | Staff | CMS → Announcements (optional hide-after date) |
| Edit an FAQ or service text | Staff | CMS → FAQs / Services |
| Daily rebuild (expires old announcements) | Automatic | Netlify build hook called by a scheduled job (for example, a GitHub Actions cron) |
| Dependency updates | Developer | Quarterly: `npm outdated`, update, `npm run verify` |
| Accessibility regression check | Automatic | CI on every change |

## Staff training (90 minutes, recorded)

1. Logging in to `/admin`; the editorial workflow (draft → ready → publish)
2. Jobs, announcements and FAQs: hands-on practice
3. Editing a service page and replacing a photo (with alt text guidance)
4. Where form submissions arrive; exporting them
5. Rolling back a mistake
6. A one-page quick-reference PDF, left with staff
