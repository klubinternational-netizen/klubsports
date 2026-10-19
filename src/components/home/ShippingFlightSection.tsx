'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ShippingFlightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // 1. Scroll listener for progress calculation
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress from when top enters (progress = 0) to bottom leaves (progress = 1)
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));
      setScrollProgress(progress);

      // Trigger entrance once section reaches viewport
      if (rect.top <= windowHeight * 0.85) {
        setHasEntered(true);
      }
    };

    // 2. Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouseOffset({ x, y });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Plane flight trajectory:
  // Starts on the right side (+340px) and flies across to the left (-340px)
  // as the user scrolls from top of section to bottom of section.
  const planeScrollX = 320 - scrollProgress * 640;
  const planeMouseX = mouseOffset.x * 20;
  const planeMouseY = mouseOffset.y * 12;

  // Cargo ejection physics:
  // As the plane flies left, cargo cascades out of the bay door,
  // trailing behind (to the right) and tumbling downward.
  const cargoProgress = hasEntered ? Math.max(0.2, scrollProgress) : 0;

  return (
    <section
      ref={sectionRef}
      id="world-wide-shipping"
      className="relative w-full bg-white pt-24 pb-36 sm:pb-48 overflow-hidden border-t border-stone-100 select-none"
    >
      {/* Ambient background atmosphere glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[750px] bg-gradient-to-b from-stone-50/90 via-white to-blue-50/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ======================================================== */}
      {/* 1. SECTION HEADER (MATCHING SNEAKO FRAMER TEMPLATE)     */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Top Floating Badge */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#EDEDED] hover:bg-stone-200 text-stone-950 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:scale-105 active:scale-95 group mb-5"
        >
          <span>Read about shipping</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-600 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Section Headline */}
        <h2 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-950 tracking-tight leading-[1.08]">
          World Wide Shipping
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-stone-500 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal">
          We deliver worldwide with trusted shipping partners, secure packaging, and order tracking included.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2. THE FLIGHT & FALLING CARGO STAGE                     */}
      {/* ======================================================== */}
      <div className="relative w-full max-w-[1360px] mx-auto mt-12 sm:mt-16 px-4 min-h-[460px] sm:min-h-[580px] lg:min-h-[660px]">
        
        {/* Animated Flight Carrier: Smoothly translates from right to left */}
        <div
          className="relative w-full transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: `translate3d(${planeScrollX + planeMouseX}px, ${planeMouseY}px, 0)`,
          }}
        >
          {/* Plane Container with Gentle Aerodynamic Turbulence Float */}
          <div className="relative w-[130%] sm:w-[95%] lg:w-[86%] max-w-[1150px] aspect-[2525/721] animate-[flightBob_6s_ease-in-out_infinite]">
            <Image
              src="/shipping/white-plane.png"
              alt="White Cargo Plane with Open Door"
              fill
              priority
              className="object-contain pointer-events-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.06)]"
              sizes="(max-width: 1024px) 100vw, 1150px"
            />

            {/* ==================================================== */}
            {/* 3. FALLING CARGO (EJECTING FROM CARGO DOOR)          */}
            {/* Positions matching sneako.framer.website screenshot  */}
            {/* ==================================================== */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* ITEM 1: Delivery Box 1 (Top-Left of cluster) */}
              <div
                className="absolute will-change-transform transition-all duration-700 ease-out animate-[boxHover1_5s_ease-in-out_infinite]"
                style={{
                  top: '67%',
                  left: '68%',
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered
                    ? `translate3d(${cargoProgress * 45}px, ${cargoProgress * 55}px, 0) rotate(${12 + cargoProgress * 12}deg) scale(1)`
                    : 'translate3d(-40px, -20px, 0) scale(0.4)',
                }}
              >
                <div className="relative w-24 sm:w-32 lg:w-40 aspect-[1601/983] filter drop-shadow-[4px_14px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform">
                  <Image
                    src="/shipping/delivery-box-1.png"
                    alt="Cardboard Delivery Box"
                    fill
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
              </div>

              {/* ITEM 2: Delivery Box 2 (Top-Right of cluster) */}
              <div
                className="absolute will-change-transform transition-all duration-700 ease-out animate-[boxHover2_6.5s_ease-in-out_infinite]"
                style={{
                  top: '71%',
                  left: '84%',
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered
                    ? `translate3d(${cargoProgress * 65}px, ${cargoProgress * 45}px, 0) rotate(${-12 - cargoProgress * 10}deg) scale(1)`
                    : 'translate3d(-60px, -30px, 0) scale(0.4)',
                  transitionDelay: '80ms',
                }}
              >
                <div className="relative w-28 sm:w-36 lg:w-44 aspect-[1594/987] filter drop-shadow-[4px_14px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform">
                  <Image
                    src="/shipping/delivery-box-2.png"
                    alt="Cardboard Delivery Box"
                    fill
                    className="object-contain"
                    sizes="175px"
                  />
                </div>
              </div>

              {/* ITEM 3: Brown Sneaker (Top-Center between Box 1 & Box 2) */}
              <div
                className="absolute will-change-transform transition-all duration-700 ease-out animate-[shoeHover1_4.5s_ease-in-out_infinite] z-20"
                style={{
                  top: '76%',
                  left: '76%',
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered
                    ? `translate3d(${cargoProgress * 35}px, ${cargoProgress * 60}px, 0) rotate(${22 - cargoProgress * 25}deg) scale(1)`
                    : 'translate3d(-50px, -25px, 0) scale(0.4)',
                  transitionDelay: '140ms',
                }}
              >
                <div className="relative w-16 sm:w-20 lg:w-24 aspect-[1744/902] filter drop-shadow-[2px_10px_14px_rgba(0,0,0,0.18)] hover:scale-110 transition-transform">
                  <Image
                    src="/shipping/shoe-brown.png"
                    alt="Brown Athletic Sneaker"
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
              </div>

              {/* ITEM 4: Red Suede Sneaker (Mid-Left under Box 1) */}
              <div
                className="absolute will-change-transform transition-all duration-700 ease-out animate-[shoeHover2_5.2s_ease-in-out_infinite] z-20"
                style={{
                  top: '96%',
                  left: '65%',
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered
                    ? `translate3d(${cargoProgress * 25}px, ${cargoProgress * 85}px, 0) rotate(${-15 + cargoProgress * 20}deg) scale(1)`
                    : 'translate3d(-70px, -40px, 0) scale(0.4)',
                  transitionDelay: '200ms',
                }}
              >
                <div className="relative w-16 sm:w-20 lg:w-24 aspect-[1254/527] filter drop-shadow-[2px_10px_14px_rgba(0,0,0,0.18)] hover:scale-110 transition-transform">
                  <Image
                    src="/shipping/shoe-red.png"
                    alt="Red Athletic Sneaker"
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
              </div>

              {/* ITEM 5: Delivery Box 4 (Mid-Right under Box 2) */}
              <div
                className="absolute will-change-transform transition-all duration-700 ease-out animate-[boxHover1_7s_ease-in-out_infinite]"
                style={{
                  top: '96%',
                  left: '78%',
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered
                    ? `translate3d(${cargoProgress * 55}px, ${cargoProgress * 80}px, 0) rotate(${-8 + cargoProgress * 15}deg) scale(1)`
                    : 'translate3d(-80px, -40px, 0) scale(0.4)',
                  transitionDelay: '240ms',
                }}
              >
                <div className="relative w-28 sm:w-36 lg:w-44 aspect-[1594/987] filter drop-shadow-[4px_14px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform">
                  <Image
                    src="/shipping/delivery-box-2.png"
                    alt="Cardboard Delivery Box"
                    fill
                    className="object-contain"
                    sizes="175px"
                  />
                </div>
              </div>

              {/* ITEM 6: Delivery Box 3 (Bottom-Center of cluster) */}
              <div
                className="absolute will-change-transform transition-all duration-700 ease-out animate-[boxHover3_5.8s_ease-in-out_infinite]"
                style={{
                  top: '110%',
                  left: '71%',
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered
                    ? `translate3d(${cargoProgress * 35}px, ${cargoProgress * 95}px, 0) rotate(${28 + cargoProgress * 10}deg) scale(1)`
                    : 'translate3d(-90px, -50px, 0) scale(0.4)',
                  transitionDelay: '300ms',
                }}
              >
                <div className="relative w-24 sm:w-32 lg:w-38 aspect-[1601/983] filter drop-shadow-[4px_14px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform">
                  <Image
                    src="/shipping/delivery-box-1.png"
                    alt="Cardboard Delivery Box"
                    fill
                    className="object-contain"
                    sizes="150px"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Aerodynamic flight & organic cargo hover keyframes */}
      <style jsx>{`
        @keyframes flightBob {
          0%, 100% {
            transform: translateY(0px) rotate(-0.5deg);
          }
          50% {
            transform: translateY(-12px) rotate(0.4deg);
          }
        }

        @keyframes boxHover1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes boxHover2 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes boxHover3 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shoeHover1 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(-6deg);
          }
        }

        @keyframes shoeHover2 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
      `}</style>
    </section>
  );
}
