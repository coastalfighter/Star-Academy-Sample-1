/**
 * Downloads the photos listed in src/lib/photos.json from Pexels and writes
 * responsive WebP files to public/photos/<key>-<width>.webp, then records
 * each source's intrinsic size back into the manifest.
 *   npm run photos
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = `${root}src/lib/photos.json`;
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const outDir = `${root}public/photos`;
await mkdir(outDir, { recursive: true });

for (const [key, photo] of Object.entries(manifest.photos)) {
  const url = `https://images.pexels.com/photos/${photo.pexelsId}/pexels-photo-${photo.pexelsId}.jpeg?auto=compress&cs=srgb&w=2000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${key}: ${res.status} ${url}`);
  const source = sharp(Buffer.from(await res.arrayBuffer())).rotate();
  const meta = await source.metadata();
  photo.width = meta.width;
  photo.height = meta.height;
  photo.source = `https://www.pexels.com/photo/${photo.pexelsId}/`;
  for (const w of manifest.widths) {
    await source
      .clone()
      .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(`${outDir}/${key}-${w}.webp`);
  }
  console.log(`✓ ${key} (${meta.width}×${meta.height})`);
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
