import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ShieldCheck, Layers, Award } from 'lucide-react';
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

      {/* SECTION 3: WORLD WIDE SHIPPING (FLIGHT COMING FROM RIGHT TO LEFT WITH FALLING CARGO) */}
      <ShippingFlightSection />

      {/* SECTION 3.6: 100% KSPORTS ORIGINAL PERFORMANCE SHOWCASE (BLUE BANNER WITH 3D FLOATING TRACTION SOLE) */}
      <BrandsShowcaseSection />

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

          {/* Dynamic Category Cards - Mobile 2-by-2 Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
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
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/5 group-hover:bg-transparent transition-colors duration-300" />
                    {cat.slug === 'bamboo-socks' && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-emerald-800/90 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider shadow-md flex items-center gap-1 sm:gap-1.5 z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        <span className="hidden sm:inline">Eco Launch · 3 Pairs ₹499</span>
                        <span className="sm:hidden">Eco 3-Pack</span>
                      </div>
                    )}
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
