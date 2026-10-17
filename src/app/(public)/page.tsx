import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ShieldCheck, Factory, Layers, Award } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Page } from '@/models/Page';
import { Product } from '@/models/Product';

export const revalidate = 60; // ISR cache revalidation

async function getHomeData() {
  await connectToDatabase();
  const [categories, pageDoc, featuredProducts] = await Promise.all([
    Category.find({ isPublished: true }).sort({ sortOrder: 1 }).lean(),
    Page.findOne({ key: 'home', isPublished: true }).lean(),
    Product.find({ isPublished: true })
      .populate('categoryId', 'name slug')
      .sort({ sortOrder: 1 })
      .limit(6)
      .lean(),
  ]);

  return {
    categories: JSON.parse(JSON.stringify(categories)),
    page: JSON.parse(JSON.stringify(pageDoc || {})),
    featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
  };
}

export default async function HomePage() {
  const { categories, page, featuredProducts } = await getHomeData();
  const hero = page?.sections?.hero || {
    headline: 'SHOES FOR EVERY SPORT',
    subheadline: 'Explore sports footwear designed around performance, comfort and the demands of the game.',
    primaryCtaText: 'Explore Our Products',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Business Enquiries',
    secondaryCtaLink: '/contact',
    bannerImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1600&q=85',
  };

  const highlights = page?.sections?.highlights?.metrics || [
    { label: 'Manufacturing Facilities', value: '4 Factories', note: 'Source presentation' },
    { label: 'Industrial Factory Area', value: '130,000 sq. ft.', note: 'Source presentation' },
    { label: 'Monthly Production Capacity', value: '4,00,000 Units', note: 'Source presentation' },
    { label: 'Operational Reach', value: '12 Indian States', note: 'Source presentation' },
  ];

  return (
    <div className="flex flex-col">
      {/* SECTION 2: HERO */}
      <section className="relative overflow-hidden bg-[#0c0d0e] text-white py-20 lg:py-28 border-b border-stone-800/80">
        {/* Subtle architectural ambient lighting */}
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-24 left-10 w-80 h-80 bg-stone-800/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Minimalist Live Architectural Tag (No Sparkle AI icons) */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white text-[11px] font-bold tracking-[0.16em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                </span>
                <span>Corporate Sports Footwear</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
                {hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-xl">
                {hero.subheadline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={hero.primaryCtaLink || '/products'}
                  className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-brand-orange hover:bg-white hover:text-stone-950 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-brand-orange/20 group"
                >
                  <span>{hero.primaryCtaText || 'Explore Our Products'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href={hero.secondaryCtaLink || '/contact'}
                  className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-stone-200 bg-white/5 hover:bg-white/10 hover:text-white border border-white/20 active:scale-[0.98] transition-all duration-300"
                >
                  <span>{hero.secondaryCtaText || 'Business Enquiries'}</span>
                </Link>
              </div>

              {/* Manufacturing Metrics Bar */}
              <div className="pt-8 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-stone-400">
                <div>
                  <div className="text-stone-100 font-bold uppercase tracking-wider text-[11px]">4 Factories</div>
                  <div className="text-stone-400 mt-0.5">Manufacturing Base</div>
                </div>
                <div>
                  <div className="text-stone-100 font-bold uppercase tracking-wider text-[11px]">4,00,000 / Mo</div>
                  <div className="text-stone-400 mt-0.5">Production Output</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-stone-100 font-bold uppercase tracking-wider text-[11px]">Pan-India</div>
                  <div className="text-stone-400 mt-0.5">Institutional Supply</div>
                </div>
              </div>
            </div>

            {/* Right Product Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 p-2 shadow-2xl border border-stone-800 group">
                <Image
                  src={hero.bannerImage || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1600&q=85'}
                  alt="Klub Sports Athletic Footwear"
                  fill
                  priority
                  className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent rounded-xl" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-brand-orange text-[10px] uppercase font-bold tracking-wider text-white mb-1.5">
                    Engineering Grade
                  </div>
                  <p className="text-xs font-semibold text-stone-200">
                    Precision traction patterns & multi-density cushioning compounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPANY HIGHLIGHTS */}
      <section className="bg-stone-50/70 border-b border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                Operational Infrastructure
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 uppercase tracking-tight mt-1">
                Manufacturing & Supply Capabilities
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-medium tracking-wide">
              *Figures sourced from client presentation deck (pending certified audit).
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-xl border border-stone-200/90 shadow-sm hover:border-brand-orange/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
                  {item.value}
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    {item.label}
                  </div>
                  {item.note && (
                    <div className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">
                      {item.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FOOTWEAR CATEGORIES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                Multi-Sport Catalogue
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight mt-1.5">
                Footwear Designed for Every Discipline
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2.5 max-w-2xl font-normal leading-relaxed">
                Explore sport-specific footwear engineered to the surface demands, traction dynamics, and biomechanics of competitive athletes.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-950 hover:text-brand-orange transition-colors group self-start md:self-auto border-b-2 border-stone-950 hover:border-brand-orange pb-0.5"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Dynamic Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col bg-stone-50/50 hover:bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-900 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200">
                  <Image
                    src={cat.coverImage || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.imageAlt || cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <div className="p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-stone-950 group-hover:text-brand-orange transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description || 'Specialized athletic footwear engineered for professional sports performance.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-brand-orange group-hover:text-stone-950 transition-colors">
                    <span>Explore Category</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4.5: FEATURED SHOWCASE PRODUCTS */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                  Engineered Models
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 uppercase tracking-tight mt-1">
                  Featured Athletic Footwear
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold uppercase tracking-[0.14em] text-stone-950 hover:text-brand-orange border-b-2 border-stone-950 hover:border-brand-orange pb-0.5 transition-colors self-start md:self-auto"
              >
                Browse All Models →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: any) => {
                const primaryImg =
                  product.images?.find((img: any) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80';
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-900 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                        {product.categoryId?.name || 'Footwear'}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-stone-950 group-hover:text-brand-orange transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-700 group-hover:text-brand-orange transition-colors">
                        <span className="uppercase text-[11px] font-bold tracking-wider">View Specifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: ABOUT KLUB SPORTS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                About The Brand
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight">
                Built Around Performance, Ergonomics & Scale
              </h2>
              <p className="text-stone-600 text-base leading-relaxed">
                Klub Sports is an Indian corporate sports footwear manufacturer dedicated to producing athletic footwear built to the rigorous demands of athletes, competitive sports academies, and institutional programs nationwide.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                  <Layers className="w-6 h-6 text-brand-orange mb-3" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-950">Surface-Specific Compounds</h4>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">Non-marking court gums, sprint Pebax plates, and cleated outsoles.</p>
                </div>
                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                  <Award className="w-6 h-6 text-brand-orange mb-3" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-950">Institutional Supply</h4>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">Structured procurement processes for teams, tournaments, and distributors.</p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-950 hover:text-brand-orange transition-colors border-b-2 border-stone-950 hover:border-brand-orange pb-0.5"
                >
                  <span>Read More About Our Company</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
                  alt="Klub Sports Industrial Production"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MANUFACTURING CAPABILITIES */}
      <section className="py-24 bg-stone-950 text-white relative border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
              Infrastructure
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
              Industrial Footwear Manufacturing & Quality Execution
            </h2>
            <p className="text-stone-300 text-base leading-relaxed">
              With dedicated manufacturing units and specialized sole vulcanization, stitching, and assembly lines, Klub Sports is structured to deliver dependable consistency across high-volume institutional footwear consignments.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900/90 p-7 rounded-xl border border-stone-800">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-2">Sole Molding & Compounds</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Precision tooling for dual-density EVA midsoles, virgin gum rubbers, and abrasion-resistant polyurethane outsoles tailored to sport-specific traction.
              </p>
            </div>
            <div className="bg-stone-900/90 p-7 rounded-xl border border-stone-800">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-2">Upper Construction & Mesh</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Engineered jacquard meshes, reinforced synthetic toe caps, and high-abrasion stitch assemblies designed for torsional stability and longevity.
              </p>
            </div>
            <div className="bg-stone-900/90 p-7 rounded-xl border border-stone-800">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-2">High-Capacity Scaling</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Configured to meet large-scale seasonal sports procurement, statewide distributor channels, and institutional tenders on strict delivery schedules.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/manufacturing"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors"
            >
              <span>Explore Manufacturing Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: BUSINESS ENQUIRY CTA */}
      <section className="py-24 bg-brand-orange-light/60 border-b border-brand-orange/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange-dark">
            Institutional Procurement
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight">
            Looking for a Sports Footwear Partner?
          </h2>
          <p className="text-stone-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Partner with Klub Sports for bulk institutional orders, corporate athletic programs, tournament shoe procurement, and regional distribution partnerships.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-stone-950 hover:bg-brand-orange active:scale-[0.98] transition-all duration-300 shadow-xl group"
            >
              <span>Discuss Your Requirements</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
