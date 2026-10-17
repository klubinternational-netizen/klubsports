import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ShieldCheck, Factory, Layers, Award, Sparkles } from 'lucide-react';
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
    bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85',
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
      <section className="relative overflow-hidden bg-stone-900 text-white py-20 lg:py-28">
        {/* Subtle structural background overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ee7700_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-brand-orange text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premium Corporate Sports Footwear</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.1]">
                {hero.headline}
              </h1>

              <p className="text-lg sm:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl">
                {hero.subheadline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={hero.primaryCtaLink || '/products'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-md transition-all shadow-lg hover:shadow-brand-orange/20"
                >
                  <span>{hero.primaryCtaText || 'Explore Our Products'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={hero.secondaryCtaLink || '/contact'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wide text-stone-200 bg-white/5 hover:bg-white/10 hover:text-white border border-white/20 active:scale-[0.98] rounded-md transition-all"
                >
                  <span>{hero.secondaryCtaText || 'Business Enquiries'}</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-stone-800 flex items-center gap-8 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  <span>Institutional Procurement Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-brand-orange" />
                  <span>Multi-Category Manufacturing</span>
                </div>
              </div>
            </div>

            {/* Right Product Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-tr from-stone-800 to-stone-700 p-2 shadow-2xl border border-stone-700/60 group">
                <Image
                  src={hero.bannerImage || '/brand/logo-stacked.png'}
                  alt="Klub Sports Athletic Footwear"
                  fill
                  priority
                  className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-orange">
                    High Performance Engineering
                  </span>
                  <p className="text-sm font-medium text-stone-200 mt-0.5">
                    Designed for peak torque, cushioning and court endurance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPANY HIGHLIGHTS */}
      <section className="bg-stone-50 border-y border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Industrial Footprint
              </span>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Manufacturing & Operational Scale
              </h2>
            </div>
            <p className="text-xs text-stone-500 italic">
              *Figures sourced from client presentation deck (pending audit certification).
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:border-brand-orange/40 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-sm font-medium text-stone-600 mt-2">
                  {item.label}
                </div>
                {item.note && (
                  <div className="text-[11px] text-stone-400 mt-1 uppercase tracking-wider">
                    {item.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FOOTWEAR CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Multi-Sport Catalogue
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-1">
                Footwear Designed for Every Discipline
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                Explore dedicated sports footwear tailored to tournament surfaces, traction mechanics, and athlete biomechanics.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-orange-dark transition-colors group self-start md:self-auto"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Dynamic Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col bg-stone-50 hover:bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-brand-orange/40 hover:shadow-premium transition-all duration-300"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200">
                  <Image
                    src={cat.coverImage || '/brand/logo-stacked.png'}
                    alt={cat.imageAlt || cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors" />
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-orange transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description || 'Specialized sports footwear engineered for athletic performance.'}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-orange">
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
        <section className="py-16 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Engineered Models
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-1">
                  Featured Athletic Footwear
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline self-start md:self-auto"
              >
                Browse All Models →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product: any) => {
                const primaryImg =
                  product.images?.find((img: any) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  '/brand/logo-stacked.png';
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-orange/40 hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                        {product.categoryId?.name || 'Footwear'}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="text-base font-bold text-stone-900 group-hover:text-brand-orange transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-700 group-hover:text-brand-orange transition-colors">
                        <span>View Specifications</span>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                About The Brand
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Built Around Performance, Ergonomics and Quality
              </h2>
              <p className="text-stone-600 text-base leading-relaxed">
                Klub Sports is an Indian corporate sports footwear manufacturer dedicated to producing athletic footwear built to the rigorous demands of athletes, competitive sports academies, and institutional programs nationwide.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <Layers className="w-6 h-6 text-brand-orange mb-2" />
                  <h4 className="text-sm font-bold text-stone-900">Surface-Specific Compounds</h4>
                  <p className="text-xs text-stone-600 mt-1">Non-marking court gums, sprint Pebax plates, and cleated outsoles.</p>
                </div>
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <Award className="w-6 h-6 text-brand-orange mb-2" />
                  <h4 className="text-sm font-bold text-stone-900">Institutional Supply</h4>
                  <p className="text-xs text-stone-600 mt-1">Structured procurement processes for teams, tournaments, and distributors.</p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange-dark transition-colors group"
                >
                  <span>Read More About Our Company</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
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
      <section className="py-20 bg-stone-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Industrial Footwear Manufacturing & Quality Execution
            </h2>
            <p className="text-stone-300 text-base leading-relaxed">
              With dedicated manufacturing units and specialized sole vulcanization, stitching, and assembly lines, Klub Sports is structured to deliver dependable consistency across high-volume institutional footwear consignments.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-800/80 p-6 rounded-xl border border-stone-700">
              <h3 className="text-lg font-bold text-white mb-2">Sole Molding & Compounds</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Precision tooling for dual-density EVA midsoles, virgin gum rubbers, and abrasion-resistant polyurethane outsoles tailored to sport-specific traction.
              </p>
            </div>
            <div className="bg-stone-800/80 p-6 rounded-xl border border-stone-700">
              <h3 className="text-lg font-bold text-white mb-2">Upper Construction & Mesh</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Engineered jacquard meshes, reinforced synthetic toe caps, and high-abrasion stitch assemblies designed for torsional stability and longevity.
              </p>
            </div>
            <div className="bg-stone-800/80 p-6 rounded-xl border border-stone-700">
              <h3 className="text-lg font-bold text-white mb-2">High-Capacity Scaling</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Configured to meet large-scale seasonal sports procurement, statewide distributor channels, and institutional tenders on strict delivery schedules.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/manufacturing"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors"
            >
              <span>Explore Manufacturing Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: BUSINESS ENQUIRY CTA */}
      <section className="py-20 bg-brand-orange-light border-y border-brand-orange/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange-dark">
            Institutional Procurement
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Looking for a Sports Footwear Partner?
          </h2>
          <p className="text-stone-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Partner with Klub Sports for bulk institutional orders, corporate athletic programs, tournament shoe procurement, and regional distribution partnerships.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-md transition-all shadow-md hover:shadow-lg"
            >
              <span>Discuss Your Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
