import { describe, expect, it } from 'vitest';
import {
  digitsOnly,
  formatPhone,
  isValidEmail,
  isValidPhone,
  looksLikeSpam,
  MIN_FILL_TIME_MS,
  validateValue,
  type FieldSpec,
} from '@/lib/validation';

const spec = (over: Partial<FieldSpec> = {}): FieldSpec => ({ label: 'Email', rules: [], ...over });

describe('isValidEmail', () => {
  it.each(['parent@example.com', 'a.b+c@school.k12.ar.us', '  spaced@example.org  '])('accepts %s', (v) => {
    expect(isValidEmail(v)).toBe(true);
  });
  it.each(['', 'plain', 'no-at.example.com', 'a@b', 'a@b.c', 'two@@example.com', 'sp ace@example.com'])(
    'rejects %s',
    (v) => {
      expect(isValidEmail(v)).toBe(false);
    },
  );
});

describe('isValidPhone / formatPhone', () => {
  it.each(['870-793-3200', '(870) 793-3200', '8707933200', '+1 870 793 3200', '1-870-793-3200'])('accepts %s', (v) => {
    expect(isValidPhone(v)).toBe(true);
  });
  it.each(['793-3200', '870-793-32001', '2-870-793-3200', 'call me'])('rejects %s', (v) => {
    expect(isValidPhone(v)).toBe(false);
  });
  it('formats valid numbers consistently', () => {
    expect(formatPhone('(870) 793-3200')).toBe('870-793-3200');
    expect(formatPhone('+1 870 793 3200')).toBe('870-793-3200');
  });
  it('leaves invalid input untouched so the user can correct it', () => {
    expect(formatPhone('793-3200')).toBe('793-3200');
  });
  it('strips non-digits', () => {
    expect(digitsOnly('(870) 793-3200')).toBe('8707933200');
  });
});

describe('validateValue', () => {
  it('requires a value with a helpful, article-aware message', () => {
    expect(validateValue('', spec({ label: 'Email', rules: ['required'] }))).toBe('Please enter an email.');
    expect(validateValue('  ', spec({ label: 'Phone', rules: ['required'] }))).toBe('Please enter a phone.');
    expect(validateValue('', spec({ label: 'Your name', rules: ['required'] }))).toBe('Please enter your name.');
  });
  it('uses "choose" for selects', () => {
    expect(validateValue('', spec({ label: 'Position', rules: ['required'], verb: 'choose' }))).toBe(
      'Please choose a position.',
    );
  });
  it('skips format rules for empty optional fields', () => {
    expect(validateValue('', spec({ rules: ['email'] }))).toBeNull();
    expect(validateValue('', spec({ label: 'Phone', rules: ['phone'] }))).toBeNull();
  });
  it('validates email and phone formats', () => {
    expect(validateValue('nope', spec({ rules: ['email'] }))).toMatch(/name@example\.com/);
    expect(validateValue('123', spec({ label: 'Phone', rules: ['phone'] }))).toMatch(/10-digit/);
    expect(validateValue('870-793-3200', spec({ label: 'Phone', rules: ['required', 'phone'] }))).toBeNull();
  });
  it('enforces max length and reports the current count', () => {
    const msg = validateValue('x'.repeat(12), spec({ label: 'Message', rules: ['maxlength'], maxLength: 10 }));
    expect(msg).toContain('10 characters');
    expect(msg).toContain('currently 12');
  });
  it('validates file size and type', () => {
    const fileSpec = spec({ label: 'Résumé', rules: ['file'], maxBytes: 1_000_000, accept: ['pdf', 'docx'] });
    expect(validateValue('', fileSpec, { name: 'cv.pdf', size: 500 })).toBeNull();
    expect(validateValue('', fileSpec, { name: 'cv.exe', size: 500 })).toMatch(/\.pdf, \.docx/);
    expect(validateValue('', fileSpec, { name: 'cv.pdf', size: 2_000_000 })).toMatch(/smaller than 1 MB/);
  });
});

describe('looksLikeSpam', () => {
  const now = 1_000_000;
  it('flags a filled honeypot', () => {
    expect(looksLikeSpam({ honeypot: 'http://spam', startedAt: now - 60_000, now })).toBe(true);
  });
  it('flags impossibly fast submissions', () => {
    expect(looksLikeSpam({ honeypot: '', startedAt: now - (MIN_FILL_TIME_MS - 1), now })).toBe(true);
  });
  it('allows normal human submissions', () => {
    expect(looksLikeSpam({ honeypot: '', startedAt: now - 30_000, now })).toBe(false);
  });
  it('does not block when the start time is unknown (e.g. autofill without focus)', () => {
    expect(looksLikeSpam({ honeypot: '', startedAt: 0, now })).toBe(false);
  });
});
