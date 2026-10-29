import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ShieldCheck, Factory, Layers, Award, MapPin, TrendingUp, Building2 } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Page } from '@/models/Page';
import { Product } from '@/models/Product';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import TempoHeroSection from '@/components/home/TempoHeroSection';
import ShippingFlightSection from '@/components/home/ShippingFlightSection';
import BambooSocksSpotlight from '@/components/home/BambooSocksSpotlight';

export const revalidate = 60; // ISR cache revalidation

async function getHomeData() {
  try {
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
  } catch (error) {
    console.warn('Database connection unavailable for home page, using fallback defaults:', error);
    return {
      categories: [
        { name: 'Bamboo Socks', slug: 'bamboo-socks', coverImage: '/products/bamboo-socks-pristine.jpg', description: '100% natural organic bamboo fiber athletic socks in recyclable cylindrical eco-tubes. Naturally anti-bacterial, breathable, and ultra-soft.' },
        { name: 'Running Shoes', slug: 'running-shoes', coverImage: '/categories/running-shoes.webp', description: 'Precision-engineered athletic runners designed for maximum energy return.' },
        { name: 'Marathon Shoes', slug: 'marathon-shoes', coverImage: '/categories/marathon-shoes.webp', description: 'Ultra-lightweight high-mileage footwear with responsive carbon-infused foam.' },
        { name: 'Track & Field Shoes', slug: 'track-field-shoes', coverImage: '/categories/track-field-shoes.webp', description: 'Aerodynamic spike-plate footwear engineered for explosive acceleration.' },
        { name: 'Football Shoes', slug: 'football-shoes', coverImage: '/categories/football-shoes.webp', description: 'Molded firm-ground cleats crafted for tactile ball control and sudden directional bursts.' },
      ],
      page: {},
      featuredProducts: [],
    };
  }
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
    videoUrl: '/videos/hero-sprint.webm',
  };

  const rawHighlights = page?.sections?.highlights?.metrics || [];
  
  // Standardized 5 core metrics with clean icons and descriptions
  const defaultMetrics = [
    {
      stat: '4',
      unit: 'Units',
      label: 'Manufacturing Plants',
      detail: 'Dedicated cutting, molding & vulcanization facilities',
      icon: Factory,
    },
    {
      stat: '130,000',
      unit: 'sq. ft.',
      label: 'Industrial Floor Space',
      detail: 'High-volume production lines and assembly floors',
      icon: Layers,
    },
    {
      stat: '4,00,000',
      unit: 'Pairs / Mo',
      label: 'Monthly Production',
      detail: 'Scalable capacity for institutional & tournament supply',
      icon: TrendingUp,
    },
    {
      stat: '12',
      unit: 'States',
      label: 'Operational Reach',
      detail: 'Pan-India commercial & institutional distribution network',
      icon: MapPin,
    },
    {
      stat: '₹3 Cr+',
      unit: 'Annual',
      label: 'Commercial Scale',
      detail: 'Established institutional tenders and wholesale turnover',
      icon: ShieldCheck,
    },
  ];

  // Map any database-provided metrics cleanly into the high-end format
  const metricsList = defaultMetrics.map((def, idx) => {
    const raw = rawHighlights[idx];
    if (!raw) return def;

    const rawVal = String(raw.value || '').trim();
    let stat = def.stat;
    let unit = def.unit;

    if (idx === 0) {
      stat = rawVal.match(/[\d,]+/)?.[0] || '4';
      unit = 'Plants';
    } else if (idx === 1) {
      stat = rawVal.replace(/sq\.?\s*ft\.?/i, '').trim() || '130,000';
      unit = 'sq. ft.';
    } else if (idx === 2) {
      stat = rawVal.match(/[\d,]+/)?.[0] || '4,00,000';
      unit = 'Pairs / Mo';
    } else if (idx === 3) {
      stat = rawVal.match(/[\d,]+/)?.[0] || '12';
      unit = 'States';
    } else if (idx === 4) {
      stat = '₹3 Cr+';
      unit = 'Annual';
    }

    return {
      stat,
      unit,
      label: def.label,
      detail: def.detail,
      icon: def.icon,
    };
  });

  return (
    <div className="flex flex-col">
      {/* SECTION 2: SNEAKO-STYLE 3D HERO (MATCHING SNEAKO FRAMER EFFECTS & ANIMATION) */}
      <TempoHeroSection
        headline="Air Flexs"
        subheadline="A comfort elegance that your foot needs."
        primaryCtaText="Buy now"
        primaryCtaLink="/products"
        secondaryCtaText="Business Enquiry"
        secondaryCtaLink="/contact"
        videoUrl={hero.videoUrl || '/videos/hero-sprint.webm'}
      />

      {/* SECTION 3: COMPANY INFRASTRUCTURE & SCALE */}
      <section className="bg-stone-50/60 border-y border-stone-200/80 py-20 relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Scale &amp; Infrastructure
            </div>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-stone-950 tracking-tight leading-tight">
              Manufacturing &amp; Supply Capabilities
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2.5 leading-relaxed max-w-2xl font-normal">
              Industrial footwear production capacity engineered for bulk commercial procurement, athlete team kits, and nationwide institutional distribution.
            </p>
          </div>

          {/* Symmetrical 5-Column High-Level Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {metricsList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl border border-stone-200/90 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.08)] hover:border-brand-orange/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top subtle orange accent highlight on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon & Live Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-stone-100/90 border border-stone-200/60 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/20 text-stone-700 group-hover:text-brand-orange flex items-center justify-center transition-colors duration-300">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 group-hover:bg-brand-orange/10 text-[10px] font-bold text-stone-500 group-hover:text-brand-orange transition-colors uppercase tracking-wider">
                      Verified
                    </span>
                  </div>

                  {/* Stat Number & Unit */}
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-sans text-3xl sm:text-4xl lg:text-[38px] font-black tracking-tight text-stone-950 leading-none tabular-nums">
                        {item.stat}
                      </span>
                      {item.unit && (
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-orange">
                          {item.unit}
                        </span>
                      )}
                    </div>

                    {/* Label & Description */}
                    <div className="mt-3.5 pt-3.5 border-t border-stone-100">
                      <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-stone-800 leading-snug">
                        {item.label}
                      </h3>
                      <p className="text-[12px] text-stone-500 mt-1.5 leading-relaxed font-normal">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3.5: WORLD WIDE SHIPPING (FLIGHT COMING FROM RIGHT TO LEFT WITH FALLING CARGO) */}
      <ShippingFlightSection />

      {/* SECTION 3.8: BAMBOO SOCKS SPOTLIGHT (HIGHLIGHTED ACCESSORY WITH SHOES) */}
      <BambooSocksSpotlight />

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
            {categories.map((cat: any) => {
              let coverImg = cat.coverImage || `/categories/${cat.slug}.webp`;
              if (
                coverImg.includes('unsplash.com') ||
                coverImg.includes('photo-1511556532299') ||
                coverImg.includes('photo-1608231387042') ||
                coverImg.includes('photo-1542291026') ||
                coverImg.includes('photo-1584735935682') ||
                coverImg.includes('photo-1551107696')
              ) {
                coverImg = `/categories/${cat.slug}.webp`;
              }
              const safeAlt = (cat.imageAlt || cat.name || 'KSports Athletic Footwear').replace(/Klub /gi, 'KSports ');

              return (
                <Link
                  key={cat._id}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col bg-stone-50/50 hover:bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-900 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={coverImg}
                      alt={safeAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/5 group-hover:bg-transparent transition-colors duration-300" />
                    {cat.slug === 'bamboo-socks' && (
                      <div className="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-md flex items-center gap-1.5 z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Eco Launch · 3 Pairs ₹499
                      </div>
                    )}
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
              );
            })}
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
                let primaryImg =
                  product.images?.find((img: any) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  `/categories/${product.categoryId?.slug || 'marathon-shoes'}.webp`;
                if (
                  primaryImg.includes('unsplash.com') ||
                  primaryImg.includes('photo-1511556532299') ||
                  primaryImg.includes('photo-1608231387042') ||
                  primaryImg.includes('photo-1542291026') ||
                  primaryImg.includes('photo-1584735935682') ||
                  primaryImg.includes('photo-1551107696')
                ) {
                  primaryImg = `/categories/${product.categoryId?.slug || 'marathon-shoes'}.webp`;
                }
                const safeName = (product.name || 'KSports Footwear').replace(/Klub /gi, 'KSports ');

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-900 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={safeName}
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
                          {safeName}
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

      {/* SECTION 5: ABOUT KSPORTS */}
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
                KSports is an Indian corporate sports footwear manufacturer dedicated to producing athletic footwear built to the rigorous demands of athletes, competitive sports academies, and institutional programs nationwide.
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
                  alt="KSports Industrial Production"
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
              With dedicated manufacturing units and specialized sole vulcanization, stitching, and assembly lines, KSports is structured to deliver dependable consistency across high-volume institutional footwear consignments.
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
            Partner with KSports for bulk institutional orders, corporate athletic programs, tournament shoe procurement, and regional distribution partnerships.
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
