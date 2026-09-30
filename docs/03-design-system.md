# 03 — Design system

**Concept:** *a sophisticated developmental organization that happens to serve children.* The look is editorial and warm: generous paper-white space, a confident serif and restrained brand color, with real photography doing the emotional work. Tokens live in `src/styles/tokens.css`; base styles and primitives are in `src/styles/global.css`.

## Color

Derived from the existing logo (navy wordmark, red "Academy", gold star) and the teal already used on the current site. Brand hues are deepened and slightly desaturated, so they read as calm and credible rather than as a primary-color "kids" palette.

| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#17153a` | Headings, dark sections, primary buttons |
| `--navy-800` | `#221f55` | Brand navy (logo), button fill |
| `--red-700` | `#a3242c` | Accent text: italic emphasis, eyebrows (text-safe) |
| `--red-600` | `#c4323a` | Brand red: rules, icons, list markers |
| `--gold-400` | `#f2c230` | Brand star: the mark, highlights on navy (never text on light) |
| `--gold-700` | `#8a6408` | Text-safe gold for numerals on light backgrounds |
| `--teal-600` | `#2e7a8c` | Focus rings, placeholder markers (legacy site teal) |
| `--paper` | `#fbf8f3` | Page background (warm, not clinical white) |
| `--sand-100/200/300` | `#f5efe5` … | Alternating sections, hairlines |
| `--ink-900/700/600` | `#1c1a33` … | Body, secondary and tertiary text |

Every text/background pairing meets WCAG AA; automated axe checks run on every page in CI. Color is used by **role**, not by section: we never rotate a different bright color per section.

## Typography

- **Display:** *Fraunces* (variable, optical size). It's a warm, slightly soft serif that echoes the decorative serif in the STARS logo without copying it. Italic in brand red is the signature emphasis.
- **Body/UI:** *Figtree* (variable). A friendly, highly legible humanist sans with generous x-height for mobile reading.
- Both are self-hosted (no Google Fonts request, no third-party tracking), subset by unicode-range, and loaded with `font-display: swap`.
- **Fluid scale** (`--step--1` … `--step-5`) runs from 320px to 1440px with no breakpoints needed. Body text is 17–19px at a 1.65 line height, with a ~38em measure.

## Space & layout

- Fluid space scale `--space-3xs` … `--space-3xl`. Sections breathe at `--space-2xl`.
- Container: 76rem, with a fluid gutter of 16px (mobile) to 40px.
- Asymmetric editorial splits (0.8fr / 1.2fr) are preferred over equal card grids.

## Components (`src/components`)

| Component | Purpose |
|---|---|
| `Header` | Utility bar, primary nav with an accessible Services disclosure menu, persistent CTA, mobile dialog panel with focus trap |
| `Footer` | Brand, locations/hours, grouped nav, USDA notice, legal, social |
| `Logo` | Interim horizontal digital lockup (gold star + wordmark) |
| `PageHero` | Breadcrumbs, eyebrow, H1 with italic accent, lede, actions, photo or aside |
| `Photo` | Art-directed photo slot; renders a labeled placeholder carrying the shot brief until real photography is added |
| `Steps` | Numbered process with editorial numerals |
| `Faq` | Native `<details>` accordion (no JS, searchable with find-in-page) |
| `NextSteps` | End-of-page next-step band: one primary action plus contextual links |
| `Confirm` / `Rich` | Visible client-to-confirm markers; safe rendering of CMS text with smart quotes |
| `forms/*` | `Form` shell (validation, honeypot, AJAX, success state), `Field`, and five purpose-built forms |
| `home/*` | Ten homepage sections, each a single-purpose component |

## Buttons & links

- **Primary:** navy fill, 4px radius (deliberately not pill-shaped), 48px minimum height, arrow nudges on hover.
- **Secondary:** navy outline. On navy sections, the buttons invert to paper and gold hover.
- **Tertiary:** `link-arrow` (underlined text plus arrow).
- **Focus:** a 3px teal ring, offset from the element, and always visible on keyboard focus.

## Motion

- Content fades up gently once (`[data-reveal]`, 700ms ease-out) as it enters the viewport.
- Hovers use 160–320ms transitions on color and small translations only.
- There's no parallax, bounce or autoplay.
- `prefers-reduced-motion` disables all motion, and content is never hidden if JavaScript fails (there's a 2.5s safety net).

## Photography direction

Documentary, natural light, at the child's eye level. Real STARS children, staff and families in real moments: therapy, classroom play, nurses at work, staff together. No stock photography, posed rows, clip-art children or rainbow overlays. Every photo slot carries a specific shot brief, which doubles as the **shot list** for a one- or two-day professional shoot (with signed photo releases). Until then, slots use carefully matched temporary Pexels photos; see `08-photography.md`.

## Logo recommendation

The master full-color logo is preserved and used on the About page. For digital use, the header carries an **interim horizontal lockup** (gold star + typeset wordmark), because the master logo's stacked, illustrated composition is illegible at header size. We recommend a small follow-on engagement to produce an official simplified horizontal lockup and a favicon mark. That's a refinement of the current identity, not a rebrand.
