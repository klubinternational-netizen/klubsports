'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Footprints,
  Folders,
  FileEdit,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface Props {
  adminEmail: string;
}

const navLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Footprints },
  { label: 'Categories', href: '/admin/categories', icon: Folders },
  { label: 'Website Content', href: '/admin/content', icon: FileEdit },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ adminEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-stone-800">
      <div>
        {/* Logo area */}
        <div className="p-6 border-b border-stone-800">
          <Link href="/admin/dashboard" className="block">
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
  );
}
