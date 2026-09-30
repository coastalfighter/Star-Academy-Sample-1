import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content model. Everything STARS staff are likely to edit lives here as
 * Markdown/JSON so it can be managed through the CMS (see public/admin)
 * without touching layout code.
 */

const photo = z.object({
  brief: z.string(),
  src: z.string().optional(),
  alt: z.string().optional(),
});

const qa = z.object({ question: z.string(), answer: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    path: z.string().regex(/^\/[a-z-]+$/),
    eyebrow: z.string(),
    headline: z.string(),
    lede: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string().max(170),
    photo,
    whatItIs: z.string(),
    forWho: z.string(),
    signs: z.array(z.string()).min(2),
    provides: z.array(z.string()).min(2),
    process: z.array(z.object({ title: z.string(), body: z.string() })).min(2),
    expect: z.array(z.string()).min(1),
    connects: z.array(z.object({ path: z.string(), text: z.string() })).min(1),
    forProviders: z
      .object({ heading: z.string(), intro: z.string().optional(), items: z.array(z.string()) })
      .optional(),
    faqs: z.array(qa).default([]),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    abbreviation: z.string().optional(),
    team: z.enum(['Classroom', 'Therapy', 'Nursing', 'Transportation', 'Operations']),
    status: z.enum(['open', 'ongoing', 'closed']),
    summary: z.string(),
    requirements: z.array(z.string()).min(1),
    order: z.number().int(),
  }),
});

const faqs = defineCollection({
  // Wrapped in { faqs: [...] } so the CMS can edit the list.
  loader: file('./src/content/faqs.json', { parser: (text) => JSON.parse(text).faqs }),
  schema: z.object({
    id: z.string(),
    audience: z.enum(['families', 'referrals', 'current', 'careers']),
    question: z.string(),
    answer: z.string(),
    order: z.number().int(),
  }),
});

const announcements = defineCollection({
  loader: file('./src/content/announcements.json', { parser: (text) => JSON.parse(text).announcements }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    // Hidden automatically after this date (YYYY-MM-DD). Leave empty to keep showing.
    expires: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const collections = { services, jobs, faqs, announcements };
