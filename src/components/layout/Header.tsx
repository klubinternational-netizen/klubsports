'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'Contact Us', href: '/contact' },
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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3'
          : 'bg-white border-b border-stone-100 py-4 lg:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded">
            <div className="relative h-11 w-36 sm:h-12 sm:w-44 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/brand/logo-horizontal.png"
                alt="Klub Sports Official Logo"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 768px) 150px, 180px"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors rounded-md ${
                    isActive
                      ? 'text-brand-orange font-semibold bg-brand-orange-light/60'
                      : 'text-stone-700 hover:text-brand-orange hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-md transition-all shadow-sm hover:shadow-md"
            >
              <span>Business Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-brand-orange hover:bg-stone-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-brand-orange font-semibold bg-brand-orange-light'
                      : 'text-stone-800 hover:text-brand-orange hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-stone-100 mt-2">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-sm"
              >
                <span>Business Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
