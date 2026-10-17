import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens')
    .trim(),
  description: z.string().optional().default(''),
  coverImage: z.string().optional().default(''),
  imageAlt: z.string().optional().default(''),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
  seo: z
    .object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
    })
    .optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
