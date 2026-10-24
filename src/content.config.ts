import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const treatises = defineCollection({
  loader: glob({ base: './src/content/treatises', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      heroImage: z.optional(image()),
      heroAlt: z.string().default(''),
    }),
});

export const collections = { treatises };
