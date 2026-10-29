'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BrandsShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Progress from 0 when section enters view to 1 when section leaves view
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
          setScrollYProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalized coordinates from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  // Subtle parallax tilt calculations
  const shoeRotateX = -mouseOffset.y * 9;
  const shoeRotateY = mouseOffset.x * 12;
  const shoeTranslateX = mouseOffset.x * 22;
  const shoeTranslateY = mouseOffset.y * 16 - (scrollYProgress - 0.5) * 40;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-white overflow-visible select-none py-6 sm:py-10"
      style={{ perspective: '1200px' }}
    >
      <style jsx>{`
        @keyframes shoeGentleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(1.2deg);
          }
        }

        @keyframes blueShineSlide {
          0% {
            transform: translateX(-100%) rotate(25deg);
          }
          100% {
            transform: translateX(200%) rotate(25deg);
          }
        }

        .animate-shoe-float {
          animation: shoeGentleFloat 5.5s ease-in-out infinite;
        }

        .animate-shine {
          animation: blueShineSlide 8s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ======================================================== */}
        {/* 1. TOP BLUE BANNER CONTAINER                             */}
        {/* ======================================================== */}
        <div className="relative w-full bg-[#0055FF] rounded-2xl sm:rounded-3xl min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] px-6 sm:px-12 lg:px-16 py-10 sm:py-14 flex items-center justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,85,255,0.25)]">
          {/* Ambient Sheen Highlights & Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0047e6] via-[#0055ff] to-[#1a68ff] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-shine" />

          {/* LEFT CONTENT: Tag & "100%" */}
          <div className="relative z-10 flex flex-col justify-center items-start max-w-[42%]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-sm mb-2 sm:mb-3">
              <Sparkles className="w-3 h-3 text-white" />
              Original
            </span>
            <h2 className="font-ranchers text-white text-6xl sm:text-8xl md:text-9xl lg:text-[145px] xl:text-[170px] leading-[0.88] uppercase tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              100%
            </h2>
          </div>

          {/* RIGHT CONTENT: "KSports" / "Brands" Wordmark */}
          <div className="relative z-10 flex flex-col justify-center items-end max-w-[42%] text-right">
            <h2 className="font-ranchers text-white text-5xl sm:text-7xl md:text-8xl lg:text-[135px] xl:text-[155px] leading-[0.88] uppercase tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              KSports
            </h2>
            <span className="text-white/80 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1 sm:mt-2">
              Performance Footwear
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CENTER FLOATING SHOE (BRIDGES BANNER AND BOTTOM)      */}
        {/* ======================================================== */}
        <div
          className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-[340px] sm:w-[500px] md:w-[620px] lg:w-[740px] xl:w-[820px] transition-transform duration-300 ease-out"
          style={{
            transform: `translate(-50%, -50%) translate3d(${shoeTranslateX}px, ${shoeTranslateY}px, 0) rotateX(${shoeRotateX}deg) rotateY(${shoeRotateY}deg) scale(${isHovered ? 1.03 : 1})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="relative w-full aspect-[1.15] animate-shoe-float">
            <Image
              src="/hero-shoes/JkJp7l8j69t5XG1pygBykqgL4.png"
              alt="KSports 100% Original Athletic Footwear with High-Traction Sole"
              fill
              priority
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 620px, 820px"
              className="object-contain drop-shadow-[0_32px_45px_rgba(0,0,0,0.22)] drop-shadow-[0_12px_24px_rgba(0,85,255,0.25)] select-none pointer-events-none"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. BOTTOM WHITE CONTAINER                                */}
        {/* ======================================================== */}
        <div className="relative w-full pt-20 sm:pt-28 md:pt-36 lg:pt-44 pb-10 sm:pb-16 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 sm:gap-12 px-4 sm:px-8">
          {/* Left Text */}
          <div className="max-w-md text-center sm:text-left z-10">
            <p className="text-stone-500 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              Authentic footwear curated from our own certified manufacturing plants and verified sports distribution partners.
            </p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
              Tournament Grade Grip &amp; Durability
            </div>
          </div>

          {/* Right Text: "Trusted Originals" */}
          <div className="text-center sm:text-right z-10">
            <h3 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-[1.08]">
              Trusted
              <br />
              Originals
            </h3>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-[0.14em] text-brand-orange hover:text-brand-orange-dark transition-colors group"
            >
              <span>Explore KSports Footwear</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
