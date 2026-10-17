import { z } from 'zod';

export const productImageSchema = z.object({
  url: z.string().url('Image URL must be valid'),
  alt: z.string().optional().default(''),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens')
    .trim(),
  categoryId: z.string().min(1, 'Category selection is required'),
  shortDescription: z.string().optional().default(''),
  description: z.string().optional().default(''),
  features: z.array(z.string()).default([]),
  images: z.array(productImageSchema).default([]),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  seo: z
    .object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
    })
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
