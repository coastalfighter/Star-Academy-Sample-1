import { describe, expect, it } from 'vitest';
import { splitTitle } from '@/lib/title';

const rebuild = (html: string) =>
  splitTitle(html)
    .map((s) => (s.em ? `<em>${s.words.join(' ')}</em>` : s.words.join(' ')) + (s.trailingSpace ? ' ' : ''))
    .join('');

describe('splitTitle', () => {
  it('keeps emphasis and spacing around accents', () => {
    const html = 'Helping children <em>be understood</em> — and understand the world.';
    expect(rebuild(html)).toBe(html);
    expect(splitTitle(html)[1]).toEqual({ em: true, words: ['be', 'understood'], trailingSpace: true });
  });
  it('treats &nbsp; as a non-breaking join inside one word', () => {
    const segs = splitTitle('One <em>full&nbsp;day.</em>');
    expect(segs[1]!.words).toEqual(['full day.']);
  });
  it('handles a trailing accent and a leading accent', () => {
    expect(rebuild('Could STARS help <em>your</em> child?')).toBe('Could STARS help <em>your</em> child?');
    expect(rebuild('<em>Welcome</em> home')).toBe('<em>Welcome</em> home');
  });
  it('rejects unexpected markup', () => {
    expect(() => splitTitle('Hello <strong>x</strong>')).toThrow(/Unsupported/);
  });
});
