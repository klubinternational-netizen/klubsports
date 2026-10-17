import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/manufacturing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    await connectToDatabase();
    const [products, categories] = await Promise.all([
      Product.find({ isPublished: true }).select('slug updatedAt').lean(),
      Category.find({ isPublished: true }).select('slug updatedAt').lean(),
    ]);

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...categoryPages, ...productPages];
  } catch {
    return staticPages;
  }
}
