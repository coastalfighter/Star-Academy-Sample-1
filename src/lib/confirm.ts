/**
 * "CLIENT TO CONFIRM" markers.
 *
 * Content authors write `[CLIENT TO CONFIRM: what is needed]` anywhere in
 * copy. These helpers turn the marker into a visible, styled <mark> so
 * unverified information can never ship silently as fact.
 */

export const CONFIRM_PATTERN = /\[CLIENT TO CONFIRM:\s*([^\]]+)\]/g;

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

export function confirmMarkup(note: string): string {
  return `<mark class="confirm" data-confirm>[Client to confirm: ${escapeHtml(note.trim())}]</mark>`;
}

/**
 * Typographic quotes for CMS-entered text: straight ' and " become curly
 * apostrophes and quotation marks, matching the hand-set copy.
 */
export function smartQuotes(text: string): string {
  return text
    .replace(/(\w)'(\w)/g, '$1\u2019$2')
    .replace(/(^|[\s([{\u2014\u2013-])"/g, '$1\u201C')
    .replace(/"/g, '\u201D')
    .replace(/(^|[\s([{\u2014\u2013-])'/g, '$1\u2018')
    .replace(/'/g, '\u2019');
}

/** Escapes plain text and converts confirm markers into markup. Safe for set:html. */
export function withConfirm(text: string): string {
  let out = '';
  let last = 0;
  for (const match of text.matchAll(CONFIRM_PATTERN)) {
    const index = match.index ?? 0;
    out += escapeHtml(smartQuotes(text.slice(last, index)));
    out += confirmMarkup(match[1] ?? '');
    last = index + match[0].length;
  }
  return out + escapeHtml(smartQuotes(text.slice(last)));
}

/** Lists every confirm marker found in a piece of text (used by tests and docs). */
export function findConfirmNotes(text: string): string[] {
  return Array.from(text.matchAll(CONFIRM_PATTERN), (m) => (m[1] ?? '').trim());
}

/** Strips markers for contexts that cannot render HTML (meta tags, JSON-LD). */
export function stripConfirm(text: string): string {
  return text.replace(CONFIRM_PATTERN, '').replace(/\s{2,}/g, ' ').trim();
}
