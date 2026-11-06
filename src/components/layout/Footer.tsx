'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

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
          {/* 5 VECTOR LETTER SVGS SPELLING "SHOES"               */}
          {/* =================================================== */}
          <div className="flex flex-row items-center justify-center w-full overflow-visible relative z-0">
            
            {/* Letter 1: S (Up) */}
            <svg
              viewBox="0 0 238 466"
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
                  S
                </p>
              </foreignObject>
            </svg>

            {/* Letter 2: H (Down) */}
            <svg
              viewBox="0 0 234 380"
              className="letter-svg-down relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.25s',
                zIndex: 0,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.88)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '430px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  h
                </p>
              </foreignObject>
            </svg>

            {/* Letter 3: O (Up) */}
            <svg
              viewBox="0 0 234 380"
              className="letter-svg-up relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${-50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.5s',
                zIndex: 0,
              }}
            >
              <foreignObject
                width="100%"
                height="100%"
                transform="scale(0.88)"
                style={{ overflow: 'visible', transformOrigin: 'center center' }}
              >
                <p
                  style={{
                    fontFamily: "'Ranchers', sans-serif",
                    fontSize: '430px',
                    lineHeight: '0.9em',
                    textAlign: 'center',
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                    userSelect: 'none',
                  }}
                >
                  o
                </p>
              </foreignObject>
            </svg>

            {/* Letter 4: E (Down) */}
            <svg
              viewBox="0 0 199 432"
              className="letter-svg-down relative overflow-visible pointer-events-none"
              style={{
                flex: '1 0 0',
                width: '1px',
                height: 'auto',
                willChange: 'transform',
                transform: `translateY(${50 + mouseOffset.y * 0.1}px)`,
                animationDelay: '0.75s',
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

            {/* Letter 5: S (Down) */}
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
                alt="Shoes Pink Lace"
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
          
          {/* Company Identity & Google Map Preview */}
          <div className="md:col-span-5 space-y-3">
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
              Crafting performance sports footwear since 2015
            </p>

            {/* Google Map Card */}
            <div className="pt-1 max-w-sm">
              <a
                href="https://maps.app.goo.gl/HEZbWDYk7ePQWgh58"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md hover:border-brand-orange/40 transition-all bg-stone-50"
              >
                <div className="relative h-28 w-full bg-stone-100 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.212!2d80.622418!3d16.5153646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35effcd942ca4f%3A0xd14bf8356d0e0dcc!2sKSPORTS!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, pointerEvents: 'none' }}
                    title="KSports Official Store Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-2.5 sm:p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block group-hover:text-brand-orange transition-colors">
                        KSports Store Location
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Hanumanpet, Vijayawada, AP 520003
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-orange group-hover:translate-x-0.5 transition-transform px-2 py-0.5 rounded bg-orange-50">
                    ↗
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Directory 3 Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6 sm:gap-8 text-xs sm:text-sm">
            
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
                <li>
                  <a
                    href="https://maps.app.goo.gl/HEZbWDYk7ePQWgh58"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-orange hover:underline transition-colors flex items-center gap-1 text-brand-orange font-semibold"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location Map</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/918886303030?text=Hello%20KSports!%20I%20would%20like%20to%20enquire%20about%20athletic%20footwear."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wide">Live</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories & Navigation */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-950">Categories</h4>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <Link href="/products?group=shoes" className="hover:text-stone-950 hover:underline transition-colors block">
                    Sports Shoes (Jogging, Walk, Badminton, Cricket)
                  </Link>
                </li>
                <li>
                  <Link href="/products?group=socks" className="text-emerald-700 font-semibold hover:text-emerald-950 hover:underline transition-colors block">
                    Socks Collection (From ₹119)
                  </Link>
                </li>
                <li>
                  <Link href="/products?group=insoles" className="hover:text-stone-950 hover:underline transition-colors block">
                    High-Performance Insoles
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-stone-950 hover:underline transition-colors block">
                    About The Brand
                  </Link>
                </li>
                <li>
                  <Link href="/manufacturing" className="hover:text-stone-950 hover:underline transition-colors block">
                    Manufacturing &amp; Scale
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-stone-950 hover:underline transition-colors block">
                    Bulk Enquiries
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
                    href="https://www.instagram.com/ksports.india?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-950 hover:underline transition-colors block font-medium"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Legal & Terms bar matching template */}
        <div className="mt-14 pt-6 border-t border-stone-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="text-center md:text-left">
            <span>© 2015–2026 KSports International. All Rights Reserved</span>
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
