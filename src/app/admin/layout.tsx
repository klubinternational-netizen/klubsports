import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSessionFromCookies } from '@/lib/auth/session';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSessionFromCookies();

  // If no session exists, render children directly so that /admin/login can render without infinite redirect loops.
  // Protected child pages will also check session or redirect if needed.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-stone-100 font-sans text-stone-900">
      <AdminSidebar adminEmail={session.email} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
