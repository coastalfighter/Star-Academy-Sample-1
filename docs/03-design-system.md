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

Subtle, calm and always optional. All motion lives in `src/styles/global.css` (the "Motion system" block) and `src/scripts/reveal.ts`.

| Effect | Where | Details |
|---|---|---|
| Word-by-word rise | Every page H1 (`AnimatedTitle`) | 800ms per word, 55ms stagger, slight blur-to-sharp |
| Gold highlight draw | Italic accent words in H1/H2 | A soft marker stroke draws in on load (H1) or when scrolled into view (H2) |
| Photo reveal | All photos | Gentle wipe and fade while the image settles from a 1.08 zoom |
| Fade-up reveal | Sections, cards, list items | 700ms ease-out with stagger via `--reveal-delay` |
| Count-up | Trust statistics | Counts from 0 over 1.4s; the real number is in the HTML |
| Timeline draw | "A day at STARS" | The line grows as it scrolls into view (scroll-driven CSS where supported) |
| Organic shapes | Behind hero and visit photos | Brand-tinted blobs morph over 18–20s |
| Twinkling stars | Heroes, key sections | 4-point brand stars fade in and out on a 5.5s cycle |
| Float | Hero care-team card | 8px drift over 7s |
| Hover | Cards, service rows, icons | 4px lift with a soft shadow; icon chips tilt and reshape |

**Guardrails:**
- `prefers-reduced-motion` disables everything.
- Content is fully visible without JavaScript, with a safety net that applies only if the motion script fails to load.
- There's no parallax, bouncing or autoplay.
- Only `transform`, `opacity`, `clip-path` and `background-size` are animated, which keeps it smooth and avoids layout shift.

## Scroll-driven 3D

`src/scripts/scroll3d.ts` is a ~2 KB engine that writes scroll progress into CSS variables (`--pe` entry, `--p` pass-through, `--px` exit, `--ps` sticky). `src/styles/depth.css` turns those into perspective transforms. There's one passive scroll listener, work is batched to one frame at a time, and only elements near the viewport are measured.

| Effect | Where |
|---|---|
| **Care wheel**: the five services on a 3D ring that turns one service per scroll step inside a sticky stage, highlighting the card facing you | Home (`home/CareRing.astro`) |
| **Hero depth**: the photo stack tilts back and its layers (tinted shape, photo, care card, inset photo) separate along the Z axis as the page scrolls | Home and every inner-page hero |
| **Flip-up cards**: hinged at the bottom edge | "What STARS is", stats, approach ideas, process steps, values, jobs, eligibility |
| **Swing-in**: rotates in from the side | Day timeline, pathway steps, service "signs" and "provides" lists, referral/careers pair, next-step links |
| **S·T·A·R·S blocks**: 3D toy blocks drop in one by one and settle, spelling the acronym | Home "Our name is our promise" band, About |
| **Extruded 3D star**: the gold star turns as you scroll | Home approach section |
| **Heartbeat → star line**: draws itself on scroll | Home divider, footer |
| **Depth parallax** | Day-at-STARS photo, visit photo |

**Guardrails:**
- Every rule is gated on `.has-3d`, which is added only when JavaScript runs and the visitor hasn't asked for reduced motion.
- Without it, every element renders in its final static state. The care wheel becomes an ordinary grid of five linked cards.
- Only `transform` and `opacity` animate (no layout shift).
- Cards turned away on the wheel stop receiving pointer events.
- Accessibility audits run against the at-rest state.
- `tests/e2e/motion3d.spec.ts` covers the wheel, card settling and the reduced-motion fallback.

### Hero scroll story

On desktop (≥ 60em wide and ≥ 46em tall), the homepage hero is wrapped in a `.hero-track` about 195vh tall, and the hero sticks in place while the visitor scrolls through it (`data-3d-track="sticky"` → `--ps`). As they scroll:

1. The photo rig swings into 3D (rotateY/rotateX).
2. Five care-discipline chips orbit out from behind the photo: speech, OT, PT, nursing and classroom.
3. The headline drifts up and eases to about 70% opacity (never lower, so the CTAs never look disabled).
4. The hero scales down slightly with rounded corners, then hands off to the page.

On smaller or shorter screens there is no pin; the hero gets only a light exit tilt. With reduced motion, the layout stays static and everything is visible.

## Hover & interaction layer

`src/scripts/tilt.ts` + `src/styles/hover.css`. Hover effects apply only on `(hover: hover) and (pointer: fine)` devices and are switched off for reduced motion. Keyboard focus gets an equivalent lift via `:focus-within`.

- **3D pointer tilt with glare** (`data-tilt`): up to 7° toward the cursor, with a soft light sheen. Used on stat cards, eligibility cards, job cards, contact shortcuts, the "What it can look like" panels, service "Who it's for" panels, the family pathway and partner panels. Photos opt in with `<Photo tilt />`.
- **Buttons**: primary buttons get a light sheen sweep; secondary buttons fill with navy (white on navy sections).
- **Photos**: a gentle 4.5% zoom inside the frame.
- **Links**: sliding underlines; `.link-arrow` grows its red rule.
- **Details**: FAQ rows tint and indent; footer links nudge right; social icons turn gold; audience-router cards get a gradient wash; duo-icon chips bob and rotate.

Don't combine `.lift` with `data-tilt`, because `.lift:hover` overrides the tilt transform.

## Graphics

- **Duotone icon set** (`graphics/DuoIcon.astro`, 22 icons): a crisp brand-colored line over a soft tinted fill, optionally on an organic "chip". Every service has one consistent icon (`src/lib/service-icons.ts`): blocks for classrooms, speech bubbles for speech, a hand and block for OT, footsteps for PT, and a heart with a cross for nursing. Neurodiversity uses an infinity loop rather than a puzzle piece, which many autistic people find offensive.
- **Care diagram** (`graphics/CareVenn.astro`): classroom, therapy and nursing overlap around "your child". The circles bloom in and the dashed orbit turns slowly.
- **Brand stars** (`graphics/Sparkles.astro`) echo the gold star in the STARS logo.
- The style stays line-based and restrained so it reads as healthcare-credible, not childish.

- **S·T·A·R·S blocks** (`graphics/StarsBlocks.astro`): the brand acronym as CSS-3D toy blocks, since building blocks are how young children grow.
- **Heartbeat → star** (`graphics/HeartbeatLine.astro`): a pulse trace that becomes a gentle wave and then the STARS star, joining clinical care and childhood in one line.
- **3D star** (`graphics/Star3D.astro`): the logo star extruded with stacked layers.
- **Care pattern** (`.pattern-care`): tiny medical crosses alternating with STARS sparkles, masked to fade out, behind heroes and navy sections.
- **Surfaces**: sand, white and navy sections carry soft teal/gold/red radial tints for depth instead of flat fills.

## Photography direction

Documentary, natural light, at the child's eye level. Real STARS children, staff and families in real moments: therapy, classroom play, nurses at work, staff together. No stock photography, posed rows, clip-art children or rainbow overlays. Every photo slot carries a specific shot brief, which doubles as the **shot list** for a one- or two-day professional shoot (with signed photo releases). Until then, slots use carefully matched temporary Pexels photos; see `08-photography.md`.

## Logo recommendation

The master full-color logo is preserved and used on the About page. For digital use, the header carries an **interim horizontal lockup** (gold star + typeset wordmark), because the master logo's stacked, illustrated composition is illegible at header size. We recommend a small follow-on engagement to produce an official simplified horizontal lockup and a favicon mark. That's a refinement of the current identity, not a rebrand.
