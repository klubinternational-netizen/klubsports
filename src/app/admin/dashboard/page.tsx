import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Footprints,
  Folders,
  Inbox,
  ArrowRight,
  PlusCircle,
  FileEdit,
  Activity,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { getAdminSessionFromCookies } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Enquiry } from '@/models/Enquiry';
import { AdminActivityLog } from '@/models/AdminActivityLog';

export const revalidate = 0; // Always fresh in admin

export default async function AdminDashboardPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect('/admin/login');
  }

  await connectToDatabase();

  const [
    totalProducts,
    publishedProducts,
    unpublishedProducts,
    totalCategories,
    newEnquiries,
    inProgressEnquiries,
    closedEnquiries,
    recentProducts,
    recentEnquiries,
    recentLogs,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isPublished: true }),
    Product.countDocuments({ isPublished: false }),
    Category.countDocuments(),
    Enquiry.countDocuments({ status: 'New' }),
    Enquiry.countDocuments({ status: 'In Progress' }),
    Enquiry.countDocuments({ status: 'Closed' }),
    Product.find().populate('categoryId', 'name').sort({ updatedAt: -1 }).limit(5).lean(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    AdminActivityLog.find().sort({ timestamp: -1 }).limit(6).lean(),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Administration Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time catalog metrics, corporate enquiries, and publishing logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shadow-sm"
          >
            <FileEdit className="w-4 h-4" />
            <span>Edit Content</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Products
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-brand-orange">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{totalProducts}</div>
          <div className="text-xs text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-emerald-700 font-semibold">{publishedProducts} Published</span>
            <span className="text-stone-400">{unpublishedProducts} Draft</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Categories
            </span>
            <div className="p-2 rounded-lg bg-stone-100 text-stone-700">
              <Folders className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{totalCategories}</div>
          <div className="text-xs text-stone-500 pt-2 border-t border-stone-100">
            Source deck footwear taxonomy
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              New Enquiries
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-brand-orange">{newEnquiries}</div>
          <div className="text-xs text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
            <span>Requires review</span>
            <Link href="/admin/enquiries" className="font-semibold text-brand-orange hover:underline">
              View Inbox →
            </Link>
          </div>
        </div>

        {/* Enquiries In-Progress / Total */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Inquiries
            </span>
            <div className="p-2 rounded-lg bg-stone-100 text-stone-700">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {newEnquiries + inProgressEnquiries + closedEnquiries}
          </div>
          <div className="text-xs text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
            <span>{inProgressEnquiries} In Progress</span>
            <span>{closedEnquiries} Closed</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Products & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Recent Footwear Updates
              </h2>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-brand-orange hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-stone-100">
              {recentProducts.length > 0 ? (
                recentProducts.map((p: any) => (
                  <div key={p._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-sm font-bold text-stone-900 hover:text-brand-orange transition-colors truncate block"
                      >
                        {p.name}
                      </Link>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>{p.categoryId?.name || 'Unassigned'}</span>
                        <span>•</span>
                        <span>Slug: {p.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          p.isPublished
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-xs font-semibold text-stone-600 hover:text-brand-orange px-2 py-1 rounded bg-stone-50 hover:bg-stone-100 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-stone-400">
                  No products in catalogue yet.
                </div>
              )}
            </div>
          </div>
          <div className="p-3 bg-stone-50 border-t border-stone-100 text-right">
            <Link
              href="/admin/products/new"
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              + Create New Footwear Model
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Recent Business Inquiries
              </h2>
              <Link
                href="/admin/enquiries"
                className="text-xs font-semibold text-brand-orange hover:underline flex items-center gap-1"
              >
                <span>All Enquiries</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-stone-100">
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enq: any) => (
                  <div key={enq._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-stone-900 truncate">
                        {enq.name}{' '}
                        {enq.companyName && (
                          <span className="text-xs font-normal text-stone-500">
                            ({enq.companyName})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 truncate">
                        {enq.email} • {enq.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                      <Link
                        href={`/admin/enquiries?open=${enq._id}`}
                        className="text-xs font-semibold text-stone-600 hover:text-brand-orange px-2 py-1 rounded bg-stone-50 hover:bg-stone-100 transition-colors"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-stone-400">
                  No business enquiries received yet.
                </div>
              )}
            </div>
          </div>
          <div className="p-3 bg-stone-50 border-t border-stone-100 text-right">
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Manage Corporate Inbox →
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Audit & Activity Logs */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-orange" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              System & Administrator Activity Logs
            </h2>
          </div>
          <span className="text-xs text-stone-400">Audit Trail Active</span>
        </div>

        <div className="space-y-3">
          {recentLogs.map((log: any) => (
            <div
              key={log._id}
              className="flex items-start justify-between gap-4 p-3 rounded-lg bg-stone-50 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-stone-800">[{log.action}]</span>{' '}
                <span className="text-stone-700">{log.summary}</span>
                <div className="text-[11px] text-stone-400">User: {log.adminEmail}</div>
              </div>
              <div className="text-[11px] text-stone-400 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
