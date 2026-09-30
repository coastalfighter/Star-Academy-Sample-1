/**
 * Splits a heading like "Therapy, learning and care, <em>woven into one day.</em>"
 * into word segments, preserving which words are emphasized and where the
 * spaces fall between segments.
 */
export interface TitleSegment {
  em: boolean;
  words: string[];
  trailingSpace: boolean;
}

const decode = (s: string) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

export function splitTitle(html: string): TitleSegment[] {
  const parts = html.split(/(<em>[\s\S]*?<\/em>)/g).filter((p) => p.length > 0);
  return parts.map((part, idx) => {
    const em = part.startsWith('<em>');
    const text = decode(em ? part.slice(4, -5) : part);
    if (/<[^>]+>/.test(text)) throw new Error(`Unsupported markup in title: ${html}`);
    const next = parts[idx + 1];
    return {
      em,
      words: text.split(/ +/).filter(Boolean),
      trailingSpace: /\s$/.test(text) || (Boolean(next) && /^\s/.test(next ?? '')),
    };
  });
}
