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
  const [activeGroup, setActiveGroup] = useState<'all' | 'shoes' | 'socks'>(
    initialCategorySlug === 'bamboo-socks' ? 'socks' : initialCategorySlug ? 'shoes' : 'all'
  );

  const shoeCategories = useMemo(
    () => categories.filter((c) => c.slug !== 'bamboo-socks'),
    [categories]
  );
  const socksCategories = useMemo(
    () => categories.filter((c) => c.slug === 'bamboo-socks'),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Group filter (Shoes vs Socks)
      const isSocks = product.categoryId?.slug === 'bamboo-socks';
      if (activeGroup === 'shoes' && isSocks) return false;
      if (activeGroup === 'socks' && !isSocks) return false;

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
  }, [initialProducts, activeGroup, selectedCategory, searchQuery]);

  return (
    <div>
      {/* 2 DEDICATED HIGHLIGHTED CATEGORY CARDS (SHOES VS SOCKS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* SHOES CATEGORY CARD */}
        <button
          type="button"
          onClick={() => {
            if (activeGroup === 'shoes') {
              setActiveGroup('all');
              setSelectedCategory('');
            } else {
              setActiveGroup('shoes');
              setSelectedCategory('');
            }
          }}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
            activeGroup === 'shoes'
              ? 'bg-stone-950 text-white border-stone-950 shadow-lg ring-2 ring-stone-900/20'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-orange/15 text-brand-orange">
              Category 01 · Footwear
            </span>
            <span className={`text-xs font-bold ${activeGroup === 'shoes' ? 'text-stone-300' : 'text-stone-500'}`}>
              11 Sports Disciplines
            </span>
          </div>
          <h3 className="font-display text-base sm:text-xl font-black uppercase tracking-tight">
            Sports Shoes Collection
          </h3>
          <p className={`text-xs mt-1.5 line-clamp-1 ${activeGroup === 'shoes' ? 'text-stone-300' : 'text-stone-500'}`}>
            Running, Marathon, Football Cleats, Kabaddi, Badminton, Tennis, Spikes &amp; more.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <span>{activeGroup === 'shoes' ? '✓ Showing Shoes Only (Click to show all)' : 'Filter by Shoes →'}</span>
          </div>
        </button>

        {/* SOCKS CATEGORY CARD */}
        <button
          type="button"
          onClick={() => {
            if (activeGroup === 'socks') {
              setActiveGroup('all');
              setSelectedCategory('');
            } else {
              setActiveGroup('socks');
              setSelectedCategory('bamboo-socks');
            }
          }}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
            activeGroup === 'socks'
              ? 'bg-emerald-950 text-white border-emerald-900 shadow-lg ring-2 ring-emerald-800/30'
              : 'bg-emerald-50/50 text-stone-900 border-emerald-200 hover:border-emerald-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Category 02 · Organic
            </span>
            <span className={`text-xs font-bold ${activeGroup === 'socks' ? 'text-emerald-200' : 'text-emerald-700'}`}>
              Eco Pack · ₹499
            </span>
          </div>
          <h3 className="font-display text-base sm:text-xl font-black uppercase tracking-tight">
            100% Bamboo Socks Category
          </h3>
          <p className={`text-xs mt-1.5 line-clamp-1 ${activeGroup === 'socks' ? 'text-emerald-200' : 'text-stone-600'}`}>
            Antibacterial organic bamboo yarn in 5 recyclable designer cylinder tubes.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span>{activeGroup === 'socks' ? '✓ Showing Socks Only (Click to show all)' : 'Filter by Bamboo Socks →'}</span>
          </div>
        </button>
      </div>

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
              placeholder="Search sports footwear or socks..."
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
              <option value="">All Categories ({filteredProducts.length})</option>
              {(activeGroup === 'socks' ? socksCategories : activeGroup === 'shoes' ? shoeCategories : categories).map(
                (cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                )
              )}
            </select>

            {(selectedCategory || searchQuery || activeGroup !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setActiveGroup('all');
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
            onClick={() => {
              setSelectedCategory('');
              setActiveGroup('all');
            }}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              selectedCategory === '' && activeGroup === 'all'
                ? 'bg-brand-orange text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Products
          </button>
          {(activeGroup === 'socks' ? socksCategories : activeGroup === 'shoes' ? shoeCategories : categories).map(
            (cat) => (
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
            )
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-800">{filteredProducts.length}</strong> published footwear model{filteredProducts.length === 1 ? '' : 's'}
        </span>
        <span className="italic">Institutional & Business Catalogue (No Retail Checkout)</span>
      </div>

      {/* Product Grid - Mobile 2-by-2 Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            let primaryImg =
              product.images?.find((img) => img.isPrimary)?.url ||
              product.images?.[0]?.url ||
              `/categories/${product.categoryId?.slug || 'running-shoes'}.webp`;
            if (
              primaryImg.includes('unsplash.com') ||
              primaryImg.includes('photo-1511556532299') ||
              primaryImg.includes('photo-1608231387042') ||
              primaryImg.includes('photo-1542291026') ||
              primaryImg.includes('photo-1584735935682') ||
              primaryImg.includes('photo-1551107696')
            ) {
              primaryImg = `/categories/${product.categoryId?.slug || 'running-shoes'}.webp`;
            }
            const safeName = (product.name || 'KSports Footwear').replace(/Klub /gi, 'KSports ');

            return (
              <div
                key={product._id}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-orange/40 hover:shadow-premium transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-stone-100 overflow-hidden block">
                  <Image
                    src={primaryImg}
                    alt={safeName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[11px] font-bold text-stone-800 uppercase tracking-wider shadow-sm">
                    {product.categoryId?.name || 'Footwear'}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-3 sm:p-5 lg:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-xs sm:text-base lg:text-lg font-bold text-stone-900 group-hover:text-brand-orange transition-colors line-clamp-1 sm:line-clamp-none">
                        {safeName}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs lg:text-sm text-stone-600 mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Features list snapshot */}
                    {product.features && product.features.length > 0 && (
                      <div className="hidden sm:flex mt-4 flex-wrap gap-1.5">
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
                  <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-stone-800 hover:text-brand-orange transition-colors"
                    >
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </Link>

                    <Link
                      href={`/contact?category=${product.categoryId?.slug || ''}&product=${encodeURIComponent(product.name)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded transition-colors"
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
