# 01 — Discovery: audit of the current website

**Site reviewed:** https://www.mystarsacademy.org (September 2026)
**Platform:** Wix (Thunderbolt renderer); 14 URLs in `pages-sitemap.xml`

## Current sitemap

| URL | Page | Notes |
|---|---|---|
| `/` | Home | Logo, one sentence, "We are family" story, USDA statement |
| `/what-we-do` | What We Do | Menu heading only: a list of five service names and no content |
| `/physical-therapy` | Physical Therapy | Useful clinical detail (gym, orthotics, adaptive equipment) |
| `/occupational-therapy` | Occupational Therapy | Skill list, sensory integration mention |
| `/speech-therapy` | Speech Therapy | Richest page: diagnoses, Spanish services, evidence-based methods |
| `/classrooms` | Classrooms | Play-based learning, kindergarten transition |
| `/nursing` | Nursing | Strong: full-time licensed nurses, list of conditions |
| `/walk` | Videos | **Empty.** Meta description says "under construction" |
| `/about-us` | About Us | Vision and five values |
| `/contact-us` | Contact Us | Phone and a three-field form (name, email, message) |
| `/general-8` | Career Opportunities | Four roles. Auto-generated Wix slug. No meta description |
| `/apply-now` | Apply Now | Form, then a link to an Adobe Sign application |
| `/schedule-a-tour` | Schedule a Tour | Name/email/phone/date form |
| `/enroll-now` | Enroll Now | Funding and eligibility criteria, then an Adobe Sign link |

## Verified facts carried into the new site

Founded 2009 · locally owned and operated · two facilities (the second listed publicly as "STARS Academy South") · 200 General St., Batesville, AR · 870-793-3200 · open Monday–Friday 7 a.m.–3 p.m. · full-time licensed nurses · speech evaluations and therapy offered in Spanish · speech serves infancy through age 6 · funding: Medicaid incl. ARKids A, SSI, TEFRA · eligibility: active insurance, qualifies in Developmental plus at least one of speech/OT/PT/nursing, PCP prescription · clinic vans transport children (known only from the job descriptions) · USDA nondiscrimination statement · Facebook and Instagram · vision, five values and the "Striving To Achieve Real Success" acronym.

The client's brief adds: ~85 employees, ~140 children, and the philosophy (Conscious Discipline, Adult First, sensory-informed, neuroaffirming).

## What's not working

1. **The site never says what STARS is.** The home page has one sentence ("Even more important than … teaching a child is loving a child"). The only definition ("therapy clinic and developmental preschool") is buried in the About copy. A new visitor can't tell whether this is a daycare, a school or a clinic.
2. **The philosophy is missing.** Conscious Discipline, Adult First, sensory-informed and neuroaffirming care are central to the organization, but none of them appear anywhere on the site.
3. **No path for most audiences.** Physicians, school districts and current families have no page. Careers is hidden under "More" at a meaningless URL (`/general-8`).
4. **"Enroll Now" asks for commitment before understanding.** Eligibility, prescription requirements and funding are compressed into three bullets and then an external Adobe form.
5. **Key facts are hidden.** Transportation only appears inside a van-driver job description. Spanish-language services appear only on the speech page.
6. **Every service page ends the same way:** "give us a call or fill out our form under Contact Us!" There is no next step tailored to the reader.
7. **Technical/SEO:**
   - Three pages have no meta description, and one meta description has typos.
   - The heading hierarchy is inconsistent (an `<h5>` is used as a form title, some pages have no `<h1>`).
   - Images mostly have empty or filename alt text ("IMG_5906.jpg").
   - Each page carries about 450–520 KB of HTML, plus Wix runtime JavaScript.
   - The contact form collects no phone number, has no topic routing, and says nothing about what happens next.
8. **Visual:** the site uses generic Wix skins, mixes 6+ font families (Raleway, Futura, Libre Baskerville, Lulo, Didot, DIN, Proxima), uses low-resolution social-media photos, and has no consistent hierarchy.

## What should stay

- The **brand**: navy, red and gold star, the STARS name and acronym, and the registered mark.
- The **facts and clinical detail** on the service pages (rewritten, not deleted).
- **Vision and values** (STARS' own words, kept verbatim).
- **High-ranking URLs** for services, tour, about and contact (kept exactly).
- The **Adobe Sign** enrollment and employment workflows (kept as step two, so HR/intake processes don't break).
- The **USDA statement** (kept in the footer, with a full page).

## What should go / be combined / be added

| Action | Item |
|---|---|
| Remove | Empty `/walk` "Videos" page (301 → `/families`) |
| Remove | `/what-we-do` as a menu-only page (301 → a real `/services` hub) |
| Rename | `/general-8` → `/careers` · `/apply-now` → `/careers/apply` · `/enroll-now` → `/getting-started` |
| Combine | Eligibility + funding + process + inquiry → **Getting Started** |
| Add | **Our Approach** (the philosophy in plain language) |
| Add | **For Referral Partners** (criteria, clinical scope, no-PHI referral form) |
| Add | **Current Families** hub · **FAQ** · **Privacy** · **Accessibility** · full **Nondiscrimination** page |
| Add | A "day at STARS" explainer, a trust/credibility section and real photography direction |

## Comparable-site principles applied

We didn't copy any site. These patterns show up across well-regarded children's hospitals, pediatric therapy networks and developmental nonprofits, and we used them as principles:

- The first screen says **what, for whom and what next** in plain language, not a slogan.
- **Audience routing** sits right under the hero ("I'm a parent / physician / job seeker").
- Service pages follow a **consistent question-led template**, so visitors can compare services.
- **Referral pages are written for busy clinicians:** facts at a glance, criteria and one clear way to refer.
- The organization's **philosophy is explained with examples**, not buzzwords.
- **Real photography** does the emotional work; illustration and color stay restrained.
