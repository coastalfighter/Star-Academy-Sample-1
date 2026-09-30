import manifest from './photos.json';

/**
 * Photography registry. Currently temporary Pexels stock images (see
 * photos.json); swap entries for real STARS photography before launch.
 */

export interface PhotoEntry {
  pexelsId: number;
  alt: string;
  position: string;
  width: number;
  height: number;
  source: string;
}

export type PhotoKey = keyof typeof manifest.photos;

export const PHOTO_WIDTHS: readonly number[] = manifest.widths;
export const PHOTOS = manifest.photos as Record<PhotoKey, PhotoEntry>;

export function isPhotoKey(value: unknown): value is PhotoKey {
  return typeof value === 'string' && value in PHOTOS;
}

export function photoSrcset(key: PhotoKey): string {
  return PHOTO_WIDTHS.map((w) => `/photos/${key}-${w}.webp ${w}w`).join(', ');
}

export function photoSrc(key: PhotoKey, width = 800): string {
  return `/photos/${key}-${width}.webp`;
}
