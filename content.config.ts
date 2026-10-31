import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import { draftFiles } from './scripts/drafts.js';

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
      // Drafts are excluded from the source, not just filtered at query time:
      // the whole table ships to the client as a public SQL dump, so a row
      // for a draft would publish its full text. See scripts/drafts.js.
      source: {
        include: 'posts/**/*.md',
        exclude: draftFiles.map(file => `posts/${file}`),
      },
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
          // Intrinsic dimensions let the hero <NuxtImg> reserve space,
          // avoiding layout shift (CLS) and the "unsized-images" audit.
          width: z.number().optional(),
          height: z.number().optional(),
        }).optional(),
        badge: z.object({
          label: z.string(),
          color: z.string().optional(),
        }).optional(),
        readingTime: z.number().optional(),
        headline: z.string().optional(),
        // Drafts never reach the table (see `source.exclude` above); the
        // query-time `where("draft", "<>", true)` filters only cover a post
        // toggled to draft while the dev server is running. Defaulting to
        // false keeps the column non-null so that filter matches every
        // published post.
        draft: z.boolean().default(false),
        icon: z.string().optional(),
      }),
    }),
  },
});
