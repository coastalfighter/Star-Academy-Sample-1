import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PHOTOS, PHOTO_WIDTHS, isPhotoKey, photoSrcset } from '@/lib/photos';
import { listFiles, readRepoFile } from './helpers';

const keys = Object.keys(PHOTOS);
const root = new URL('../../', import.meta.url).pathname;

describe('photo registry', () => {
  it.each(keys)('%s has every responsive file, a real alt text and a source', (key) => {
    const p = PHOTOS[key as keyof typeof PHOTOS];
    for (const w of PHOTO_WIDTHS) expect(existsSync(`${root}public/photos/${key}-${w}.webp`)).toBe(true);
    expect(p.alt.length).toBeGreaterThan(30);
    // Stock photos must never be described as real STARS people or places.
    expect(p.alt).not.toMatch(/STARS/);
    expect(p.width).toBeGreaterThan(0);
    expect(p.source).toMatch(/^https:\/\/www\.pexels\.com\/photo\/\d+\/$/);
    expect(p.position).toMatch(/^\d+% \d+%$/);
  });

  it('builds a srcset across all widths', () => {
    expect(photoSrcset('floor-play' as never).split(', ')).toHaveLength(PHOTO_WIDTHS.length);
  });

  it('only references photo keys that exist', () => {
    const used = new Set<string>();
    for (const f of [...listFiles('src', '.astro'), ...listFiles('src/content/services', '.md')]) {
      const text = readRepoFile(f);
      // <Photo image="key">, { image: 'key' } in pages, and `image: key` in frontmatter.
      for (const m of text.matchAll(/\bimage(?:=|:\s*)["']([a-z-]+)["']|^\s+image:\s*([a-z-]+)\s*$/gm)) used.add((m[1] ?? m[2])!);
    }
    const unknown = [...used].filter((k) => !isPhotoKey(k));
    expect(unknown).toEqual([]);
    // Every registered photo is actually used somewhere (no dead weight).
    expect(keys.filter((k) => !used.has(k))).toEqual([]);
  });
});
