import { describe, expect, it } from 'vitest';
import { breadcrumbSchema, buildTitle, cleanDescription, faqSchema, organizationSchema } from '@/lib/seo';

const site = 'https://www.mystarsacademy.org';

describe('buildTitle', () => {
  it('uses a keyword-rich default for the home page', () => {
    expect(buildTitle()).toMatch(/^STARS Academy \| .*Batesville, AR$/);
  });
  it('appends the brand when it fits', () => {
    expect(buildTitle('Careers')).toBe('Careers | STARS Academy');
  });
  it('drops the suffix instead of exceeding the length budget', () => {
    const long = 'A very long page title that would push the brand suffix past the limit';
    expect(buildTitle(long)).toBe(long);
  });
});

describe('cleanDescription', () => {
  it('strips confirm markers and truncates on a word boundary', () => {
    const text = `${'word '.repeat(50)}[CLIENT TO CONFIRM: x]`;
    const out = cleanDescription(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toContain('CLIENT');
  });
});

describe('structured data', () => {
  it('describes the organization with local details', () => {
    const org = organizationSchema(site) as Record<string, any>;
    expect(org['@type']).toContain('MedicalClinic');
    expect(org.address.addressLocality).toBe('Batesville');
    expect(org.address.addressRegion).toBe('AR');
    expect(org.telephone).toBe('+1-870-793-3200');
    expect(org.openingHours).toBe('Mo-Fr 07:00-15:00');
  });
  it('builds absolute breadcrumb URLs', () => {
    const crumbs = breadcrumbSchema(
      [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
      ],
      site,
    ) as Record<string, any>;
    expect(crumbs.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Services',
      item: 'https://www.mystarsacademy.org/services',
    });
  });
  it('excludes unconfirmed answers from FAQ rich results', () => {
    const schema = faqSchema([
      { question: 'Q1', answer: 'Confirmed.' },
      { question: 'Q2', answer: 'Maybe [CLIENT TO CONFIRM: x]' },
    ]) as Record<string, any>;
    expect(schema.mainEntity).toHaveLength(1);
    expect(faqSchema([{ question: 'Q', answer: '[CLIENT TO CONFIRM: y]' }])).toBeNull();
  });
});
