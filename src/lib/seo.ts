import { SITE, LOCATIONS } from './site';
import { stripConfirm } from './confirm';

export const DEFAULT_DESCRIPTION =
  'STARS Academy in Batesville, Arkansas brings speech, occupational and physical therapy, nursing care and developmental classrooms together in one full day for children from birth to age six.';

const TITLE_SUFFIX = 'STARS Academy';
const MAX_TITLE = 65;

/** "Page | STARS Academy", or a custom full title for the home page. */
export function buildTitle(title?: string): string {
  if (!title) return `${TITLE_SUFFIX} | Pediatric Therapy & Developmental Preschool in Batesville, AR`;
  const full = `${title} | ${TITLE_SUFFIX}`;
  return full.length <= MAX_TITLE ? full : title;
}

export function cleanDescription(text: string, max = 160): string {
  const clean = stripConfirm(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function absoluteUrl(path: string, site: string | URL): string {
  return new URL(path, site).toString();
}

type JsonLd = Record<string, unknown>;

export function organizationSchema(site: string | URL): JsonLd {
  const main = LOCATIONS[0]!;
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'ChildCare'],
    '@id': absoluteUrl('/#organization', site),
    name: SITE.name,
    legalName: SITE.legalName,
    slogan: SITE.acronym,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl('/', site),
    logo: absoluteUrl('/brand/stars-logo-full-color.jpg', site),
    image: absoluteUrl('/og/default.png', site),
    telephone: `+1-${SITE.phone}`,
    foundingDate: String(SITE.founded),
    medicalSpecialty: ['Pediatric', 'SpeechPathology', 'PhysicalTherapy'],
    availableService: [
      { '@type': 'MedicalTherapy', name: 'Speech-language therapy' },
      { '@type': 'MedicalTherapy', name: 'Occupational therapy' },
      { '@type': 'MedicalTherapy', name: 'Physical therapy' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: main.street,
      addressLocality: main.city,
      addressRegion: main.region,
      postalCode: main.postalCode,
      addressCountry: 'US',
    },
    areaServed: { '@type': 'State', name: 'Arkansas' },
    openingHours: SITE.hours.schema,
    sameAs: Object.values(SITE.social),
    knowsLanguage: ['en', 'es'],
  };
}

export interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbSchema(crumbs: Crumb[], site: string | URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href, site),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLd | null {
  // Questions whose answers are still unconfirmed are excluded from rich results.
  const ready = items.filter((i) => !/CLIENT TO CONFIRM/.test(i.answer));
  if (ready.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ready.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}
