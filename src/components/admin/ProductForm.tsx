'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { productSchema, ProductInput } from '@/lib/validations/product';

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId?._id || initialData?.categoryId || ''
  );
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [features, setFeatures] = useState<string[]>(initialData?.features || ['']);
  const [primaryImageUrl, setPrimaryImageUrl] = useState(
    initialData?.images?.find((img: any) => img.isPrimary)?.url || initialData?.images?.[0]?.url || ''
  );
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; alt: string }>>(
    initialData?.images?.filter((img: any) => !img.isPrimary) || []
  );
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true);
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder || 0);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || '');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-generate slug from name if new product
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (!categoryId && data.categories?.length > 0) {
          setCategoryId(data.categories[0]._id);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Feature handling
  const handleAddFeature = () => setFeatures([...features, '']);
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (isGallery) {
        setGalleryImages([...galleryImages, { url: data.media.url, alt: `${name} gallery` }]);
      } else {
        setPrimaryImageUrl(data.media.url);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const cleanedFeatures = features.map((f) => f.trim()).filter(Boolean);
      const imagesPayload = [
        {
          url: primaryImageUrl || '/brand/logo-stacked.png',
          alt: `${name} primary photo`,
          isPrimary: true,
          sortOrder: 0,
        },
        ...galleryImages.map((g, idx) => ({
          url: g.url,
          alt: g.alt || `${name} gallery ${idx + 1}`,
          isPrimary: false,
          sortOrder: idx + 1,
        })),
      ];

      const payload: ProductInput = {
        name,
        slug: slug.trim().toLowerCase(),
        categoryId,
        shortDescription,
        description,
        features: cleanedFeatures,
        images: imagesPayload,
        isPublished,
        sortOrder: Number(sortOrder) || 0,
        seo: {
          title: seoTitle || `${name} | Klub Sports`,
          description: seoDescription || shortDescription,
        },
      };

      const parsed = productSchema.safeParse(payload);
      if (!parsed.success) {
        const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
        throw new Error(firstError || 'Validation error in product fields');
      }

      const endpoint = isEdit
        ? `/api/admin/products/${initialData._id}`
        : '/api/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccess(
        isEdit
          ? 'Product updated successfully. Changes are now live on the website!'
          : 'Product created and published immediately!'
      );

      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <span className="text-xs text-stone-400">
          * Immediate publishing workflow active
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Basic Product Information
            </h2>

            {/* Product Name */}
            <div>
              <label htmlFor="pname" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Product Name <span className="text-brand-orange">*</span>
              </label>
              <input
                id="pname"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Klub Velocity Pro Carbon"
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="pslug" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                URL Slug <span className="text-brand-orange">*</span>
              </label>
              <input
                id="pslug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="e.g. klub-velocity-pro-carbon"
                className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Public URL: /products/{slug || '...'}
              </span>
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="pshort" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Short Description (Catalogue Preview)
              </label>
              <textarea
                id="pshort"
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Concise overview for catalogue cards..."
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
              />
            </div>

            {/* Full Description */}
            <div>
              <label htmlFor="pdesc" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Technical Description
              </label>
              <textarea
                id="pdesc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive technical and engineering details..."
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
              />
            </div>
          </div>

          {/* Features Builder */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Approved Features & Engineering Specs
              </h2>
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 hover:bg-orange-100 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder={`e.g. Curved carbon-composite propulsion plate`}
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-stone-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Search Engine Optimization (SEO)
            </h2>
            <div>
              <label htmlFor="pseotitle" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                SEO Title
              </label>
              <input
                id="pseotitle"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${name || 'Footwear'} | Klub Sports Catalogue`}
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="pseodesc" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                id="pseodesc"
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description for search results..."
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Imagery, Publishing */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Controls */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-2 border-b border-stone-100">
              Publishing Settings
            </h3>

            {/* Publication Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
              <div>
                <span className="text-xs font-bold text-stone-800 block">Publication Status</span>
                <span className="text-[11px] text-stone-500">
                  {isPublished ? 'Live on public website' : 'Hidden from public'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange accent-brand-orange cursor-pointer"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label htmlFor="pcat" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Category Taxonomy <span className="text-brand-orange">*</span>
              </label>
              <select
                id="pcat"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="psort" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Catalogue Display Order
              </label>
              <input
                id="psort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>{isEdit ? 'Update & Publish' : 'Create & Publish'}</span>
              )}
            </button>
          </div>

          {/* Primary Product Image */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-2 border-b border-stone-100">
              Primary Product Photograph
            </h3>

            {primaryImageUrl ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                <Image
                  src={primaryImageUrl}
                  alt={name || 'Primary product preview'}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-4 text-stone-400 text-center">
                <Upload className="w-8 h-8 mb-2 text-stone-300" />
                <span className="text-xs">No primary image selected</span>
              </div>
            )}

            <div>
              <label htmlFor="primaryUrl" className="block text-[11px] font-semibold text-stone-600 mb-1">
                Image URL
              </label>
              <input
                id="primaryUrl"
                type="url"
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                placeholder="https://... or /brand/..."
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>

            {/* Direct Image Upload */}
            <div>
              <label className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading Image...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => handleFileUpload(e, false)}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Additional Gallery Images */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Additional Gallery ({galleryImages.length})
              </h3>
              <label className="text-xs font-bold text-brand-orange hover:underline cursor-pointer">
                + Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileUpload(e, true)}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.map((g, idx) => (
                  <div key={idx} className="relative aspect-video rounded border overflow-hidden group">
                    <Image src={g.url} alt={g.alt} fill className="object-cover" sizes="120px" />
                    <button
                      type="button"
                      onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No secondary gallery images.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
