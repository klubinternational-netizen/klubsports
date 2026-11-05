import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Factory, Award, Target, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Page } from '@/models/Page';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About Us | KSports Premium Footwear',
  description:
    'Learn about KSports, our sports footwear manufacturing capabilities, athlete-first engineering, and pan-India institutional distribution.',
};

export default async function AboutPage() {
  let pageData: any = {};
  try {
    await connectToDatabase();
    const page = await Page.findOne({ key: 'about', isPublished: true }).lean();
    pageData = JSON.parse(JSON.stringify(page || {}));
  } catch (error) {
    console.warn('Database connection unavailable for about page, using fallback defaults:', error);
  }

  const pillars = pageData.sections?.pillars || [
    {
      title: 'Sport-Specific Ergonomics',
      description:
        'Every shoe in the KSports line is constructed around the kinetic demands of that specific sport — non-marking natural rubber for indoor badminton, rigid propulsion plates for sprint spikes, and rugged lugged compounds for off-road trails.',
    },
    {
      title: 'High-Volume Manufacturing',
      description:
        'With dedicated manufacturing facilities and specialized assembly lines, we support large-scale institutional tenders, school athletic kits, and nationwide wholesale partnerships.',
    },
    {
      title: 'Advanced Material Science',
      description:
        'We engineer footwear using supercritical responsive foams, TPU torsional shanks, and breathable high-abrasion mesh uppers built to withstand rigorous training regimes.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Keyframe Animations for Smooth Left-to-Right Entrance & Ambient Sports Lighting */}
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

        @keyframes sportsGlowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
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
        .anim-sports-pulse {
          animation: sportsGlowPulse 6s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section: Athletic Stadium Heritage Atmosphere */}
      <section className="bg-gradient-to-br from-[#060b17] via-[#0c1833] to-[#081224] text-white pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden border-b border-blue-900/40">
        {/* Athletic Mesh Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient Sports Floodlights & Warm Heritage Orange Glows */}
        <div className="absolute -top-32 -right-10 w-[550px] h-[550px] bg-brand-orange/20 rounded-full blur-[140px] pointer-events-none anim-sports-pulse" />
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-20 right-1/3 w-[380px] h-[380px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

        {/* Dynamic Running Track Vector Arcs & Kinetic Velocity Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
        >
          <defs>
            <linearGradient id="trackGradAbout1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="trackGradAbout2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M-100,550 C300,480 600,600 1100,280 C1300,150 1500,80 1600,0"
            fill="none"
            stroke="url(#trackGradAbout1)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
          />
          <path
            d="M-100,590 C320,520 620,640 1120,320 C1320,190 1520,120 1620,40"
            fill="none"
            stroke="url(#trackGradAbout1)"
            strokeWidth="1.5"
          />
          <path
            d="M-100,630 C340,560 640,680 1140,360 C1340,230 1540,160 1640,80"
            fill="none"
            stroke="url(#trackGradAbout2)"
            strokeWidth="1"
          />
          <line x1="12%" y1="0" x2="28%" y2="100%" stroke="url(#trackGradAbout2)" strokeWidth="1" opacity="0.4" />
          <line x1="48%" y1="0" x2="64%" y2="100%" stroke="url(#trackGradAbout2)" strokeWidth="1" opacity="0.3" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Animated Text Content (Smooth Left-to-Right Entrance) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Breadcrumb Navigation */}
              <nav className="anim-slide-left-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-brand-orange font-bold">About Us</span>
              </nav>

              {/* Heritage Badge */}
              <div className="anim-slide-left-2 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-white text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm backdrop-blur-md">
                <Target className="w-3.5 h-3.5 text-brand-orange" />
                <span>Since 2015 · Indian Footwear Engineering</span>
              </div>

              {/* Main Headline */}
              <h1 className="anim-slide-left-3 font-display text-4xl sm:text-6xl font-extrabold tracking-tight uppercase leading-[1.08]">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-brand-orange">KSports</span>
              </h1>

              {/* Description Paragraph */}
              <p className="anim-slide-left-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Engineering high-performance corporate sports footwear designed to meet the rigorous demands of athletes, academies, and institutional sporting programs across India.
              </p>

              {/* Credibility Highlights */}
              <div className="anim-slide-left-5 pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-medium text-slate-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
                  Since 2015
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Pan-India Institutional Reach
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Sport-Specific Construction
                </span>
              </div>
            </div>

            {/* Right Column: Athletic Heritage Glassmorphic Card (Slide Right-to-Left) */}
            <div className="lg:col-span-4 anim-slide-right hidden lg:block">
              <div className="relative rounded-2xl bg-white/[0.05] border border-white/10 p-6 backdrop-blur-xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold">
                      <Zap className="w-4 h-4 text-brand-orange" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white">KSports Heritage</div>
                      <div className="text-[11px] text-slate-400">Established 2015 · India</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                    Official
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="text-xl font-extrabold text-white">10+ Yrs</div>
                    <div className="text-[11px] text-slate-400 font-medium">Industry Experience</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="text-xl font-extrabold text-brand-orange">4 Plants</div>
                    <div className="text-[11px] text-slate-400 font-medium">Manufacturing Base</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="text-xl font-extrabold text-white">4,00,000</div>
                    <div className="text-[11px] text-slate-400 font-medium">Pairs / Month</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="text-xl font-extrabold text-blue-400">12 States</div>
                    <div className="text-[11px] text-slate-400 font-medium">Distribution Reach</div>
                  </div>
                </div>

                <Link
                  href="/manufacturing"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
                >
                  <span>View Infrastructure</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Overview & Brand Identity */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Brand Identity
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Dedicated to Athletic Integrity & Manufacturing Precision
              </h2>
              <div className="text-stone-600 text-base space-y-4 leading-relaxed">
                <p>
                  Established in <strong>2015</strong>, <strong>KSports</strong> is an official Indian corporate sports footwear manufacturer. Over more than a decade of athletic footwear engineering, our operations have bridged the gap between tournament-grade performance athletic footwear and accessible, high-volume institutional procurement.
                </p>
                <p>
                  Whether supplying statewide school sports programs, corporate sporting events, competitive running clubs, or regional athletic academies, KSports ensures consistent adherence to dimensional stability, shock absorption, and sole traction standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  <span>Official Brand Assurance · Est. 2015</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  KSports operates with strict brand authenticity. All corporate communications, product labelling, and institutional contracts are executed under the registered <strong>KSports</strong> identity.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100">
                <Image
                  src="/categories/running-shoes.webp"
                  alt="KSports Performance Athletic Footwear"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Pillars */}
      <section className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Core Principles
            </span>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight mt-1">
              Engineered For Athletic Demands
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Our footwear manufacturing philosophy focuses on the functional mechanics of sport.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-8">
            {pillars.map((pillar: any, idx: number) => (
              <div
                key={idx}
                className={`bg-white p-4 sm:p-8 rounded-xl border border-stone-200 shadow-sm space-y-2.5 sm:space-y-4 hover:border-brand-orange/40 transition-colors ${
                  idx === 2 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold text-xs sm:text-base">
                  0{idx + 1}
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-stone-900">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source-Deck Operational Footprint Notice */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-stone-200 rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-stone-50 to-white shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Factory className="w-6 h-6 text-brand-orange" />
              <h3 className="text-xl font-bold text-stone-900">
                Operational Reach & Industrial Infrastructure
              </h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Based on our client presentation parameters, KSports is anchored by an industrial infrastructure featuring 4 dedicated manufacturing units with an aggregate factory floor area of approximately 130,000 sq. ft., supporting a monthly output capacity of four lakh units across 12 Indian states.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-stone-200">
              <div>
                <div className="text-2xl font-extrabold text-brand-orange">2015</div>
                <div className="text-xs text-stone-500 font-medium">Established Year</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-stone-900">4</div>
                <div className="text-xs text-stone-500 font-medium">Production Facilities*</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-stone-900">130K</div>
                <div className="text-xs text-stone-500 font-medium">Sq. Ft. Factory Area*</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-stone-900">4,00,000</div>
                <div className="text-xs text-stone-500 font-medium">Units Monthly Capacity*</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-stone-900">12</div>
                <div className="text-xs text-stone-500 font-medium">Indian States Reach*</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 italic">
              *Figures sourced from the client source presentation deck and maintained pending official certified client audit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section: Athletic Stadium Footer Accent */}
      <section className="py-20 bg-gradient-to-br from-[#060b17] via-[#0c1833] to-[#081224] text-white text-center relative overflow-hidden border-t border-blue-900/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-orange/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Partner with KSports</h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
            Connect with our corporate team to explore institutional bulk procurement, distribution channels, and athletic partnership programs.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-xl transition-all shadow-lg hover:shadow-brand-orange/25"
            >
              <span>Contact Corporate Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
