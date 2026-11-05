import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ShieldCheck, Layers, Award, Cpu, Factory, Gauge } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Page } from '@/models/Page';
import { Product } from '@/models/Product';
import TempoHeroSection from '@/components/home/TempoHeroSection';
import ShippingFlightSection from '@/components/home/ShippingFlightSection';
import BrandsShowcaseSection from '@/components/home/BrandsShowcaseSection';
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
        { name: 'Jogging Shoes (Men)', slug: 'jogging-shoes-men', coverImage: '/categories/jogging-shoes-men.webp', description: 'Lightweight breathable jacquard mesh jogging shoes engineered for men.' },
        { name: 'Jogging Shoes (Women)', slug: 'jogging-shoes-women', coverImage: '/categories/jogging-shoes-women.webp', description: 'Plush athletic jogging shoes designed with responsive cushioning for women.' },
        { name: 'Walk Shoes (Men)', slug: 'walk-shoes-men', coverImage: '/categories/walk-shoes-men.webp', description: 'All-day ergonomic walking footwear for men featuring flexible groove outsoles.' },
        { name: 'Walk Shoes (Women)', slug: 'walk-shoes-women', coverImage: '/categories/walk-shoes-women.webp', description: 'Featherlight comfort walking shoes for women with memory-foam footbeds.' },
        { name: 'Badminton Shoes', slug: 'badminton-shoes', coverImage: '/categories/badminton-shoes.webp', description: 'Non-marking gum rubber court shoes engineered for rapid lateral transitions.' },
        { name: 'Cricket Shoes', slug: 'cricket-shoes', coverImage: '/categories/cricket-shoes.webp', description: 'High-traction rubber turf stud cricket shoes engineered with reinforced toe-shielding.' },
        { name: 'Socks', slug: 'socks', coverImage: '/products/bamboo-socks-pristine.jpg', description: '3 Pairs Pouch Basic (₹119), Economy (₹249), 7 Days Signature (₹499) & Bamboo Tubes.' },
        { name: 'Insoles', slug: 'insoles', coverImage: '/categories/insoles.webp', description: 'Orthopedic ergonomic arch support and shock-absorbing dual-gel sports insoles.' },
      ],
      page: {},
      featuredProducts: [],
    };
  }
}

export default async function HomePage() {
  const { categories, page } = await getHomeData();
  const shoeCategories = categories.filter((cat: any) => cat.slug !== 'bamboo-socks' && cat.slug !== 'socks' && cat.slug !== 'insoles');
  const socksCategory = categories.find((cat: any) => cat.slug === 'socks' || cat.slug === 'bamboo-socks');
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

  return (
    <div className="flex flex-col">
      {/* SECTION 2: SNEAKO-STYLE 3D HERO (MATCHING SNEAKO FRAMER EFFECTS & ANIMATION) */}
      <TempoHeroSection
        headline="KSPORTS"
        subheadline="Engineered with signature athletic precision, ergonomic leather & shock-absorbing midsole."
        primaryCtaText="Explore Products"
        primaryCtaLink="/products"
        secondaryCtaText="Business Enquiry"
        secondaryCtaLink="/contact"
        videoUrl={hero.videoUrl || '/videos/hero-sprint.webm'}
      />

      {/* SECTION 3: WORLD WIDE SHIPPING (FLIGHT COMING FROM RIGHT TO LEFT WITH FALLING CARGO) */}
      <ShippingFlightSection />

      {/* SECTION 3.6: 100% KSPORTS ORIGINAL PERFORMANCE SHOWCASE (BLUE BANNER WITH 3D FLOATING TRACTION SOLE) */}
      <BrandsShowcaseSection />

      {/* SECTION 3.8: BAMBOO SOCKS DEDICATED CATEGORY SPOTLIGHT */}
      <div id="bamboo-socks">
        <BambooSocksSpotlight />
      </div>

      {/* SECTION 4: SPORTS FOOTWEAR CATEGORIES (SHOES ONLY) */}
      <section id="sports-shoes" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[11px] font-bold tracking-[0.16em] uppercase mb-3 shadow-xs">
                <span>Sports Footwear · 6 Categories</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight mt-1">
                Performance Shoes by Category
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2.5 max-w-2xl font-normal leading-relaxed">
                Explore sport-specific footwear engineered to the surface demands, traction dynamics, and biomechanics of competitive athletes.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto">
              <a
                href="#bamboo-socks"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-2xs"
              >
                <span>🧦 Bamboo Socks Category</span>
              </a>
              <Link
                href="/products?group=shoes"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-950 hover:text-brand-orange transition-colors group border-b-2 border-stone-950 hover:border-brand-orange pb-0.5 ml-2"
              >
                <span>View All Shoes</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Dynamic Category Cards - Mobile 2-by-2 Grid (Shoes Only) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {shoeCategories.map((cat: any) => {
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
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="p-3 sm:p-5 lg:p-7 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-display text-sm sm:text-lg lg:text-xl font-bold uppercase tracking-tight text-stone-950 group-hover:text-brand-orange transition-colors line-clamp-1 sm:line-clamp-none">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs lg:text-sm text-stone-600 mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                        {cat.description || 'Specialized athletic footwear engineered for professional sports performance.'}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-stone-200/80 flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-brand-orange group-hover:text-stone-950 transition-colors">
                      <span className="hidden sm:inline">Explore Category</span>
                      <span className="sm:hidden">Explore</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: ABOUT KSPORTS */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange text-[11px] font-bold uppercase tracking-[0.18em]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Since 2015 · Official Athletic Footwear</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight leading-[1.08]">
                Built Around Performance, Ergonomics &amp; Scale
              </h2>
              <p className="text-stone-600 text-base leading-relaxed">
                KSports is an Indian corporate sports footwear manufacturer dedicated to producing athletic footwear built to the rigorous demands of athletes, competitive sports academies, and institutional programs nationwide.
              </p>

              {/* 2-by-2 Mobile Feature Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/60 border border-stone-200/80 hover:border-brand-orange/40 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-950">
                    Surface Compounds
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 sm:mt-1.5 leading-relaxed">
                    Court non-marking gums, sprint Pebax plates &amp; cleated outsoles.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/60 border border-stone-200/80 hover:border-brand-orange/40 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-950">
                    Institutional Scale
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 sm:mt-1.5 leading-relaxed">
                    Structured procurement for academies, leagues &amp; distributors.
                  </p>
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
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 group">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
                  alt="KSports Industrial Production"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white pointer-events-none">
                  <span className="text-xs font-bold uppercase tracking-widest bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    Precision Lasting Floor
                  </span>
                  <span className="text-[11px] font-semibold text-stone-300">
                    130,000 Sq. Ft.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: HIGH-END LUXURY MANUFACTURING INFRASTRUCTURE */}
      <section className="py-24 sm:py-28 bg-[#090b10] text-white relative border-y border-stone-800/80 overflow-hidden">
        {/* Ambient Sports Floodlights */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[11px] font-bold uppercase tracking-[0.18em]">
              <Factory className="w-3.5 h-3.5" />
              <span>Industrial Footwear Infrastructure</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-[1.08]">
              Industrial Footwear Manufacturing &amp; Quality Execution
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              With dedicated manufacturing units and specialized sole vulcanization, stitching, and assembly lines, KSports is structured to deliver dependable consistency across high-volume institutional footwear consignments.
            </p>
          </div>

          {/* Symmetrical 2x2 Grid on Mobile & 4-Column on Desktop */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {/* Card 1: Sole Tooling & Polymers */}
            <div className="relative rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950/90 border border-white/10 hover:border-brand-orange/50 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                    01 · TOOLING
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-white mb-1 sm:mb-2">
                  Sole Molding &amp; Compounds
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">
                  Precision tooling for dual-density EVA midsoles, virgin gum rubbers, and abrasion-resistant outsoles.
                </p>
              </div>
            </div>

            {/* Card 2: Upper Mesh & Reinforced Stitching */}
            <div className="relative rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950/90 border border-white/10 hover:border-brand-orange/50 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                    02 · UPPER TECH
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-white mb-1.5 sm:mb-2">
                  Upper Construction &amp; Mesh
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">
                  Engineered jacquard meshes, reinforced synthetic toe caps, and high-abrasion stitch assemblies for longevity.
                </p>
              </div>
            </div>

            {/* Card 3: Pneumatic Lasting & Zero-Separation Bonding */}
            <div className="relative rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950/90 border border-white/10 hover:border-brand-orange/50 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                    03 · BONDING
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-white mb-1.5 sm:mb-2">
                  Pneumatic Lasting &amp; Bonding
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">
                  High-pressure hydraulic press bonding and anatomical lasts ensuring zero sole separation under match stress.
                </p>
              </div>
            </div>

            {/* Card 4: Institutional Supply Scale */}
            <div className="relative rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950/90 border border-white/10 hover:border-brand-orange/50 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Factory className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                    04 · SCALE
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-white mb-1.5 sm:mb-2">
                  High-Capacity Scaling
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">
                  Configured to deliver 4,00,000 pairs monthly for tournaments, academies, and statewide institutional supply.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/manufacturing"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white bg-brand-orange hover:bg-brand-orange-dark rounded-xl transition-all shadow-lg hover:shadow-brand-orange/25"
            >
              <span>Explore Manufacturing Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              <span>Institutional Tenders</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: LUXURY BUSINESS PROCUREMENT CALL TO ACTION */}
      <section className="py-24 sm:py-28 bg-gradient-to-b from-orange-50/70 via-stone-50 to-white border-b border-stone-200/80 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange-dark text-[11px] font-bold uppercase tracking-[0.18em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CONFIDENTIAL BUSINESS DESK · EST. 2015</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight leading-[1.08]">
            Looking for a Sports Footwear Partner?
          </h2>

          <p className="text-stone-700 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Partner with KSports for bulk institutional orders, corporate athletic programs, tournament shoe procurement, and regional distribution partnerships.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-stone-950 hover:bg-brand-orange active:scale-[0.98] rounded-xl transition-all duration-300 shadow-xl group"
            >
              <span>Discuss Your Requirements</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/918886303030?text=Hello%20KSports!%20I%20would%20like%20to%20discuss%20bulk%20sports%20footwear%20procurement."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 hover:text-white bg-emerald-100/80 hover:bg-emerald-600 border border-emerald-300/80 rounded-xl transition-all shadow-sm"
            >
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
