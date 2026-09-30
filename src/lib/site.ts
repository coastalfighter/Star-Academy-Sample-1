/**
 * Single source of truth for organization facts used across the site.
 *
 * Every value below is taken from STARS Academy's current website
 * (mystarsacademy.org, reviewed Sept 2026) or the client's project brief.
 * Anything we could not verify is `null` and renders as a visible
 * "CLIENT TO CONFIRM" marker — never a guess.
 */

export interface Location {
  id: string;
  name: string;
  street: string | null;
  city: string;
  region: string;
  postalCode: string | null;
  note?: string;
}

export interface Contact {
  label: string;
  purpose: string;
  phone: string | null;
  email: string | null;
}

export const SITE = {
  name: 'STARS Academy',
  legalName: 'MKJD, LLC dba STARS Academy',
  acronym: 'Striving To Achieve Real Success',
  descriptor: 'Pediatric developmental day treatment',
  founded: 2009,
  city: 'Batesville',
  region: 'Arkansas',
  regionCode: 'AR',
  ages: 'birth to age six',
  phone: '870-793-3200',
  phoneHref: 'tel:+18707933200',
  fax: null as string | null,
  email: null as string | null,
  hours: {
    days: 'Monday – Friday',
    open: '7:00 a.m.',
    close: '3:00 p.m.',
    schema: 'Mo-Fr 07:00-15:00',
  },
  // Figures supplied by STARS in the project brief (approximate).
  staffCount: 85,
  childrenServed: 140,
  social: {
    facebook: 'https://www.facebook.com/mystarsacademy/',
    instagram: 'https://www.instagram.com/mystarsacademy/',
  },
  // Existing Adobe Sign workflows currently linked from the live site.
  // Kept so the redesign does not break STARS' current intake process.
  externalForms: {
    enrollmentPacket:
      'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhACX2ZpXOJn_gHX7sIR_bcsOkK9_GYNEDGClHSud3fLZXWrK1COPp9ZxumVs-XZ7Gg*',
    employmentApplication:
      'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCMwQ2jnd6xwJVEtTjA4cAO3e9AMU9yotSxgFUvjDH89-se2zjb3BVDgbtudWBzcEo*',
  },
  funding: ['Medicaid', 'ARKids First-A', 'SSI', 'TEFRA'],
} as const;

export const LOCATIONS: Location[] = [
  {
    id: 'main',
    name: 'STARS Academy',
    street: '200 General St.',
    city: 'Batesville',
    region: 'AR',
    postalCode: '72501',
  },
  {
    id: 'south',
    name: 'STARS Academy South',
    street: null,
    city: 'Batesville',
    region: 'AR',
    postalCode: null,
    note: 'Second campus',
  },
];

/** Department routing for the Contact page. Phone defaults to the main line. */
export const CONTACTS: Contact[] = [
  {
    label: 'New families & enrollment',
    purpose: 'Questions about eligibility, tours and getting started.',
    phone: SITE.phone,
    email: null,
  },
  {
    label: 'Physicians & referral partners',
    purpose: 'Referrals, prescriptions and care coordination.',
    phone: SITE.phone,
    email: null,
  },
  {
    label: 'Current families',
    purpose: 'Attendance, transportation and day-to-day questions.',
    phone: SITE.phone,
    email: null,
  },
  {
    label: 'Careers & human resources',
    purpose: 'Open positions, applications and interviews.',
    phone: SITE.phone,
    email: null,
  },
];

export function fullAddress(loc: Location): string | null {
  if (!loc.street) return null;
  return `${loc.street}, ${loc.city}, ${loc.region}${loc.postalCode ? ` ${loc.postalCode}` : ''}`;
}

export function mapsUrl(loc: Location): string | null {
  const addr = fullAddress(loc);
  return addr ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name}, ${addr}`)}` : null;
}
