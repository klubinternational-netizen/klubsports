'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Footprints,
  Folders,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface Props {
  adminEmail: string;
}

const navLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Footprints },
  { label: 'Categories', href: '/admin/categories', icon: Folders },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ adminEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
      router.push('/admin/login');
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE TOP NAVIGATION BAR (< lg)                       */}
      {/* ======================================================== */}
      <div className="lg:hidden sticky top-0 z-40 bg-stone-900 border-b border-stone-800 px-3.5 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -ml-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-brand-orange" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-white px-2 py-1 rounded inline-block">
              <div className="relative h-5 w-24">
                <Image
                  src="/brand/logo-horizontal.png"
                  alt="KSports"
                  fill
                  className="object-contain"
                  sizes="100px"
                  priority
                />
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Site</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE BACKDROP OVERLAY                                */}
      {/* ======================================================== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ======================================================== */}
      {/* 3. ASIDE DRAWER (Fixed on Mobile, Static on Desktop)     */}
      {/* ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 text-stone-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-stone-800 transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo area */}
          <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="block" onClick={() => setMobileOpen(false)}>
              <div className="bg-white p-2.5 rounded-lg inline-block">
                <div className="relative h-8 w-36">
                  <Image
                    src="/brand/logo-horizontal.png"
                    alt="KSports Logo"
                    fill
                    className="object-contain"
                    sizes="150px"
                  />
                </div>
              </div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                Administration Portal
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin/dashboard'
                  ? pathname === '/admin/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white font-semibold shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-stone-800/60 border border-stone-700/60 text-xs">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
              Logged In As
            </div>
            <div className="font-medium text-stone-200 truncate mt-0.5">{adminEmail}</div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center p-2 text-stone-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
