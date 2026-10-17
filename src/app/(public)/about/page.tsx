import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Factory, Award, Target, CheckCircle2 } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Page } from '@/models/Page';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About Us | Klub Sports Premium Footwear',
  description:
    'Learn about Klub Sports, our sports footwear manufacturing capabilities, athlete-first engineering, and pan-India institutional distribution.',
};

export default async function AboutPage() {
  await connectToDatabase();
  const page = await Page.findOne({ key: 'about', isPublished: true }).lean();
  const pageData = JSON.parse(JSON.stringify(page || {}));

  const pillars = pageData.sections?.pillars || [
    {
      title: 'Sport-Specific Ergonomics',
      description:
        'Every shoe in the Klub Sports line is constructed around the kinetic demands of that specific sport — non-marking natural rubber for indoor badminton, rigid propulsion plates for sprint spikes, and rugged lugged compounds for off-road trails.',
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
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ee7700_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-orange text-xs font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Corporate Profile</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase">
              About Klub Sports
            </h1>
            <p className="text-stone-300 text-lg sm:text-xl leading-relaxed">
              Engineering high-performance corporate sports footwear designed to meet the rigorous demands of athletes, academies, and institutional sporting programs across India.
            </p>
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
                  <strong>Klub Sports</strong> is the official corporate brand name representing our footwear manufacturing enterprise. Our operations focus on bridging the gap between premium performance athletic footwear and accessible, high-volume institutional procurement.
                </p>
                <p>
                  Whether supplying statewide school sports programs, corporate sporting events, competitive running clubs, or regional athletic academies, Klub Sports ensures consistent adherence to dimensional stability, shock absorption, and sole traction standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  <span>Official Brand Assurance</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Klub Sports operates with strict brand authenticity. All corporate communications, product labelling, and institutional contracts are executed under the registered <strong>Klub Sports</strong> identity.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
                  alt="Klub Sports Athletic Footwear"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-4 hover:border-brand-orange/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-stone-900">{pillar.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{pillar.description}</p>
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
              Based on our client presentation parameters, Klub Sports is anchored by an industrial infrastructure featuring 4 dedicated manufacturing units with an aggregate factory floor area of approximately 130,000 sq. ft., supporting a monthly output capacity of four lakh units across 12 Indian states.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-200">
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

      {/* CTA Section */}
      <section className="py-20 bg-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Partner with Klub Sports</h2>
          <p className="text-stone-300 text-base max-w-xl mx-auto leading-relaxed">
            Connect with our corporate team to explore institutional bulk procurement, distribution channels, and athletic partnership programs.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-md transition-colors shadow-md"
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
