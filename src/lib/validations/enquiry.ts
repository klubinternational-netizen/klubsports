import { z } from 'zod';

export const publicEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  companyName: z.string().max(120).optional().default(''),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  phone: z
    .string()
    .min(7, 'Please provide a valid phone or mobile number')
    .max(25)
    .trim(),
  categoryId: z.string().optional().default(''),
  categoryName: z.string().optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000).trim(),
  sourcePage: z.string().optional().default('/contact'),
  honeypot: z.string().max(0, 'Spam detected').optional().default(''), // must be empty
});

export const adminUpdateEnquirySchema = z.object({
  status: z.enum(['New', 'In Progress', 'Closed']),
  internalNotes: z.string().optional().default(''),
});

export type PublicEnquiryInput = z.infer<typeof publicEnquirySchema>;
export type AdminUpdateEnquiryInput = z.infer<typeof adminUpdateEnquirySchema>;
