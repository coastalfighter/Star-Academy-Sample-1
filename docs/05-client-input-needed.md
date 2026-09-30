# 05 — Information needed from STARS

We didn't invent any clinical claims, statistics, policies, testimonials, staff names or credentials. Wherever we need information from STARS, the site shows a visible teal **[Client to confirm: …]** marker. For the live list at any time, run:

```bash
npm run placeholders           # list every remaining marker by file
node scripts/list-placeholders.mjs --strict   # exits non-zero if any remain (use before launch)
```

## Grouped checklist

### Contact & locations
- [ ] STARS Academy South street address, and what's offered at each facility
- [ ] Main fax number and referral fax number (or secure e-fax/portal)
- [ ] General email inbox, plus direct emails for enrollment, referrals, current families and HR

### Enrollment & eligibility
- [ ] Who completes developmental evaluations, and how they're scheduled
- [ ] Whether STARS requests the prescription from the physician for the family
- [ ] Whether private insurance is accepted, and any out-of-pocket costs
- [ ] Typical time from first call to first day, and whether there's a waitlist
- [ ] Whether summer services are offered for school-age children
- [ ] Classroom age groupings and class sizes
- [ ] How teachers communicate with families (daily notes, app, conferences)

### Therapy & nursing
- [ ] Typical session length and frequency (speech, OT, PT)
- [ ] How often progress is reviewed with families and reported to physicians
- [ ] Health forms and physician orders required at enrollment and for medication changes
- [ ] Illness/exclusion policy

### Transportation
- [ ] Who's eligible, the service area, pick-up/drop-off windows, and how to request or change routes

### Current families
- [ ] How weather/emergency closures are announced
- [ ] Holiday closure calendar
- [ ] Absence reporting process
- [ ] Parent handbook and forms (PDF)
- [ ] Kindergarten transition timeline; partner school districts

### Referral partners
- [ ] Referral packet / prescription form (PDF)
- [ ] Format and frequency of progress reports to physicians

### Careers
- [ ] Which clinical roles are open, and licensure requirements
- [ ] Benefits (health, PTO, CEUs, schedule)
- [ ] Interview steps and hiring timeline
- [ ] 1–2 staff quotes (with permission)

### People, story & proof
- [ ] Founder story and key milestones
- [ ] Leadership and clinical-lead names, titles, credentials and portraits
- [ ] 2–4 family testimonials, with **written permission**
- [ ] Review of the Approach page wording and examples by STARS leadership
- [ ] Confirmation of the current figures: ~85 staff, ~140 children

### Legal & compliance
- [ ] Complete USDA nondiscrimination statement from STARS' sponsoring agency
- [ ] Legal/compliance review of the website privacy notice
- [ ] Link to STARS' HIPAA Notice of Privacy Practices
- [ ] Hosting provider and retention period for form data

### Photography
- [ ] Professional one- or two-day photo shoot using the shot briefs embedded in each photo placeholder
- [ ] Signed photo releases for every child and staff member pictured

### Accounts (STARS-owned)
- [ ] GitHub repository (update `repo` in `public/admin/config.yml`)
- [ ] Netlify team, Google Analytics 4 ID, Search Console, Google Business Profiles
