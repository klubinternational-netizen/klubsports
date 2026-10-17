import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, PackageOpen } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export const revalidate = 60;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase();
  const category = await Category.findOne({ slug: params.slug, isPublished: true }).lean();
  if (!category) {
    return { title: 'Category Not Found | Klub Sports' };
  }
  return {
    title: category.seo?.title || `${category.name} | Klub Sports Footwear`,
    description: category.seo?.description || category.description,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  await connectToDatabase();

  const category = await Category.findOne({ slug: params.slug, isPublished: true }).lean();
  if (!category) {
    notFound();
  }

  const products = await Product.find({
    categoryId: category._id,
    isPublished: true,
  })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const serializedCategory = JSON.parse(JSON.stringify(category));
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="bg-white min-h-screen">
      {/* Category Hero Banner */}
      <section className="relative bg-[#0c0d0e] text-white py-16 lg:py-24 overflow-hidden border-b border-stone-800">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-stone-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <Link href="/products" className="hover:text-white transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <span className="text-brand-orange font-semibold">{serializedCategory.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                Footwear Category
              </span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
                {serializedCategory.name}
              </h1>
              <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                {serializedCategory.description ||
                  'Precision-engineered athletic sports footwear for tournament play, institutional procurement, and elite performance.'}
              </p>
            </div>

            {serializedCategory.coverImage && (
              <div className="lg:col-span-4">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-stone-700 shadow-xl">
                  <Image
                    src={serializedCategory.coverImage}
                    alt={serializedCategory.imageAlt || serializedCategory.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Published Products in this Category */}
      <section className="py-16 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Published {serializedCategory.name} Models ({serializedProducts.length})
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline"
            >
              All Categories →
            </Link>
          </div>

          {serializedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {serializedProducts.map((product: any) => {
                const primaryImg =
                  product.images?.find((img: any) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  '/brand/logo-stacked.png';

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-orange/40 hover:shadow-premium transition-all duration-300 flex flex-col"
                  >
                    <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-stone-100 overflow-hidden block">
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>

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
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-brand-orange transition-colors"
                        >
                          <span>Specifications</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/contact?category=${serializedCategory.slug}&product=${encodeURIComponent(product.name)}`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded transition-colors"
                        >
                          Enquire
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center max-w-lg mx-auto">
              <PackageOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="text-base font-bold text-stone-900">Catalogue Updating</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
                New models in {serializedCategory.name} are currently being audited by our engineering team. Submit an enquiry to request technical spec sheets.
              </p>
              <div className="mt-5">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded transition-colors inline-block"
                >
                  Contact Institutional Desk
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Business Enquiry CTA Bar */}
      <section className="py-16 bg-brand-orange-light border-t border-brand-orange/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-stone-900">
            Institutional Procurement for {serializedCategory.name}
          </h3>
          <p className="text-sm text-stone-700 max-w-xl mx-auto">
            Discuss customized team batches, institutional athletic supply tenders, and state academy requirements.
          </p>
          <div className="pt-2">
            <Link
              href={`/contact?category=${serializedCategory.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-md transition-colors shadow-sm"
            >
              <span>Submit Category Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
