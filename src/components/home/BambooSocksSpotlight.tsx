'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Leaf,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Maximize2,
} from 'lucide-react';

const galleryViews = [
  {
    id: 'pristine',
    label: 'Eco Tube & Socks',
    sub: '3-Pair Cylinder Pack',
    image: '/products/bamboo-socks-pristine.jpg',
    aspect: 'aspect-[4/3.6]',
  },
  {
    id: 'label',
    label: 'Official Spec Label',
    sub: 'MRP ₹499 & Fabric Specs',
    image: '/products/bamboo-socks-label.png',
    aspect: 'aspect-[16/9]',
  },
  {
    id: 'styles',
    label: '5 Tube Finishes',
    sub: 'Designer Packaging Editions',
    image: '/products/bamboo-socks-styles.jpg',
    aspect: 'aspect-[16/6]',
  },
  {
    id: 'tubes',
    label: 'Tube Interior',
    sub: '3 Folded Bamboo Pairs',
    image: '/products/bamboo-socks-tubes.jpg',
    aspect: 'aspect-[4/3]',
  },
];

const tubeEditions = [
  { name: '1. Natural Kraft', color: '#c7a379' },
  { name: '2. Forest Green', color: '#2d5a3f' },
  { name: '3. White Minimal', color: '#eaeaea' },
  { name: '4. Charcoal Premium', color: '#333333' },
  { name: '5. Eco Tan with Leaf Cap', color: '#b89467' },
];

export default function BambooSocksSpotlight() {
  const [activeView, setActiveView] = useState(0);

  const currentView = galleryViews[activeView];

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#fbfdf9] via-[#f4f9f1] to-white border-y border-emerald-100/80 overflow-hidden font-inter">
      {/* Decorative Natural Ambient Leaf & Radial Highlights */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[11px] font-bold tracking-[0.16em] uppercase shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>New Launch · Pair With Footwear</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-900 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              MRP ₹499 / 3-Pairs
            </span>
          </div>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ========================================================= */}
          {/* LEFT: INTERACTIVE PRODUCT IMAGE & GALLERY                 */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Stage Image Card */}
            <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-white border border-emerald-100 shadow-[0_20px_60px_-15px_rgba(20,83,45,0.08)] group">
              <div className={`relative ${currentView.aspect} w-full transition-all duration-300`}>
                <Image
                  src={currentView.image}
                  alt={currentView.label}
                  fill
                  className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Floating Specification Pills */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 text-[11px] font-bold text-stone-900 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  100% Bamboo Yarn
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 text-[11px] font-bold text-stone-900 shadow-sm">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Zero-Plastic Paper Tube
                </span>
              </div>

              {/* Quick View Tag */}
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md text-[10px] font-semibold text-white">
                  <Maximize2 className="w-3 h-3" />
                  {currentView.label}
                </span>
              </div>
            </div>

            {/* Interactive View Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {galleryViews.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveView(idx)}
                  className={`text-left p-3 rounded-2xl border transition-all duration-200 ${
                    activeView === idx
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30 -translate-y-0.5'
                      : 'bg-white/90 text-stone-800 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <p
                    className={`text-xs font-bold leading-tight ${
                      activeView === idx ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 truncate ${
                      activeView === idx ? 'text-emerald-100' : 'text-stone-500'
                    }`}
                  >
                    {tab.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: STORY, SPECS & HIGH-CONVERSION ACTIONS             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-700 block mb-1.5">
                COMFORT NATURALLY · NATURALLY BETTER
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight uppercase">
                KSports Bamboo Socks
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                The ultimate companion for competitive athletic footwear. Knitted from <strong>100% natural organic bamboo yarn</strong> to deliver superior breathability, thermo-regulating comfort, and natural anti-microbial odor prevention.
              </p>
            </div>

            {/* 4 Core Specification Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    100% Bamboo Fiber
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Naturally hypoallergenic, anti-bacterial &amp; ultra soft.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    x3 Pairs in Eco Tube
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Assorted pairs packaged in recyclable kraft paper cylinders.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Anti-Bacterial &amp; Odorless
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Inhibits sweat odor across intense athletic match play.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Ergonomic Free Size
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Unisex ankle cut with blister-free seamless toe closure.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Packaging Editions Bar */}
            <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200/90 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Available In 5 Designer Cylinder Editions:
              </span>
              <div className="flex flex-wrap gap-2">
                {tubeEditions.map((ed, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-stone-800 shadow-2xs"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: ed.color }}
                    />
                    {ed.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/products/bamboo-socks-3-pack"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-stone-950 hover:bg-brand-orange transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <span>View Product Specs</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="https://wa.me/918886303030?text=Hello%20KSports!%20I%20am%20interested%20in%20ordering%20KSports%20Bamboo%20Socks%20(Pack%20of%203%20-%20MRP%20%E2%82%B9499)%20for%20bulk/wholesale."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all duration-300 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Enquire On WhatsApp</span>
              </a>

              <Link
                href="/contact?category=bamboo-socks&product=KSports%20100%25%20Bamboo%20Socks%20(3-Pack)"
                className="inline-flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 hover:underline px-3 py-2 transition-colors text-center"
              >
                Institutional Desk →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
