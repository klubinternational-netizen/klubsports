'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0, rotate: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({
      x: nx * 32,
      y: ny * 22,
      rotate: nx * 4,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0, rotate: 0 });
  };

  return (
    <footer className="relative bg-white text-stone-900 overflow-hidden font-sans select-none border-t border-stone-100">
      <style jsx>{`
        @keyframes laceOrganicFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-14px) rotate(1deg);
          }
          50% {
            transform: translateY(8px) rotate(-0.8deg);
          }
          75% {
            transform: translateY(-6px) rotate(0.5deg);
          }
        }

        @keyframes orangeShoeFloat {
          0%, 100% {
            transform: rotate(166deg) translateY(0px);
          }
          50% {
            transform: rotate(171deg) translateY(-16px);
          }
        }

        @keyframes blueShoeFloat {
          0%, 100% {
            transform: rotate(19deg) translateY(0px);
          }
          50% {
            transform: rotate(15deg) translateY(14px);
          }
        }

        @keyframes letterBobUp {
          0%, 100% {
            transform: translateY(-50px);
          }
          50% {
            transform: translateY(-60px);
          }
        }

        @keyframes letterBobDown {
          0%, 100% {
            transform: translateY(50px);
          }
          50% {
            transform: translateY(60px);
          }
        }

        .animate-lace-float {
          animation: laceOrganicFloat 7s cubic-bezier(0.42, 0, 0.58, 1) infinite;
        }

        .animate-orange-shoe {
          animation: orangeShoeFloat 5.2s ease-in-out infinite;
        }

        .animate-blue-shoe {
          animation: blueShoeFloat 5.8s ease-in-out infinite;
        }

        .letter-svg-up {
          animation: letterBobUp 6s ease-in-out infinite;
        }

        .letter-svg-down {
          animation: letterBobDown 6s ease-in-out infinite;
        }
      `}</style>

      {/* ======================================================== */}
      {/* 1. EXACT SNEAKO LARGE HEADING WITH WOVEN SHOE LACE       */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20 overflow-visible"
      >
        {/* Large Heading flex row matching Sneako .framer-tyd2me */}
        <div className="relative flex flex-row items-center justify-center w-full min-h-[340px] sm:min-h-[460px] lg:min-h-[560px] overflow-visible">
          
          {/* =================================================== */}
          {/* 6 VECTOR LETTER SVGS IN EXACT SNEAKO PROPORTIONS    */}
          {/* =================================================== */}
          <div className="flex flex-row items-center justify-center w-full overflow-visible relative z-0">
            
            {/* Letter 1: S (Up) */}
            <svg
              viewBox="0 0 1498 2931"
              className="letter-svg-up relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${-50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0s',
                zIndex: 0,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.79)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '3256px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  S
                </p>
              </foreignObject>
            </svg>

            {/* Letter 2: N (Down) */}
            <svg
              viewBox="0 0 234 352"
              className="letter-svg-down relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.2s',
                zIndex: 0,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(1)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '391px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  n
                </p>
              </foreignObject>
            </svg>

            {/* Letter 3: E (Up) */}
            <svg
              viewBox="0 0 199 432"
              className="letter-svg-up relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${-50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.4s',
                zIndex: 0,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.69)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '480px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  e
                </p>
              </foreignObject>
            </svg>

            {/* Letter 4: A (Down) */}
            <svg
              viewBox="0 0 225 380"
              className="letter-svg-down relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.6s',
                zIndex: 0,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.86)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '422px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  a
                </p>
              </foreignObject>
            </svg>

            {/* Letter 5: K (Up) */}
            <svg
              viewBox="0 0 231 374"
              className="letter-svg-up relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${-50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.8s',
                zIndex: 2,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.9)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '415px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  k
                </p>
              </foreignObject>
            </svg>

            {/* Letter 6: S (Down) */}
            <svg
              viewBox="0 0 238 466"
              className="letter-svg-down relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '1s',
                zIndex: 1,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.77)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '518px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  s
                </p>
              </foreignObject>
            </svg>

          </div>

          {/* =================================================== */}
          {/* ORANGE SNEAKER (TOP LEFT OVER 'S')                  */}
          {/* In Sneako: top: 23%, left: 18%, rotate(166deg)      */}
          {/* =================================================== */}
          <div
            className="absolute top-[23%] left-[18%] -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[170px] lg:w-[184px] aspect-[1.46429] pointer-events-none z-[1] overflow-visible transition-transform duration-300 ease-out"
            style={{
              transform: `translate(calc(-50% + ${mouseOffset.x * 0.8}px), calc(-50% + ${mouseOffset.y * 0.8}px))`,
            }}
          >
            <div className="w-full h-full animate-orange-shoe drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]">
              <Image
                src="/footer-assets/orange-shoe.png"
                alt="Orange Sneaker"
                fill
                priority
                className="object-contain"
                sizes="184px"
              />
            </div>
          </div>

          {/* =================================================== */}
          {/* WOVEN PINK SHOE LACE ("THE LAYS")                   */}
          {/* In Sneako: top: 42%, left: 50%, width: 90%          */}
          {/* =================================================== */}
          <div
            className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-[1.50119] pointer-events-none z-[1] overflow-visible transition-transform duration-400 ease-out"
            style={{
              transform: `translate(calc(-50% + ${mouseOffset.x * 0.45}px), calc(-50% + ${
                mouseOffset.y * 0.45
              }px)) rotate(${mouseOffset.rotate}deg)`,
            }}
          >
            <div className="w-full h-full animate-lace-float drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]">
              <Image
                src="/footer-assets/pink-lace.png"
                alt="Sneaks Pink Lace"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1200px) 90vw, 1150px"
              />
            </div>
          </div>

          {/* =================================================== */}
          {/* SKY BLUE SNEAKER (BOTTOM RIGHT UNDER 'K' & 'S')    */}
          {/* In Sneako: top: 73%, left: 82%, rotate(19deg)       */}
          {/* =================================================== */}
          <div
            className="absolute top-[73%] left-[82%] -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[170px] lg:w-[184px] aspect-[1.46429] pointer-events-none z-[2] overflow-visible transition-transform duration-300 ease-out"
            style={{
              transform: `translate(calc(-50% + ${-mouseOffset.x * 0.7}px), calc(-50% + ${-mouseOffset.y * 0.7}px))`,
            }}
          >
            <div className="w-full h-full animate-blue-shoe drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]">
              <Image
                src="/footer-assets/sky-blue-shoe.png"
                alt="Sky Blue Sneaker"
                fill
                priority
                className="object-contain"
                sizes="184px"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MINIMALIST DIRECTORY (EXACT SNEAKO TEMPLATE LAYOUT)   */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Company Identity */}
          <div className="md:col-span-6 space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-5 h-5 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/logo-icon.png"
                  alt="KSports"
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
              <span className="font-sans font-bold text-base text-stone-950 tracking-tight">
                KSports
              </span>
            </Link>
            <p className="text-stone-500 text-xs sm:text-sm font-normal">
              Making high quality shoes since 2012
            </p>
          </div>

          {/* Directory 3 Columns */}
          <div className="md:col-span-6 grid grid-cols-3 gap-6 sm:gap-8 text-xs sm:text-sm">
            
            {/* Support */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-950">Support</h4>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link href="/contact" className="hover:text-stone-950 hover:underline transition-colors block">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-stone-950 hover:underline transition-colors block">
                    Return &amp; Exchange
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-stone-950 hover:underline transition-colors block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Site */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-950">Site</h4>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link href="/" className="hover:text-stone-950 hover:underline transition-colors block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-stone-950 hover:underline transition-colors block">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/manufacturing" className="hover:text-stone-950 hover:underline transition-colors block">
                    Stores
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-stone-950 hover:underline transition-colors block">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-stone-950 hover:underline transition-colors block">
                    Magazine
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-950">Follow</h4>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-950 hover:underline transition-colors block"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-950 hover:underline transition-colors block"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-950 hover:underline transition-colors block"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-950 hover:underline transition-colors block"
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Legal & Terms bar matching template */}
        <div className="mt-14 pt-6 border-t border-stone-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="text-center md:text-left">
            <span>© KSports International. All Rights Reserved</span>
          </div>

          {/* Centered Built by uxitech credit */}
          <div className="text-center">
            <span>
              Built by{' '}
              <a
                href="https://uxitech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-stone-900 hover:text-brand-orange hover:underline transition-colors"
              >
                uxitech
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6 justify-center md:justify-end">
            <Link href="/privacy-policy" className="hover:text-stone-950 hover:underline transition-colors">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:text-stone-950 hover:underline transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
