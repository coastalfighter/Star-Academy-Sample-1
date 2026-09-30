# 04 — Platform recommendation

## Recommendation

**A static site built with Astro, content edited through Decap CMS, hosted on Netlify. Every account is owned by STARS.**

## Why this fits STARS

| Need | How this setup meets it |
|---|---|
| **Staff can maintain it** | Staff log in at `/admin` to a simple web editor: job postings (open/close with one click), FAQs, service page text and photos. Layout can't be broken from the editor. |
| **STARS owns everything** | The code and content live in STARS' GitHub account, hosting is on STARS' Netlify account, and analytics are on STARS' Google account. There's no proprietary builder or theme license, and any developer can take it over. |
| **Security** | No database, no server-side code and no plugins to patch. Pages are plain HTML files. That removes the WordPress-plugin attack surface entirely. There's a per-page hashed Content Security Policy, HSTS, and no inline script execution. |
| **Performance** | The whole site ships about 12 KB of JavaScript in total (navigation, forms, reveal). Pages are 25–75 KB of HTML (about 12–15 KB compressed), compared with 400–520 KB of HTML per page plus the runtime on the current Wix site. Fonts are self-hosted. That keeps the site fast on rural mobile connections. |
| **Forms** | Netlify Forms: submissions are stored in STARS' dashboard and emailed to staff, with a honeypot, a timing check and built-in Akismet spam filtering. No third-party form vendor. |
| **SEO** | Full control of titles, descriptions, canonicals, schema, sitemap and redirects. Generated at build time and tested in CI. |
| **Cost** | Netlify's free or low tier plus the domain. Decap CMS is open source. There are no per-seat or plugin fees. |
| **Longevity** | Content is Markdown/JSON in git, which is the most portable format there is. Every edit is versioned and reversible. |

## Trade-offs, stated honestly

- **Structural changes need a developer.** Adding a new page type or rearranging a layout is code work. That's intentional: it keeps the design system intact. Everyday content (jobs, FAQs, service text, announcements) doesn't need a developer.
- **Edits take about 1–2 minutes to go live** (the site rebuilds on each save), not instantly.
- **If STARS strongly prefers WordPress** (for example, staff already know it), the same design system can be built as a lean custom block theme with no page builder, 3–5 vetted plugins, managed hosting (WP Engine/Kinsta) and automatic updates. We'd budget for that plus ongoing plugin/security maintenance. We don't recommend Wix/Squarespace templates: they can't meet the design, accessibility and performance bar in the brief.

## Accounts STARS should own (created in STARS' name, with the developer as a collaborator)

- Domain registrar (`mystarsacademy.org`), with 2FA enabled
- GitHub organization/repository
- Netlify team (hosting, forms, deploy history)
- Google Analytics 4 property and Google Search Console
- Google Business Profile for each facility
- Photography: raw and edited files, plus signed releases, stored in STARS' drive
