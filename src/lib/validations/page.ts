import { z } from 'zod';

export const pageContentSchema = z.object({
  title: z.string().min(1, 'Page title is required').trim(),
  sections: z.record(z.any()),
  seo: z
    .object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
    })
    .optional(),
  isPublished: z.boolean().default(true),
});

export type PageContentInput = z.infer<typeof pageContentSchema>;
