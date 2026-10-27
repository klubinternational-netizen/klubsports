import React from 'react';
import type { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import ProductCatalogView from '@/components/products/ProductCatalogView';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sports Footwear Catalogue | KSports',
  description:
    'Explore our complete sports footwear catalogue engineered for athletic disciplines, institutional supply, and multi-sport competition.',
};

interface Props {
  searchParams: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  let serializedProducts: any[] = [];
  let serializedCategories: any[] = [];

  try {
    await connectToDatabase();
    const [products, categories] = await Promise.all([
      Product.find({ isPublished: true })
        .populate('categoryId', 'name slug')
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean(),
      Category.find({ isPublished: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    ]);

    serializedProducts = JSON.parse(JSON.stringify(products));
    serializedCategories = JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.warn('Database connection unavailable for products page, using fallback defaults:', error);
    serializedCategories = [
      { _id: 'cat-bamboo', name: 'Bamboo Socks', slug: 'bamboo-socks' },
      { _id: 'cat-1', name: 'Running Shoes', slug: 'running-shoes' },
      { _id: 'cat-2', name: 'Marathon Shoes', slug: 'marathon-shoes' },
      { _id: 'cat-3', name: 'Training & Gym', slug: 'training-gym' },
      { _id: 'cat-4', name: 'Cricket Spikes', slug: 'cricket-shoes' },
    ];
  }

  return (
    <div className="bg-stone-50/50 min-h-screen pt-28 sm:pt-36 pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
            Official Catalogue
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight mt-1.5">
            Sports Footwear Catalogue
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Browse our full range of sports footwear designed for tournament play, athletic performance, and institutional procurement. For wholesale, bulk, or tender enquiries, submit an institutional enquiry directly.
          </p>
        </div>

        {/* Interactive Catalogue View */}
        <ProductCatalogView
          initialProducts={serializedProducts}
          categories={serializedCategories}
          initialCategorySlug={searchParams?.category || ''}
        />
      </div>
    </div>
  );
}
