'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

const navItems = [
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* ======================================================== */}
        {/* 1. LEFT CORNER: BRAND IDENTITY GLASS PILL                */}
        {/* ======================================================== */}
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 group ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
              : 'bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div className="relative h-6 w-6 transition-transform group-hover:scale-105">
            <Image
              src="/brand/logo-icon.png"
              alt="KSports"
              fill
              priority
              className="object-contain"
              sizes="24px"
            />
          </div>
          <span className="font-sans text-sm sm:text-base font-black tracking-tight text-stone-950 uppercase transition-colors group-hover:text-brand-orange">
            KSPORTS
          </span>
        </Link>

        {/* ======================================================== */}
        {/* 2. CENTER: FLOATING NAVIGATION GLASS PILL                */}
        {/* ======================================================== */}
        <nav
          className={`hidden md:flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
              : 'bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          }`}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-stone-950 text-white font-bold shadow-sm'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/80'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ======================================================== */}
        {/* 3. RIGHT CORNER: ENQUIRY BUTTON (OUR LIQUID METAL EFFECT)*/}
        {/* ======================================================== */}
        <div className="flex items-center gap-2">
          {/* Desktop & Tablet: Our Liquid Metal Shader Button */}
          <div className="hidden sm:flex items-center shrink-0">
            <LiquidMetalButton
              label="Enquiry"
              href="/contact"
              variant="orange"
              size="sm"
              showArrow={true}
              className="shadow-[0_4px_20px_rgba(238,119,0,0.22)]"
            />
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-stone-950 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-sm hover:bg-stone-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MOBILE DROPDOWN DRAWER                                   */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-md mx-auto mt-2 p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-stone-200/90 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  isActive
                    ? 'bg-stone-950 text-white font-bold'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-100 flex justify-center">
            <LiquidMetalButton
              label="Submit Enquiry"
              href="/contact"
              variant="orange"
              size="sm"
              showArrow={true}
              className="w-full justify-center shadow-md"
            />
          </div>
        </div>
      )}
    </header>
  );
}
