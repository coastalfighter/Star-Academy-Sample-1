import type { DuoName } from '@/components/graphics/DuoIcon.astro';

/** One consistent icon (and tone) per service, used everywhere services appear. */
export const SERVICE_ICONS: Record<string, { icon: DuoName; tone: 'navy' | 'red' | 'gold' | 'teal' }> = {
  '/classrooms': { icon: 'blocks', tone: 'gold' },
  '/speech-therapy': { icon: 'speech', tone: 'red' },
  '/occupational-therapy': { icon: 'hand', tone: 'teal' },
  '/physical-therapy': { icon: 'steps', tone: 'gold' },
  '/nursing': { icon: 'nursing', tone: 'red' },
};
