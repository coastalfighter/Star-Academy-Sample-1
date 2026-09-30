# 02 — Strategy: audiences, architecture, journeys, messaging

## The one-sentence goal

> The new site has to make an organization that's hard to describe instantly understandable, and send each audience (families, physicians, schools, job seekers, current families) to its next step within seconds.

## Positioning & messaging hierarchy

| Level | Message |
|---|---|
| **What we are** | Therapy, learning and care for young children, woven into one full day. |
| **What makes us different** | Not a daycare. Not a therapy clinic. Both, working as one: *one day, one plan, one team.* |
| **How we work** | Children learn best when they feel safe, connected and understood, so that's where we start (Conscious Discipline, Adult First, sensory-informed, neuroaffirming). |
| **Proof** | Since 2009 · ~85 staff · ~140 children · full-time licensed nurses · Spanish-language speech therapy · two Batesville facilities |
| **Invitation** | See if STARS is right for your child · Come see for yourself |

**Voice:** warm, plain, confident. Short sentences. We explain terms once, in everyday words. We don't use exclamation marks, cute wordplay or clinical jargon without a translation.

## Final sitemap

```
/                              Home
├── /approach                  Our Approach (NEW)
├── /services                  Services hub (replaces /what-we-do)
│   ├── /classrooms            Developmental Classrooms   (URL kept)
│   ├── /speech-therapy        Speech Therapy             (URL kept)
│   ├── /occupational-therapy  Occupational Therapy       (URL kept)
│   ├── /physical-therapy      Physical Therapy           (URL kept)
│   └── /nursing               Nursing Care               (URL kept)
├── /getting-started           Eligibility, funding, steps, inquiry (replaces /enroll-now)
├── /schedule-a-tour           Tour request                (URL kept)
├── /referrals                 For Referral Partners (NEW)
├── /careers                   Careers (replaces /general-8)
│   └── /careers/apply         Apply (replaces /apply-now)
├── /about-us                  About                       (URL kept)
├── /families                  Current Families (NEW; absorbs /walk)
├── /faq                       FAQ (NEW)
├── /contact-us                Contact                     (URL kept)
├── /privacy · /accessibility · /nondiscrimination   (NEW)
└── /thank-you · /404          Utility (noindex)
```

**Why service URLs stay at the root:** they already rank, they're short and descriptive, and nesting them under `/services/` would cost a redirect hop for no user benefit. Breadcrumbs still show *Home › Services › Speech Therapy*, so the hierarchy is clear.

## Navigation

- **Primary (intent-based):** Our Approach · Services ▾ · Getting Started · For Referral Partners · Careers · About
- **Utility bar:** Current Families · FAQ · Contact · phone
- **Persistent CTA:** *Schedule a Tour* (the single highest-value, lowest-commitment action for families)
- **Mobile:** full-screen panel with a focus trap, service sub-links visible, and CTA + tap-to-call pinned at the bottom.

## User journeys

**1 · Parent discovering STARS**
Home hero (what/who/why) → "Find your way: Explore STARS for my child" → *Getting Started* (fit checklist → 3 eligibility criteria → funding → 5 steps) → inquiry form **or** tour. Any service page links back to *See if your child qualifies*.

**2 · Physician / referral source**
Home router "Refer a child", or the *For Referral Partners* nav item → at-a-glance panel (ages, services, funding, prescription requirement, languages, hours) → criteria → 4-step referral path → clinical scope (expandable, per discipline) → call-back form that deliberately collects **no PHI**.

**3 · Prospective employee**
Home "Work at STARS" / Careers nav → why STARS (interdisciplinary team, whole-day context, Adult First culture) → open roles with requirements → *Apply* (short form + résumé, then the existing official Adobe Sign application). Arriving from a job listing preselects the position.

**4 · Current family**
Utility bar "Current Families" → announcements → jump links (hours & closures, absences, transportation, health & medications, kindergarten transition, resources, who to contact).

**5 · Community member**
Home: hero + "Not a daycare. Not a clinic." + "A day at STARS" explain the model in under 20 seconds of scanning.

## Homepage sequence (and why)

1. **Hero:** answers what / who / why different / what next above the fold.
2. **Audience router:** every audience finds its door immediately.
3. **What STARS is:** defines us by contrast with categories people already know.
4. **A day at STARS:** makes the abstract model concrete.
5. **Services:** a scannable editorial index, not a card grid.
6. **Approach:** the philosophy in plain language (a navy section for a change of pace).
7. **Family pathway:** a fit checklist plus the four steps to start.
8. **Credibility:** facts, then real family voice (placeholder).
9. **Referral partners + careers:** secondary audiences.
10. **Visit:** the most persuasive action, with address and hours.

## CTA strategy

| Tier | CTA | Where |
|---|---|---|
| Primary (families) | **See if STARS is right for your child** → /getting-started | Hero, service pages, pathway |
| Primary (always visible) | **Schedule a Tour** | Header, mobile menu, closing sections |
| Audience-specific | Refer a child · Apply now · Find family information | Router, audience pages |
| Tertiary | Text links with arrows ("How our services fit together") | In-content |

Rule: at most **one filled button and one outline button** per section. Every page ends in a *Next step* band with one primary action and up to three contextual links, so there are no dead ends.

## Content decisions

- **Rewritten, not pasted:** every service page answers the same eight questions in the same order (what is it, who is it for, why a child might need it, what STARS provides, how it works, what to expect, how it connects, next step).
- **Jargon translated:** "sensory processing", "regulation", "neuroaffirming" and "Adult First" are each explained once, in plain words, with examples.
- **Clinician detail preserved but tucked away:** diagnosis and method lists sit in "For physicians & referral partners" disclosures, so parents aren't overwhelmed.
- **Nothing invented:** anything we couldn't verify is shown as a visible **[Client to confirm: …]** marker (see `05-client-input-needed.md`).
