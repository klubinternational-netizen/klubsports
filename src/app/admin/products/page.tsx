'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  shortDescription: string;
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter) params.set('categoryId', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);

      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/products?${params.toString()}`),
        fetch('/api/admin/categories'),
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to load products list' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleTogglePublish = async (product: ProductItem) => {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          categoryId: product.categoryId?._id,
          isPublished: !product.isPublished,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update publication status');
      }

      setFeedback({
        type: 'success',
        message: `Product "${product.name}" is now ${!product.isPublished ? 'Published' : 'Unpublished'}. Changes are live immediately.`,
      });
      fetchProducts();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      setFeedback({ type: 'success', message: 'Product deleted successfully.' });
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Inventory Catalogue
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Product Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage sports footwear specifications, imagery, category taxonomy and publishing status.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by footwear name or description..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="unpublished">Draft / Unpublished</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading Catalogue Records...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Footwear Model</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  const primaryImg =
                    p.images?.find((img) => img.isPrimary)?.url ||
                    p.images?.[0]?.url ||
                    '/brand/logo-stacked.png';

                  return (
                    <tr key={p._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <Image
                              src={primaryImg}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-stone-900 block truncate max-w-xs sm:max-w-sm">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-stone-400 line-clamp-1">
                              {p.shortDescription}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {p.categoryId?.name || <span className="text-stone-400">None</span>}
                      </td>
                      <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                        {p.slug}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            p.isPublished
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {p.isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-stone-400" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.isPublished && (
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="p-1.5 text-stone-400 hover:text-stone-700 rounded transition-colors"
                              title="View on live website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/products/${p._id}/edit`}
                            className="p-1.5 text-stone-600 hover:text-brand-orange bg-stone-100 hover:bg-orange-50 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-stone-500">
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs text-stone-400 mt-1">
              Try adjusting your search query or add your first footwear model.
            </p>
            <div className="mt-4">
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Footwear Model</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Confirm Footwear Deletion</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete this footwear model from the catalogue? This will immediately remove it from the public website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
