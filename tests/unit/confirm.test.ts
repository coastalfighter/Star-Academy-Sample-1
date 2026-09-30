import { describe, expect, it } from 'vitest';
import { escapeHtml, findConfirmNotes, smartQuotes, stripConfirm, withConfirm } from '@/lib/confirm';

describe('withConfirm', () => {
  it('turns markers into visible marks', () => {
    const html = withConfirm('Hours vary. [CLIENT TO CONFIRM: holiday schedule]');
    expect(html).toContain('<mark class="confirm" data-confirm>[Client to confirm: holiday schedule]</mark>');
    expect(html.startsWith('Hours vary. ')).toBe(true);
  });
  it('escapes HTML in surrounding text and in the note', () => {
    const html = withConfirm('<script>x</script> [CLIENT TO CONFIRM: <b>fax</b>]');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;fax&lt;/b&gt;');
  });
  it('handles multiple markers', () => {
    expect(withConfirm('[CLIENT TO CONFIRM: a] and [CLIENT TO CONFIRM: b]').match(/<mark/g)).toHaveLength(2);
  });
  it('applies typographic quotes to plain text', () => {
    expect(withConfirm("child's")).toBe('child’s');
  });
});

describe('helpers', () => {
  it('finds and strips notes', () => {
    const text = 'Fax: [CLIENT TO CONFIRM: fax number] today';
    expect(findConfirmNotes(text)).toEqual(['fax number']);
    expect(stripConfirm(text)).toBe('Fax: today');
  });
  it('escapes all special characters', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
  it('curls quotes correctly', () => {
    expect(smartQuotes(`"Hello," she said. It's 'fine'.`)).toBe('“Hello,” she said. It’s ‘fine’.');
  });
});
