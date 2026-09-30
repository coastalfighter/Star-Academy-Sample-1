/**
 * Form validation rules shared by the browser script and unit tests.
 * Messages are written to tell people how to fix the problem, not just
 * that something is wrong.
 */

export type Rule = 'required' | 'email' | 'phone' | 'maxlength' | 'file';

export interface FieldSpec {
  label: string;
  rules: Rule[];
  /** 'choose' for selects, radios and file inputs; defaults to 'enter'. */
  verb?: 'enter' | 'choose';
  maxLength?: number;
  /** For file inputs: max size in bytes and allowed extensions. */
  maxBytes?: number;
  accept?: string[];
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/** US phone numbers: 10 digits, or 11 starting with country code 1. */
export function isValidPhone(value: string): boolean {
  const d = digitsOnly(value);
  return d.length === 10 || (d.length === 11 && d.startsWith('1'));
}

export function formatPhone(value: string): string {
  const d = digitsOnly(value).replace(/^1(?=\d{10}$)/, '');
  if (d.length !== 10) return value;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export interface FileLike {
  name: string;
  size: number;
}

/** Returns an error message, or null when the value passes every rule. */
export function validateValue(value: string, spec: FieldSpec, file?: FileLike | null): string | null {
  const trimmed = value.trim();
  const label = spec.label.replace(/\s*\(optional\)\s*$/i, '');

  if (spec.rules.includes('required') && !trimmed && !file) {
    const article = articleFor(label);
    return `Please ${spec.verb ?? 'enter'} ${article ? `${article} ` : ''}${label.toLowerCase()}.`;
  }
  if (!trimmed && !file) return null;

  if (spec.rules.includes('email') && !isValidEmail(trimmed)) {
    return 'Please enter an email address in the format name@example.com.';
  }
  if (spec.rules.includes('phone') && !isValidPhone(trimmed)) {
    return 'Please enter a 10-digit phone number, like 870-555-0123.';
  }
  if (spec.rules.includes('maxlength') && spec.maxLength && trimmed.length > spec.maxLength) {
    return `Please shorten this to ${spec.maxLength} characters or fewer (currently ${trimmed.length}).`;
  }
  if (spec.rules.includes('file') && file) {
    if (spec.maxBytes && file.size > spec.maxBytes) {
      return `Please choose a file smaller than ${Math.round(spec.maxBytes / 1_000_000)} MB.`;
    }
    if (spec.accept?.length) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!spec.accept.includes(ext)) {
        return `Please upload one of these file types: ${spec.accept.map((a) => `.${a}`).join(', ')}.`;
      }
    }
  }
  return null;
}

function articleFor(label: string): string {
  if (/^(your|a|an|the)\b/i.test(label)) return '';
  return /^[aeiou]/i.test(label) ? 'an' : 'a';
}

/** Minimum time (ms) a real person plausibly needs to complete a form. */
export const MIN_FILL_TIME_MS = 2500;

/** Lightweight bot heuristics used alongside the provider's own spam filtering. */
export function looksLikeSpam(input: { honeypot: string; startedAt: number; now: number }): boolean {
  if (input.honeypot.trim() !== '') return true;
  if (input.startedAt > 0 && input.now - input.startedAt < MIN_FILL_TIME_MS) return true;
  return false;
}
