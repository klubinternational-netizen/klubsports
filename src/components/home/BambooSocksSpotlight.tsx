'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Leaf,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Zap,
} from 'lucide-react';

export default function BambooSocksSpotlight() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#f3f9f1] via-[#f7faf5] to-white border-y border-emerald-100 overflow-hidden font-inter select-none">
      {/* 1. GIANT BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className="font-ranchers text-[20vw] sm:text-[18vw] lg:text-[15vw] text-emerald-900/[0.035] uppercase tracking-normal select-none">
          BAMBOO
        </span>
      </div>

      {/* 2. ATMOSPHERIC NATURAL RADIAL GLOWS */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-emerald-200/30 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-[480px] h-[480px] bg-lime-200/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[280px] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-[11px] font-bold tracking-[0.16em] uppercase shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
              <span>Organic Range · KSports Eco-Line</span>
            </div>
            <a
              href="#sports-shoes"
              className="text-[11px] font-bold text-stone-600 hover:text-stone-950 hover:underline uppercase tracking-wider hidden sm:inline"
            >
              Browse Sports Shoes ↓
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Official MRP ₹499 · 3-Pairs Tube
            </span>
          </div>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ========================================================= */}
          {/* LEFT: AUTHENTIC PRODUCT STAGE                             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Stage Image Card - Clean, Huge, Authentic */}
            <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white border border-emerald-200/70 shadow-[0_25px_60px_-15px_rgba(16,78,41,0.12)] group">
              
              {/* Product Aspect Container */}
              <div className="relative aspect-[4/3.5] sm:aspect-[4/3.4] w-full bg-gradient-to-b from-emerald-50/20 to-white">
                <Image
                  src="/products/bamboo-socks-pristine.jpg"
                  alt="KSports 100% Organic Bamboo Athletic Socks in Cylindrical Eco-Tube"
                  fill
                  className="object-contain p-3 sm:p-5 transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Floating Specification Pills */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200/90 text-[11px] font-bold text-emerald-950 shadow-sm">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  100% Organic Bamboo Yarn
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 text-[11px] font-bold text-stone-900 shadow-sm">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Zero-Plastic Paper Tube
                </span>
              </div>

              {/* Bottom Authentic Badge */}
              <div className="absolute bottom-4 right-4 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md text-[11px] font-bold text-white shadow-sm">
                  Official 3-Pairs Pack · ₹499
                </span>
              </div>
            </div>

            {/* Sub-label Under Image Card */}
            <p className="text-[11px] text-stone-500 font-medium text-center mt-3 tracking-wide">
              Official KSports Product Package: Recyclable Kraft Paper Cylinder with 3 Athletic Pairs
            </p>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: STORY, REAL SPECS & ACTIONS                        */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-800 block mb-1.5">
                NATURAL FIBER ATHLETIC ACCESSORIES
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-[1.08] uppercase">
                100% Organic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700">
                  Bamboo Athletic Socks
                </span>
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-3.5 leading-relaxed">
                Knitted from certified <strong>100% natural organic bamboo yarn</strong> to deliver superior breathability, thermo-regulating comfort, and natural anti-microbial odor protection for competitive athletes, daily training, and active wear.
              </p>
            </div>

            {/* 4 Authentic Core Specification Cards - Mobile 2-by-2 Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-stone-900 uppercase tracking-wide">
                    100% Bamboo Yarn
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Naturally hypoallergenic &amp; ultra soft.
                  </p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Bamboo Kun Anti-Bacterial
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Naturally eliminates match sweat odor.
                  </p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Zero-Plastic Eco Tube
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Recyclable kraft tube packaging.
                  </p>
                </div>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Arch Compression
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Reinforced heel &amp; blister-free closure.
                  </p>
                </div>
              </div>
            </div>

            {/* Authentic Pack Spec Summary Bar */}
            <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="font-bold text-stone-900">3 Pairs in Pack:</span>
                <span className="text-stone-600">Black · Eco Tan · Navy</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
                  Free Size (UK 6–11)
                </span>
                <span className="font-bold text-stone-950 text-sm">
                  ₹499 <span className="text-[10px] text-stone-500 font-normal">MRP</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/products/bamboo-socks-3-pack"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <span>Order Bamboo Pack (₹499)</span>
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
                Bulk Supply Desk →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
