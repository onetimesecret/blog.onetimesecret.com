import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        headline: z.string().optional(),
        icon: z.string().optional(),
      }),
    }),
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        layout: z.string().optional(),
        date: z.string(),
        authors: z.array(z.object({
          name: z.string(),
          to: z.string().optional(),
          description: z.string().optional(),
          avatar: z.object({
            src: z.string(),
          }).optional(),
        })).optional(),
        image: z.object({
          src: z.string(),
          alt: z.string().optional(),
        }).optional(),
        badge: z.object({
          label: z.string(),
          color: z.string().optional(),
        }).optional(),
        readingTime: z.number().optional(),
        headline: z.string().optional(),
        icon: z.string().optional(),
      }),
    }),
  },
});
