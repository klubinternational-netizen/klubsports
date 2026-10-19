import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Factory, ShieldAlert, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Page } from '@/models/Page';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Manufacturing Capabilities | Klub Sports',
  description:
    'Explore the industrial footwear manufacturing facilities, production scale, and quality standards behind Klub Sports corporate athletic footwear.',
};

export default async function ManufacturingPage() {
  let pageData: any = {};
  try {
    await connectToDatabase();
    const page = await Page.findOne({ key: 'manufacturing', isPublished: true }).lean();
    pageData = JSON.parse(JSON.stringify(page || {}));
  } catch (error) {
    console.warn('Database connection unavailable for manufacturing page, using fallback defaults:', error);
  }

  const capabilities = pageData.sections?.capabilities || [
    {
      title: 'Four Dedicated Manufacturing Units',
      detail:
        'Multi-unit industrial infrastructure allowing concurrent production of indoor court shoes, cleated field boots, and lightweight running trainers.',
      figure: '4 Factories',
    },
    {
      title: 'Expansive Factory Footprint',
      detail:
        'Spanning approximately 130,000 square feet of dedicated cutting, stitching, sole molding, and vulcanization floor space.',
      figure: '130,000 sq. ft.',
    },
    {
      title: 'High-Throughput Output',
      detail:
        'Configured for high-volume monthly capacity to satisfy nationwide distributor orders and seasonal institutional athletic tenders.',
      figure: '4,00,000 Pairs/Mo',
    },
    {
      title: 'Pan-India Distribution Network',
      detail:
        'Active commercial distribution footprint spanning 12 Indian states with dedicated regional supply channels.',
      figure: '12 States',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-stone-950 text-white pt-32 pb-20 lg:pt-36 lg:pb-24 relative overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 opacity-90 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-orange text-xs font-semibold uppercase tracking-wider">
              <Factory className="w-3.5 h-3.5" />
              <span>Production Scale</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase">
              Manufacturing Capabilities
            </h1>
            <p className="text-stone-300 text-lg sm:text-xl leading-relaxed">
              Modern athletic footwear production infrastructure engineered for institutional consistency, dimensional reliability, and high-volume delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Quality Standards & Trust Banner */}
      <section className="bg-stone-100/70 border-b border-stone-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
            <span className="font-semibold text-stone-900">Certified Industrial Manufacturing</span>
            <span className="text-stone-400">|</span>
            <span>Rigorous tensile, sole adhesion, and high-abrasion durability testing across all production runs.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            <span>• 100% Inspection</span>
            <span>• Pan-India Dispatch</span>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((cap: any, idx: number) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-8 border border-stone-200 hover:border-brand-orange/40 hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                    {cap.figure}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mt-3">{cap.title}</h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">{cap.detail}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center gap-2 text-xs font-semibold text-brand-orange uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Industrial Standard Manufacturing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Facilities Imagery & Technical Processes */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Manufacturing Processes
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Precision Stitching, Injection Molding & Lasting
              </h2>
              <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
                <p>
                  From computerized pattern cutting to multi-density EVA sole injection and pneumatic sole-lasting, our factory floor is organized into specialized production cells dedicated to sport-specific footwear categories.
                </p>
                <p>
                  Specialized lasting machines ensure uniform toe curvature and arch support, preventing midfoot torsion under high rotational torque during sports maneuvers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-stone-800/80 border border-stone-700">
                  <Cpu className="w-5 h-5 text-brand-orange mb-2" />
                  <h4 className="text-sm font-bold text-white">Sole Vulcanization & Bonding</h4>
                  <p className="text-xs text-stone-400 mt-1">High-pressure hydraulic press bonding for zero sole separation.</p>
                </div>
                <div className="p-4 rounded-lg bg-stone-800/80 border border-stone-700">
                  <ShieldCheck className="w-5 h-5 text-brand-orange mb-2" />
                  <h4 className="text-sm font-bold text-white">Dimensional Quality Checks</h4>
                  <p className="text-xs text-stone-400 mt-1">Strict tolerance verification across all standard size runs.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-stone-700">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
                  alt="Klub Sports Industrial Manufacturing Assembly"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Supply Call to Action */}
      <section className="py-20 bg-brand-orange-light border-t border-brand-orange/20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-3xl font-extrabold text-stone-900">
            Request an Institutional Manufacturing Tender Quote
          </h2>
          <p className="text-stone-700 text-sm sm:text-base max-w-xl mx-auto">
            Our corporate production desk assists state athletic boards, institutional tenders, corporate franchises, and sports academies with custom batch scheduling.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-md transition-colors shadow-md"
            >
              <span>Submit Production Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
