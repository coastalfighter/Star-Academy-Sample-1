# STARS Academy — Website

A complete strategic redesign of [mystarsacademy.org](https://www.mystarsacademy.org) for STARS Academy, a pediatric developmental day treatment program in Batesville, Arkansas (therapy, nursing and developmental classrooms for children from birth to age six).

> **Status:** design and build complete. Content marked **[Client to confirm: …]** is waiting on STARS (see [`docs/05-client-input-needed.md`](docs/05-client-input-needed.md)), and real photography will replace the art-directed placeholders.

## Documentation

| Doc | What's inside |
|---|---|
| [01 — Discovery audit](docs/01-discovery-audit.md) | Current-site inventory; what stays, goes, combines or is added |
| [02 — Strategy](docs/02-strategy.md) | Messaging hierarchy, final sitemap, navigation, user journeys, CTA strategy |
| [03 — Design system](docs/03-design-system.md) | Color, type, spacing, components, motion, photography direction |
| [04 — Platform recommendation](docs/04-platform-recommendation.md) | Why Astro + Decap CMS + Netlify, ownership, trade-offs |
| [05 — Client input needed](docs/05-client-input-needed.md) | Every placeholder, grouped as a checklist |
| [06 — Launch & operations](docs/06-launch-and-operations.md) | Migration, launch runbook, QA checklist, backups, training |
| [07 — Vercel preview hosting](docs/07-vercel-preview-hosting.md) | Temporary Vercel deploy: setup, forms, noindex, differences from Netlify |

## Stack

- **[Astro 7](https://astro.build)**: static HTML output with almost no client JavaScript (~12 KB total)
- **TypeScript** (strict) and typed content collections (Zod schemas)
- **Decap CMS** at `/admin`: git-based, open source; staff edit jobs, FAQs, announcements and service text
- **Netlify** hosting and Forms (honeypot, timing check and Akismet spam protection)
- Self-hosted variable fonts: **Fraunces** (display) and **Figtree** (text)
- **Vitest** (unit tests) and **Playwright + axe-core** (end-to-end, accessibility, responsive and security tests)

## Getting started

```bash
nvm use            # Node 22 (see .nvmrc)
npm ci
cp .env.example .env
npm run dev        # http://localhost:4321
```

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build to `dist/` (adds per-page CSP, `_headers`, `_redirects`) |
| `npm run preview` | Serve the production build |
| `npm run check` | Astro/TypeScript diagnostics |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests against the built site (set `CHROMIUM_PATH` to use a preinstalled Chromium) |
| `npm run verify` | All of the above, in order: what CI runs |
| `npm run placeholders` | List every remaining "client to confirm" marker |
| `npm run images` | Regenerate the Open Graph image and touch icon |
| `npm run vercel:config` | Regenerate `vercel.json` after changing redirects or headers |

## Project structure

```
├── docs/                       Strategy, design system, platform, launch documentation
├── public/
│   ├── admin/                  Decap CMS (index.html + config.yml)
│   ├── brand/                  Master STARS logo
│   ├── og/                     Social share image
│   ├── favicon.svg · apple-touch-icon.png · robots.txt
├── scripts/                    Image generation, placeholder audit
├── src/
│   ├── components/
│   │   ├── home/               Ten single-purpose homepage sections
│   │   ├── forms/              Form shell, Field, and the five site forms
│   │   └── *.astro             Header, Footer, PageHero, Photo, Steps, Faq, NextSteps, SEO…
│   ├── content/                CMS-editable content: services/*.md, jobs/*.md, faqs.json, announcements.json
│   ├── content.config.ts       Content schemas
│   ├── integrations/           Post-build: hashed CSP, security headers, redirects
│   ├── layouts/                BaseLayout, LegalLayout
│   ├── lib/                    site facts, navigation/IA, SEO + schema, validation, redirects, security
│   ├── pages/                  Routes ([service].astro renders all five service pages)
│   ├── scripts/                Navigation, forms, reveal (progressive enhancement)
│   └── styles/                 tokens.css (design tokens), global.css
└── tests/
    ├── unit/                   Vitest
    └── e2e/                    Playwright + axe
```

## Editing content

- **Organization facts** (phone, hours, addresses, funding): `src/lib/site.ts`. These are used everywhere, including schema.org data.
- **Navigation:** `src/lib/navigation.ts`.
- **Services, jobs, FAQs, announcements:** use the CMS at `/admin`, or edit `src/content/` directly.
- **Placeholders:** write `[CLIENT TO CONFIRM: what is needed]` in content, or use `<Confirm note="…" />` in pages. They render as visible teal markers and are listed by `npm run placeholders`.
- **Photos:** each `Photo` slot carries a shot brief. Pass `src` and `alt` (or set them in the CMS) to replace the placeholder.

## Environment variables

See [`.env.example`](.env.example). `PUBLIC_GA4_ID` enables Google Analytics (off by default; the CSP allows analytics origins only on pages that load it). `PUBLIC_NOINDEX=true` is set automatically on Netlify preview deploys.

## Ownership

Every account (domain, GitHub, Netlify, Google Analytics/Search Console) is created in STARS Academy's name. There are no proprietary builders, theme licenses or hidden dependencies.
