'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sortOrder: number;
  isPublished: boolean;
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [showSlugField, setShowSlugField] = useState(false);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to fetch categories' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIsSlugManuallyEdited(false);
    setShowSlugField(false);
    setDescription('');
    setCoverImage('');
    setSortOrder(categories.length + 1);
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIsSlugManuallyEdited(true);
    setShowSlugField(false);
    setDescription(cat.description || '');
    setCoverImage(cat.coverImage || '');
    setSortOrder(cat.sortOrder || 0);
    setIsPublished(cat.isPublished ?? true);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory && !isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setCoverImage(data.media.url);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Image upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const finalSlug = (slug || generateSlug(name)).trim().toLowerCase();
      if (!finalSlug) {
        throw new Error('Category name is required to generate a web link');
      }

      const payload = {
        name,
        slug: finalSlug,
        description,
        coverImage,
        sortOrder: Number(sortOrder) || 0,
        isPublished,
      };

      const url = editingCategory
        ? `/api/admin/categories/${editingCategory._id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      setFeedback({
        type: 'success',
        message: `Category "${name}" ${editingCategory ? 'updated' : 'created'} successfully!`,
      });
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      setFeedback({ type: 'success', message: `Category "${deleteTarget.name}" deleted.` });
      setDeleteTarget(null);
      fetchCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteTarget(null);
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
            Taxonomy Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Category Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize the sports footwear taxonomy according to official disciplines.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

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
          <button type="button" onClick={() => setFeedback(null)} className="font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading Taxonomy...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Products Linked</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categories.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          {c.coverImage ? (
                            <Image src={c.coverImage} alt={c.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">{c.name}</span>
                          <span className="text-[11px] text-stone-400 line-clamp-1">{c.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{c.slug}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800">
                        {c.productCount} model{c.productCount === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700">{c.sortOrder}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.isPublished
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {c.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-stone-600 hover:text-brand-orange bg-stone-100 hover:bg-orange-50 rounded transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 text-xs">No categories found.</div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Category Name <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Boxing Shoes"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition-colors"
                />

                {/* Automated Web Link Preview */}
                <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-stone-400 text-[11px] uppercase tracking-wider font-semibold">Web Link:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs font-medium">
                      /category/{slug || generateSlug(name) || 'category-name'}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      (Auto-generated)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSlugField(!showSlugField)}
                    className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 underline transition-colors"
                  >
                    {showSlugField ? 'Hide custom link' : 'Customize link'}
                  </button>
                </div>

                {showSlugField && (
                  <div className="mt-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                      Custom URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setIsSlugManuallyEdited(true);
                        setSlug(generateSlug(e.target.value));
                      }}
                      placeholder="e.g. boxing-shoes"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <p className="text-[10px] text-stone-400">
                      Only change this if you want a custom link. Letters, numbers, and hyphens only.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Approved category description..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Cover Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                  <label className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-brand-orange accent-brand-orange rounded"
                    />
                    <span>Publish Category</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Safeguard Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Confirm Category Deletion</h3>
            {deleteTarget.productCount > 0 ? (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
                <p className="font-bold">Cannot Delete Category</p>
                <p>
                  This category is currently referenced by <strong>{deleteTarget.productCount}</strong> footwear model(s). To protect catalogue integrity, please reassign those products to another category first.
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to permanently delete category &quot;{deleteTarget.name}&quot;?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Close
              </button>
              {deleteTarget.productCount === 0 && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
