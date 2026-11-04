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
  Star,
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
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [showSlugField, setShowSlugField] = useState(false);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Auto-generate slug continuously from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited && !isEdit) {
      setSlug(generateSlug(val));
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

  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  // Multi-image direct upload (No URL needed)
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}`);
        }
        uploadedUrls.push(data.media.url);
      }

      let newPrimary = primaryImageUrl;
      const newGallery = [...galleryImages];

      uploadedUrls.forEach((url) => {
        if (!newPrimary) {
          newPrimary = url;
        } else {
          newGallery.push({ url, alt: `${name || 'Product'} gallery` });
        }
      });

      setPrimaryImageUrl(newPrimary);
      setGalleryImages(newGallery);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };

  const handleSetPrimary = (index: number) => {
    const selected = galleryImages[index];
    if (!selected) return;

    const updatedGallery = galleryImages.filter((_, i) => i !== index);
    if (primaryImageUrl) {
      updatedGallery.unshift({ url: primaryImageUrl, alt: `${name || 'Product'} gallery` });
    }

    setPrimaryImageUrl(selected.url);
    setGalleryImages(updatedGallery);
  };

  const handleRemovePrimary = () => {
    if (galleryImages.length > 0) {
      const [first, ...rest] = galleryImages;
      setPrimaryImageUrl(first.url);
      setGalleryImages(rest);
    } else {
      setPrimaryImageUrl('');
    }
  };

  const handleRemoveGallery = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
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

      const finalSlug = (slug || generateSlug(name)).trim().toLowerCase();
      if (!finalSlug) {
        throw new Error('Please enter a product name to generate a URL web link');
      }

      const payload: ProductInput = {
        name,
        slug: finalSlug,
        categoryId,
        shortDescription,
        description,
        features: cleanedFeatures,
        images: imagesPayload,
        isPublished,
        sortOrder: Number(sortOrder) || 0,
        seo: {
          title: seoTitle || `${name} | KSports`,
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
                placeholder="e.g. KSports Velocity Pro Carbon"
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition-colors"
              />

              {/* Automated Web Link Preview */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-stone-400 text-[11px] uppercase tracking-wider font-semibold">Web Link:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs font-medium">
                    /products/{slug || generateSlug(name) || 'product-name'}
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
                <div className="mt-3 p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <label htmlFor="pslug" className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Custom URL Slug (Optional)
                  </label>
                  <input
                    id="pslug"
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setSlug(generateSlug(e.target.value));
                    }}
                    placeholder="e.g. ksports-velocity-pro-carbon"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <p className="text-[10px] text-stone-400">
                    Only change this if you want a custom link. Letters, numbers, and hyphens only.
                  </p>
                </div>
              )}
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
                placeholder={`${name || 'Footwear'} | KSports Catalogue`}
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

          {/* Product Photography & Gallery (Upload Only, No URLs, Multi-Selection) */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Product Photography
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Select one or multiple images from device (no URLs needed).
                </p>
              </div>
              <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {(primaryImageUrl ? 1 : 0) + galleryImages.length} Photos
              </span>
            </div>

            {/* Direct Multi-File Upload Dropzone / Button */}
            <label className="w-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl border-2 border-dashed border-orange-300 hover:border-brand-orange bg-orange-50/40 hover:bg-orange-50/80 cursor-pointer transition-all group text-center">
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                  <span className="text-xs font-bold text-stone-800">
                    {uploadProgress
                      ? `Uploading Image ${uploadProgress.current} of ${uploadProgress.total}...`
                      : 'Uploading Images...'}
                  </span>
                  <span className="text-[10px] text-stone-500">Optimizing and saving to media storage...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                      Click or Tap to Select Product Images
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Supports selecting multiple images at once (JPG, PNG, WEBP)
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-white rounded-full border border-orange-200 shadow-2xs">
                    + Choose Multiple Images
                  </span>
                </div>
              )}
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleMultipleFilesUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* Uploaded Photos Grid */}
            {primaryImageUrl ? (
              <div className="space-y-4 pt-1">
                {/* Primary Cover Image Preview */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Primary Cover Photo
                  </span>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-brand-orange/40 bg-stone-100 shadow-sm group">
                    <Image
                      src={primaryImageUrl}
                      alt={name || 'Primary product preview'}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 1024px) 100vw, 400px"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <Star className="w-3 h-3 fill-white" />
                        Primary Cover
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePrimary}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                      title="Remove primary image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Additional Gallery Photos */}
                {galleryImages.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                      Additional Gallery Views ({galleryImages.length})
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {galleryImages.map((g, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg border border-stone-200 overflow-hidden bg-stone-50 group hover:border-brand-orange/50 transition-colors"
                        >
                          <Image
                            src={g.url}
                            alt={g.alt || 'Gallery photo'}
                            fill
                            className="object-cover"
                            sizes="180px"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveGallery(idx)}
                              className="self-end p-1 rounded bg-black/70 hover:bg-red-600 text-white transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="w-full py-1 px-1.5 rounded bg-brand-orange hover:bg-brand-orange-dark text-white text-[10px] font-bold uppercase tracking-wider transition-colors text-center shadow-xs"
                            >
                              Make Primary
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-400">
                No images uploaded yet. Select one or multiple images above.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
