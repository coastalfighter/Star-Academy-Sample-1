# 07 — Temporary hosting on Vercel

The site can be hosted on Vercel for client review. Netlify remains the recommended production host (see `04-platform-recommendation.md`); nothing in the Vercel setup changes that.

## Deploy (about 3 minutes, in the Vercel dashboard)

1. **Add New… → Project → Import** the GitHub repository `coastalfighter/Star-Academy-Sample-1`.
2. Framework preset: **Astro** (detected). Build command, output directory and Node version come from `vercel.json` and `package.json` (`engines.node: 22.x`), so leave the defaults.
3. Optional, to receive real form submissions: add an environment variable `PUBLIC_FORM_ENDPOINT` pointing to an https form backend STARS owns (for example, a Formspree form URL). Without it, forms run in preview mode (see below).
4. **Deploy.** Every later push to the branch redeploys automatically.

To deploy a branch other than `main` to production, set it under **Settings → Git → Production Branch**, or just share the preview URL Vercel creates for the branch.

## How the Vercel deploy behaves

| Area | On Vercel |
|---|---|
| URLs & redirects | `vercel.json` enables clean URLs (`/careers`) and mirrors every 301 from `src/lib/redirects.ts`. A unit test keeps the two in sync; after editing redirects, run `npm run vercel:config`. |
| Security headers | Same as Netlify (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy), plus the per-page hashed CSP built into every page. |
| Search engines | Every response carries `X-Robots-Tag: noindex, nofollow`, so the temporary host never competes with mystarsacademy.org. Canonical URLs still point to the real domain. |
| Forms | Netlify Forms don't exist on Vercel. With no `PUBLIC_FORM_ENDPOINT`, forms automatically switch to **preview mode**: a visible notice says nothing will be sent and gives the phone number, and "submitting" shows a "Preview only" confirmation. With an endpoint set, submissions go there, and the CSP allows that one origin on form pages only. |
| CMS (`/admin`) | Login uses Netlify's GitHub OAuth, so it's unavailable on Vercel. Edit content in `src/content/` through GitHub instead. |

## Moving to production later

Deploy the same repository to Netlify (production), point the domain there, and delete the Vercel project. If STARS decides to stay on Vercel instead: remove the `X-Robots-Tag` entry in `src/lib/vercel.ts`, run `npm run vercel:config`, and set `PUBLIC_FORM_ENDPOINT`.
