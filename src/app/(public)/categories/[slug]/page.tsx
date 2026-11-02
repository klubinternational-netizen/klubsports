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
    return { title: 'Category Not Found | KSports' };
  }
  return {
    title: category.seo?.title || `${category.name} | KSports Footwear`,
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
  const isBamboo = serializedCategory.slug === 'bamboo-socks';

  return (
    <div className="bg-white min-h-screen">
      {/* Category Hero Banner with Custom Theme & Left-to-Right Entrance Animations */}
      <section
        className={`relative text-white pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden border-b ${
          isBamboo
            ? 'bg-gradient-to-br from-[#06170e] via-[#0c2617] to-[#081c11] border-emerald-900/60'
            : 'bg-gradient-to-br from-[#0c0e12] via-[#141822] to-[#0a0d14] border-stone-800'
        }`}
      >
        <style>{`
          @keyframes slideLeftToRight {
            0% {
              opacity: 0;
              transform: translateX(-70px);
              filter: blur(4px);
            }
            60% {
              opacity: 0.95;
              transform: translateX(4px);
              filter: blur(0px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
              filter: blur(0px);
            }
          }

          @keyframes slideRightToLeft {
            0% {
              opacity: 0;
              transform: translateX(70px);
              filter: blur(4px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
              filter: blur(0px);
            }
          }

          @keyframes bambooGlowPulse {
            0%, 100% {
              opacity: 0.35;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.08);
            }
          }

          .anim-slide-left-1 {
            animation: slideLeftToRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
          }
          .anim-slide-left-2 {
            animation: slideLeftToRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
          }
          .anim-slide-left-3 {
            animation: slideLeftToRight 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
          }
          .anim-slide-left-4 {
            animation: slideLeftToRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both;
          }
          .anim-slide-left-5 {
            animation: slideLeftToRight 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.54s both;
          }
          .anim-slide-right {
            animation: slideRightToLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
          }
          .anim-bamboo-pulse {
            animation: bambooGlowPulse 6s ease-in-out infinite;
          }
        `}</style>

        {/* Dynamic Background Effects: Organic Bamboo silhouetting & emerald glows */}
        {isBamboo ? (
          <>
            {/* Fine Organic Fiber Canvas Weave Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: 'radial-gradient(rgba(52, 211, 153, 0.2) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Glowing Natural Bamboo Emerald Ambient Blurs */}
            <div className="absolute -top-32 -right-16 w-[550px] h-[550px] bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none anim-bamboo-pulse" />
            <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] bg-lime-400/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-600/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Natural Bamboo Stalk / Leaf Silhouettes (Vector Art Layer) */}
            <svg
              className="absolute right-0 top-0 h-full w-auto opacity-15 pointer-events-none text-emerald-400"
              viewBox="0 0 400 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bamboo Stalk 1 */}
              <line x1="120" y1="0" x2="120" y2="500" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <line x1="110" y1="120" x2="130" y2="120" stroke="currentColor" strokeWidth="4" />
              <line x1="110" y1="260" x2="130" y2="260" stroke="currentColor" strokeWidth="4" />
              <line x1="110" y1="400" x2="130" y2="400" stroke="currentColor" strokeWidth="4" />
              {/* Bamboo Stalk 2 */}
              <line x1="280" y1="0" x2="280" y2="500" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <line x1="268" y1="160" x2="292" y2="160" stroke="currentColor" strokeWidth="4" />
              <line x1="268" y1="320" x2="292" y2="320" stroke="currentColor" strokeWidth="4" />
              {/* Bamboo Leaves */}
              <path d="M120 120 C 170 110, 220 140, 260 120 C 220 160, 160 140, 120 120 Z" fill="currentColor" opacity="0.7" />
              <path d="M120 260 C 180 240, 230 270, 270 250 C 230 290, 170 280, 120 260 Z" fill="currentColor" opacity="0.6" />
              <path d="M280 160 C 330 150, 370 170, 390 150 C 370 190, 320 180, 280 160 Z" fill="currentColor" opacity="0.7" />
              <path d="M280 320 C 340 300, 380 330, 400 310 C 380 350, 330 340, 280 320 Z" fill="currentColor" opacity="0.6" />
            </svg>
          </>
        ) : (
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-brand-orange/15 rounded-full blur-[140px] pointer-events-none" />
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs - Animated from Left */}
          <nav className="flex items-center space-x-2 text-xs text-stone-400 mb-6 anim-slide-left-1">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <Link href="/products" className="hover:text-white transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <span className={isBamboo ? 'text-emerald-400 font-semibold' : 'text-brand-orange font-semibold'}>
              {serializedCategory.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Descriptions & Badges - ANIMATED LEFT TO RIGHT */}
            <div className="lg:col-span-8 space-y-4">
              {/* Category Eyebrow Badge */}
              <div className="anim-slide-left-2">
                <span
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm ${
                    isBamboo
                      ? 'bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 backdrop-blur-md'
                      : 'bg-stone-900/70 border border-brand-orange/30 text-brand-orange'
                  }`}
                >
                  {isBamboo && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                  <span>
                    {isBamboo
                      ? 'Organic Performance Accessories · 100% Bamboo Fiber'
                      : 'Performance Footwear · 11 Disciplines'}
                  </span>
                </span>
              </div>

              {/* Main Headline - Animated Left to Right */}
              <div className="anim-slide-left-3">
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-none">
                  {serializedCategory.name}
                </h1>
                {isBamboo && (
                  <div className="mt-2.5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-200">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                      Eco Launch
                    </span>
                    <span>MRP ₹499 · 3 Pairs in Recyclable Cylinder Tube</span>
                  </div>
                )}
              </div>

              {/* Description - Animated Left to Right */}
              <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed anim-slide-left-4">
                {serializedCategory.description ||
                  (isBamboo
                    ? '100% natural organic bamboo fiber athletic socks in cylindrical recyclable eco-tubes. Naturally anti-bacterial, breathable, thermo-regulating, and ultra-soft.'
                    : 'Precision-engineered athletic sports footwear for tournament play, institutional procurement, and elite performance.')}
              </p>

              {/* Specific Bamboo Features Bar - Animated Left to Right */}
              {isBamboo && (
                <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5 anim-slide-left-5">
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                    🌿 Naturally Anti-Bacterial
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                    ♻️ Recyclable Kraft Paper Tube
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                    🧦 3 Color Pairs (Black, Tan, Navy)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                    ⚡ Odor-Resistant &amp; Ultra-Soft
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Hero Category Image - ANIMATED RIGHT TO LEFT */}
            {serializedCategory.coverImage && (() => {
              let imgUrl = serializedCategory.coverImage;
              if (
                imgUrl.includes('unsplash.com') ||
                imgUrl.includes('photo-1511556532299') ||
                imgUrl.includes('photo-1608231387042') ||
                imgUrl.includes('photo-1542291026') ||
                imgUrl.includes('photo-1584735935682') ||
                imgUrl.includes('photo-1551107696')
              ) {
                imgUrl = `/categories/${serializedCategory.slug}.webp`;
              }
              const safeAlt = (serializedCategory.imageAlt || serializedCategory.name || 'KSports Athletic Footwear').replace(/Klub /gi, 'KSports ');
              return (
                <div className="lg:col-span-4 anim-slide-right">
                  <div
                    className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02] ${
                      isBamboo
                        ? 'border-2 border-emerald-400/40 bg-emerald-950/30 ring-4 ring-emerald-500/10 shadow-[0_20px_60px_-15px_rgba(5,40,20,0.6)]'
                        : 'border border-stone-700 bg-stone-900 shadow-xl'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={safeAlt}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    {isBamboo && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-400/40 text-[9px] sm:text-[10px] font-bold text-emerald-200 uppercase tracking-wider shadow-md">
                        Official 3-Pack Eco Edition
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {serializedProducts.map((product: any) => {
                let primaryImg =
                  product.images?.find((img: any) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  `/categories/${serializedCategory.slug || 'running-shoes'}.webp`;
                if (
                  primaryImg.includes('unsplash.com') ||
                  primaryImg.includes('photo-1511556532299') ||
                  primaryImg.includes('photo-1608231387042') ||
                  primaryImg.includes('photo-1542291026') ||
                  primaryImg.includes('photo-1584735935682') ||
                  primaryImg.includes('photo-1551107696')
                ) {
                  primaryImg = `/categories/${serializedCategory.slug || 'running-shoes'}.webp`;
                }
                const safeName = (product.name || 'KSports Footwear').replace(/Klub /gi, 'KSports ');

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-orange/40 hover:shadow-premium transition-all duration-300 flex flex-col"
                  >
                    <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-stone-100 overflow-hidden block">
                      <Image
                        src={primaryImg}
                        alt={safeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>

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
                      </div>

                      <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-stone-800 hover:text-brand-orange transition-colors"
                        >
                          <span className="hidden sm:inline">Specifications</span>
                          <span className="sm:hidden">Specs</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </Link>
                        <Link
                          href={`/contact?category=${serializedCategory.slug}&product=${encodeURIComponent(product.name)}`}
                          className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded transition-colors"
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
