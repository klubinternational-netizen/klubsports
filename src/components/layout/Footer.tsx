import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {/* White card container to showcase the official logo sharply */}
              <div className="bg-white p-2.5 rounded-md inline-block">
                <div className="relative h-9 w-36">
                  <Image
                    src="/brand/logo-horizontal.png"
                    alt="Klub Sports Logo"
                    fill
                    className="object-contain"
                    sizes="150px"
                  />
                </div>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Premium sports footwear brand engineered for athletes, tournament play, and institutional athletic procurement across India.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Shoes For Every Sport</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-orange transition-colors">
                  Footwear Catalogue
                </Link>
              </li>
              <li>
                <Link href="/manufacturing" className="hover:text-brand-orange transition-colors">
                  Manufacturing Capabilities
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Sport Footwear */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/categories/running-shoes" className="hover:text-brand-orange transition-colors flex items-center justify-between group">
                  <span>Running Shoes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/categories/marathon-shoes" className="hover:text-brand-orange transition-colors flex items-center justify-between group">
                  <span>Marathon Pro</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/categories/badminton-shoes" className="hover:text-brand-orange transition-colors flex items-center justify-between group">
                  <span>Badminton Court</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/categories/football-shoes" className="hover:text-brand-orange transition-colors flex items-center justify-between group">
                  <span>Football Boots</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/categories/kabaddi-shoes" className="hover:text-brand-orange transition-colors flex items-center justify-between group">
                  <span>Kabaddi Footwear</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/categories/trail-footwear" className="hover:text-brand-orange transition-colors flex items-center justify-between group">
                  <span>Off-Road & Trail</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Enquiry Info */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Institutional Desk
            </h3>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>Klub Sports Manufacturing Facilities, Industrial Footwear Hub, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:info@klubsports.com" className="hover:text-white transition-colors">
                  info@klubsports.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-block text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-white hover:underline transition-colors"
                >
                  Submit Institutional RFQ →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {currentYear} Klub Sports. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Corporate Enquiries
            </Link>
            <Link href="/admin/login" className="hover:text-stone-300 transition-colors opacity-60 hover:opacity-100">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
