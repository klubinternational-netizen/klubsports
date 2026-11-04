'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface TempoHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  videoUrl?: string;
}

type CategoryVariantKey = 'shoes' | 'bamboo-socks' | 'volt-runner';

interface CategoryVariant {
  id: CategoryVariantKey;
  name: string;
  categoryLabel: string;
  badgeTag: string;
  badgeTitle: string;
  headline: string;
  subheadline: string;
  dotColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  wordmarkColor: string;
  glowColor: string;
  bgGradient: string;
  image: string;
  imageAlt: string;
  pedestal: {
    top: string;
    left: string;
    right: string;
    shadowColor: string;
  };
}

const variants: Record<CategoryVariantKey, CategoryVariant> = {
  shoes: {
    id: 'shoes',
    name: 'KSports Classic Pro',
    categoryLabel: 'Shoes',
    badgeTag: 'Official',
    badgeTitle: 'Official KSports Athletic Footwear',
    headline: 'KSPORTS',
    subheadline: 'Engineered with signature athletic precision, ergonomic leather & shock-absorbing midsole.',
    dotColor: '#ee7700',
    badgeBg: '#fff7ed',
    badgeBorder: '#fed7aa',
    badgeText: '#c2410c',
    wordmarkColor: '#fed7aa',
    glowColor: 'rgba(238, 119, 0, 0.42)',
    bgGradient: 'from-[#ffedd5] via-[#fff7ed] to-[#ffffff]',
    image: '/hero-shoes/ksports-hero-shoe-1.png',
    imageAlt: 'Official KSports Classic Pro Athletic Footwear',
    pedestal: {
      top: 'linear-gradient(135deg, #ffffff 0%, #ffedd5 100%)',
      left: 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)',
      right: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)',
      shadowColor: '#7c2d12',
    },
  },
  'bamboo-socks': {
    id: 'bamboo-socks',
    name: 'Bamboo Socks (3-Pack)',
    categoryLabel: 'Bamboo Socks',
    badgeTag: 'Eco Launch',
    badgeTitle: '100% Organic Bamboo Fiber',
    headline: 'BAMBOO',
    subheadline: 'Naturally antibacterial & ultra-soft in recyclable cylindrical eco-tubes.',
    dotColor: '#2e7d32',
    badgeBg: '#e8f5e9',
    badgeBorder: '#a5d6a7',
    badgeText: '#1b5e20',
    wordmarkColor: '#c8e6c9',
    glowColor: 'rgba(129, 199, 132, 0.55)',
    bgGradient: 'from-[#f2f8f3] via-[#f5faf6] to-[#ffffff]',
    image: '/hero-shoes/bamboo-socks-cutout.png',
    imageAlt: 'KSports 100% Bamboo Athletic Socks (3-Pack Eco Tube)',
    pedestal: {
      top: 'linear-gradient(135deg, #dcedc8 0%, #c5e1a5 100%)',
      left: 'linear-gradient(180deg, #81c784 0%, #4caf50 100%)',
      right: 'linear-gradient(180deg, #a5d6a7 0%, #66bb6a 100%)',
      shadowColor: '#1b5e20',
    },
  },
  'volt-runner': {
    id: 'volt-runner',
    name: 'KSports Speed Runner',
    categoryLabel: 'Speed Runner',
    badgeTag: 'Pro Series',
    badgeTitle: 'Multi-Surface Sprint Runner',
    headline: 'SPEED PRO',
    subheadline: 'Aerodynamic lightweight footwear engineered for explosive acceleration & high mileage.',
    dotColor: '#ea580c',
    badgeBg: '#fff7ed',
    badgeBorder: '#fed7aa',
    badgeText: '#c2410c',
    wordmarkColor: '#fed7aa',
    glowColor: 'rgba(238, 119, 0, 0.42)',
    bgGradient: 'from-[#ffedd5] via-[#fff7ed] to-[#ffffff]',
    image: '/hero-shoes/ksports-hero-shoe-2.png',
    imageAlt: 'Official KSports Speed Runner Athletic Footwear',
    pedestal: {
      top: 'linear-gradient(135deg, #ffffff 0%, #ffedd5 100%)',
      left: 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)',
      right: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)',
      shadowColor: '#7c2d12',
    },
  },
};

export default function TempoHeroSection({
  headline,
  subheadline,
}: TempoHeroProps) {
  const [selectedVariant, setSelectedVariant] = useState<CategoryVariantKey>('shoes');
  const currentVariant = variants[selectedVariant];

  // 3D Mouse Parallax Tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    setTilt({
      rotateX: -y * 20, // Tilt up/down
      rotateY: x * 24,  // Tilt left/right
      x: x * 25,        // Drift X
      y: y * 18,        // Drift Y
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden min-h-[700px] lg:min-h-[840px] flex flex-col justify-between pt-24 sm:pt-28 pb-8 bg-gradient-to-b ${currentVariant.bgGradient} select-none perspective-[1200px] transition-colors duration-700`}
    >
      <style jsx>{`
        @keyframes sneakoFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-3.5deg);
          }
        }
        @keyframes shadowScale {
          0%, 100% {
            transform: scale(1);
            opacity: 0.38;
            filter: blur(4px);
          }
          50% {
            transform: scale(0.82);
            opacity: 0.18;
            filter: blur(9px);
          }
        }
        @keyframes cloudDriftBack {
          0%, 100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-14px);
          }
        }
        @keyframes cloudDriftFront {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) scale(1);
          }
          50% {
            transform: translateX(-50%) translateY(-8px) scale(1.02);
          }
        }
        @keyframes lightSweep {
          0% {
            transform: translateX(-160%) skewX(-25deg);
            opacity: 0;
          }
          30% {
            opacity: 0.5;
          }
          60%, 100% {
            transform: translateX(260%) skewX(-25deg);
            opacity: 0;
          }
        }
        .animate-sneako-float {
          animation: sneakoFloat 4.2s cubic-bezier(0.44, 0, 0.56, 1) infinite;
        }
        .animate-shadow-scale {
          animation: shadowScale 4.2s cubic-bezier(0.44, 0, 0.56, 1) infinite;
        }
        .animate-cloud-back {
          animation: cloudDriftBack 8s ease-in-out infinite;
        }
        .animate-cloud-front {
          animation: cloudDriftFront 6.5s ease-in-out infinite;
        }
        .animate-light-sweep {
          animation: lightSweep 6s ease-in-out infinite;
        }
      `}</style>

      {/* 1. TOP PILL BADGE (DYNAMIC FOR EACH CATEGORY) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-xs font-medium text-stone-700 tracking-wide transition-all duration-300 hover:scale-105">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-500"
            style={{
              backgroundColor: currentVariant.badgeBg,
              color: currentVariant.badgeText,
            }}
          >
            {currentVariant.badgeTag}
          </span>
          <span>{currentVariant.badgeTitle}</span>
        </div>
      </div>

      {/* 2. GIANT BACKGROUND WORDMARK (DYNAMIC FOR EACH CATEGORY: "KSPORTS" / "BAMBOO" / "SPEED PRO") */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span
          key={currentVariant.headline}
          className="font-ranchers leading-none select-none text-[22vw] sm:text-[18vw] lg:text-[15.5vw] tracking-tight uppercase transform -translate-y-16 sm:-translate-y-20 transition-all duration-700 drop-shadow-[0_4px_30px_rgba(238,119,0,0.12)]"
          style={{
            letterSpacing: '-0.02em',
            color: currentVariant.wordmarkColor,
          }}
        >
          {currentVariant.headline}
        </span>
      </div>

      {/* Top Ambient Glow matching current variant */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[920px] h-[360px] pointer-events-none blur-[100px] z-0 opacity-70 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${currentVariant.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Ambient Celestial Glow behind product */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[760px] h-[440px] pointer-events-none blur-[95px] z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse, ${currentVariant.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* 3. CENTERPIECE: 3D FLOATING PRODUCT, ISOMETRIC PEDESTAL & DYNAMIC SHADOW */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-5xl flex flex-col items-center justify-center">
          
          {/* The 3D Composition Stage */}
          <div
            className="relative w-[340px] sm:w-[480px] md:w-[600px] lg:w-[700px] h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            
            {/* BACK CLOUD LAYER (Behind Pedestal) */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[520px] sm:w-[720px] md:w-[860px] h-[260px] pointer-events-none z-0 opacity-80 animate-cloud-back">
              <Image
                src="/hero-shoes/uP4rhYFOHdLJKowsl4MEjSHho.png"
                alt="Atmospheric Clouds"
                fill
                className="object-contain filter drop-shadow-[0_10px_20px_rgba(255,255,255,0.8)]"
                sizes="860px"
                priority
              />
            </div>

            {/* 3D ISOMETRIC PEDESTAL / PODIUM */}
            <div
              className="absolute -bottom-4 sm:-bottom-8 left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] md:w-[480px] lg:w-[520px] h-[220px] sm:h-[280px] md:h-[320px] z-10 transition-transform duration-200 ease-out"
              style={{
                transform: `translateX(-50%) rotateX(${tilt.rotateX * 0.25}deg) rotateY(${tilt.rotateY * 0.25}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Pedestal Top Face (Isometric Diamond Plane) */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)',
                  background: currentVariant.pedestal.top,
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                }}
              >
                {/* Subtle Top Surface Highlight */}
                <div className="w-full h-full bg-gradient-to-t from-white/30 to-transparent" />
              </div>

              {/* Pedestal Left Face */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  clipPath: 'polygon(0% 25%, 50% 50%, 50% 100%, 0% 75%)',
                  background: currentVariant.pedestal.left,
                }}
              />

              {/* Pedestal Right Face */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  clipPath: 'polygon(50% 50%, 100% 25%, 100% 75%, 50% 100%)',
                  background: currentVariant.pedestal.right,
                }}
              />

              {/* DYNAMIC CONTACT SHADOW (SVG directly mapped onto the isometric top face) */}
              <div className="absolute inset-0 pointer-events-none z-20 flex items-start justify-center pt-[10px] sm:pt-[15px] animate-shadow-scale">
                <svg
                  viewBox="0 0 292 50"
                  className="w-[72%] sm:w-[68%] h-auto opacity-75 transition-colors duration-700"
                  style={{ fill: currentVariant.pedestal.shadowColor }}
                  overflow="visible"
                >
                  <path d="M 82.304 12.941 L 3.317 26.626 C -1.081 27.388 -1.116 33.69 3.273 34.501 L 86.059 49.803 C 86.551 49.894 87.056 49.892 87.548 49.796 L 187.304 30.441 L 278.263 20.554 C 278.946 20.48 279.597 20.231 280.156 19.832 L 290.316 12.575 C 292.994 10.662 292.345 6.514 289.21 5.51 L 272.584 0.19 C 272.069 0.026 271.527 -0.033 270.988 0.018 L 187.304 7.941 Z" />
                </svg>
              </div>
            </div>

            {/* 3D FLOATING PRODUCT (Hovering directly over the Pedestal) */}
            <div
              className="relative z-20 w-[300px] sm:w-[420px] md:w-[500px] lg:w-[560px] h-[200px] sm:h-[280px] md:h-[340px] lg:h-[380px] -mt-16 sm:-mt-24 transition-transform duration-200 ease-out"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateX(${tilt.x}px) translateY(${tilt.y}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Levitation harmonic loop */}
              <div className="relative w-full h-full animate-sneako-float transform-gpu">
                <Image
                  key={currentVariant.image}
                  src={currentVariant.image}
                  alt={currentVariant.imageAlt}
                  fill
                  priority
                  className="object-contain filter drop-shadow-[0_20px_35px_rgba(28,25,23,0.22)] select-none pointer-events-none transition-opacity duration-300"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 560px"
                />

                {/* Specular Light Sweep Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl opacity-40">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-light-sweep mix-blend-overlay" />
                </div>
              </div>
            </div>

            {/* FRONT CLOUD LAYER (In Front of Pedestal Base) */}
            <div className="absolute -bottom-10 sm:-bottom-16 left-1/2 -translate-x-1/2 w-[560px] sm:w-[780px] md:w-[940px] h-[220px] pointer-events-none z-30 opacity-95 animate-cloud-front">
              <Image
                src="/hero-shoes/uP4rhYFOHdLJKowsl4MEjSHho.png"
                alt="Cloud billow"
                fill
                className="object-contain filter blur-[1px]"
                sizes="940px"
                priority
              />
            </div>

          </div>
        </div>
      </div>

      {/* 4. SNEAKO SIGNATURE BOTTOM BAR: 3 CATEGORY SWITCHER (LEFT) & PRODUCT INFO (RIGHT) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          
          {/* Bottom Left: The 3 Category Switcher Options */}
          <div className="flex items-center max-w-full overflow-x-auto pb-1 sm:pb-0">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-black/15 backdrop-blur-md border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              {Object.values(variants).map((v) => {
                const isActive = selectedVariant === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-300 cursor-pointer focus:outline-none ${
                      isActive
                        ? 'bg-white text-stone-950 shadow-md scale-100 font-bold'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-white/40 opacity-80'
                    }`}
                    aria-label={`Switch to ${v.categoryLabel}`}
                  >
                    <span
                      className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 shadow-xs transition-transform duration-300 ${
                        isActive ? 'scale-110 ring-2 ring-stone-900/10' : ''
                      }`}
                      style={{ backgroundColor: v.dotColor }}
                    />
                    <span className="tracking-tight whitespace-nowrap">{v.categoryLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Right: Product Title & Description */}
          <div className="flex flex-col sm:items-end sm:text-right space-y-1 max-w-xs sm:max-w-sm">
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-stone-900 tracking-tight transition-all duration-300">
              {currentVariant.name}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed">
              {currentVariant.subheadline}
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
