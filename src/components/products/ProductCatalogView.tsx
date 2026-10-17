'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight, PackageOpen } from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  shortDescription: string;
  features: string[];
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  sortOrder: number;
}

interface Props {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  initialCategorySlug?: string;
}

export default function ProductCatalogView({
  initialProducts,
  categories,
  initialCategorySlug = '',
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category match
      if (selectedCategory && product.categoryId?.slug !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        const matchesCategory = product.categoryId?.name.toLowerCase().includes(query);
        const matchesFeature = product.features?.some((f) => f.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesCategory || matchesFeature;
      }
      return true;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sports footwear..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition-all"
            />
          </div>

          {/* Category Dropdown & Quick Reset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all"
            >
              <option value="">All Categories ({initialProducts.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {(selectedCategory || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-brand-orange hover:text-brand-orange-dark underline transition-colors px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Badges for Desktop */}
        <div className="hidden lg:flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-brand-orange text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Footwear
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-brand-orange text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-800">{filteredProducts.length}</strong> published footwear model{filteredProducts.length === 1 ? '' : 's'}
        </span>
        <span className="italic">Institutional & Business Catalogue (No Retail Checkout)</span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const primaryImg =
              product.images?.find((img) => img.isPrimary)?.url ||
              product.images?.[0]?.url ||
              '/brand/logo-stacked.png';

            return (
              <div
                key={product._id}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-orange/40 hover:shadow-premium transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-stone-100 overflow-hidden block">
                  <Image
                    src={primaryImg}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-bold text-stone-800 uppercase tracking-wider shadow-sm">
                    {product.categoryId?.name || 'Footwear'}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-orange transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Features list snapshot */}
                    {product.features && product.features.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {product.features.slice(0, 2).map((feature, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-block px-2 py-0.5 text-[11px] bg-stone-100 text-stone-700 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-brand-orange transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/contact?category=${product.categoryId?.slug || ''}&product=${encodeURIComponent(product.name)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded transition-colors"
                    >
                      <span>Enquire</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-12 text-center max-w-lg mx-auto">
          <PackageOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-base font-bold text-stone-900">No matching footwear found</h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
            We couldn&apos;t find any published footwear matching your current search or category filter.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
