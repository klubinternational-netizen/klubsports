import { z } from 'zod';

export const siteSettingsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required').trim(),
  tagline: z.string().optional().default(''),
  logoAsset: z
    .object({
      horizontal: z.string().default('/brand/logo-horizontal.png'),
      stacked: z.string().default('/brand/logo-stacked.png'),
      icon: z.string().default('/brand/logo-icon.png'),
      wordmark: z.string().default('/brand/logo-wordmark.png'),
    })
    .optional(),
  contactDetails: z.object({
    email: z.string().email('Valid contact email is required').trim(),
    phone: z.string().min(5, 'Valid contact phone number is required').trim(),
    secondaryPhone: z.string().optional().default(''),
    address: z.string().min(3, 'Address is required').trim(),
    workingHours: z.string().optional().default(''),
  }),
  socialLinks: z
    .object({
      linkedin: z.string().optional().default(''),
      instagram: z.string().optional().default(''),
      facebook: z.string().optional().default(''),
      twitter: z.string().optional().default(''),
      youtube: z.string().optional().default(''),
    })
    .optional(),
  footerContent: z.object({
    copyright: z.string().min(1).trim(),
    description: z.string().optional().default(''),
  }),
  defaultSeo: z.object({
    title: z.string().min(1).trim(),
    description: z.string().min(1).trim(),
  }),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
