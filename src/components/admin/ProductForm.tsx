'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Star,
  IndianRupee,
  Eye,
  EyeOff,
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

  // Categories
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // 1. Product Name
  const [name, setName] = useState(initialData?.name || '');

  // 2. Category
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId?._id || initialData?.categoryId || ''
  );

  // 3. Price
  const [price, setPrice] = useState<string | number>(
    initialData?.price !== undefined && initialData?.price !== null ? initialData.price : ''
  );

  // 4. Description
  const [description, setDescription] = useState(
    initialData?.description || initialData?.shortDescription || ''
  );

  // 5. Visibility on public website
  const [isPublished, setIsPublished] = useState<boolean>(
    initialData?.isPublished !== undefined ? initialData.isPublished : true
  );

  // 6. Multiple Images Upload
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(
    initialData?.images?.find((img: any) => img.isPrimary)?.url ||
      initialData?.images?.[0]?.url ||
      ''
  );
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; alt: string }>>(
    initialData?.images?.filter((img: any) => !img.isPrimary) || []
  );

  // Slug (silently generated from name)
  const [slug, setSlug] = useState(initialData?.slug || '');

  // Status & Progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Load categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const list = data.categories || [];
        setCategories(list);
        if (!categoryId && list.length > 0) {
          setCategoryId(list[0]._id);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Multiple files upload
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
          newGallery.push({ url, alt: `${name || 'Product'} image` });
        }
      });

      setPrimaryImageUrl(newPrimary);
      setGalleryImages(newGallery);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Please try again.');
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
      if (!name.trim()) {
        throw new Error('Please enter a product name');
      }

      if (!categoryId) {
        throw new Error('Please select a product category');
      }

      const finalSlug = (slug || generateSlug(name) || `product-${Date.now()}`).trim().toLowerCase();
      const numPrice = price === '' ? 0 : Number(price);

      const imagesPayload = [
        ...(primaryImageUrl
          ? [
              {
                url: primaryImageUrl,
                alt: `${name} primary photo`,
                isPrimary: true,
                sortOrder: 0,
              },
            ]
          : []),
        ...galleryImages.map((g, idx) => ({
          url: g.url,
          alt: g.alt || `${name} gallery ${idx + 1}`,
          isPrimary: false,
          sortOrder: idx + 1,
        })),
      ];

      const payload: ProductInput = {
        name: name.trim(),
        slug: finalSlug,
        categoryId,
        price: isNaN(numPrice) ? 0 : numPrice,
        description: description.trim(),
        shortDescription: description.trim().slice(0, 160),
        features: initialData?.features || [],
        images: imagesPayload,
        isPublished,
        sortOrder: initialData?.sortOrder || 0,
        seo: {
          title: `${name.trim()} | KSports`,
          description: description.trim().slice(0, 160),
        },
      };

      const parsed = productSchema.safeParse(payload);
      if (!parsed.success) {
        const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
        throw new Error(firstError || 'Validation error in product fields');
      }

      const endpoint = isEdit ? `/api/admin/products/${initialData._id}` : '/api/admin/products';
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
          ? 'Product updated successfully! Changes are live on the website.'
          : 'Product created successfully and published to catalogue!'
      );

      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-orange transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <span className="text-xs text-stone-400">
          * Immediate live catalogue sync active
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
        {/* Left Column: Essential Details (Name, Category, Price, Description, Visibility) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Product Details
            </h2>

            {/* 1. Product Name */}
            <div>
              <label htmlFor="pname" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Product Name <span className="text-brand-orange">*</span>
              </label>
              <input
                id="pname"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit) setSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g. KSports StridePro Jogger (Men)"
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition-colors"
              />
            </div>

            {/* 2. Category Selector */}
            <div>
              <label htmlFor="pcat" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Category <span className="text-brand-orange">*</span>
              </label>
              <select
                id="pcat"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Product Price */}
            <div>
              <label htmlFor="pprice" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Price (₹) <span className="text-stone-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="pprice"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 2499"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
                />
              </div>
            </div>

            {/* 4. Product Description */}
            <div>
              <label htmlFor="pdesc" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Product Description
              </label>
              <textarea
                id="pdesc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter footwear details, specifications, materials, or features..."
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white resize-y"
              />
            </div>

            {/* 5. Visibility on Public Website */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-4 rounded-xl bg-orange-50/50 border border-orange-200 cursor-pointer hover:bg-orange-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>
                    {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Visible on Public Website
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {isPublished
                        ? 'Published — Visible to customers on the website'
                        : 'Hidden / Draft — Not visible on the public website'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 text-brand-orange rounded focus:ring-brand-orange accent-brand-orange cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Multiple Images Upload & Publish Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Product Photography Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Product Images
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Select one or multiple photos from your device
                </p>
              </div>
              <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {(primaryImageUrl ? 1 : 0) + galleryImages.length} Photos
              </span>
            </div>

            {/* Direct Multi-Image Upload Dropzone */}
            <label className="w-full flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-orange-300 hover:border-brand-orange bg-orange-50/40 hover:bg-orange-50/70 cursor-pointer transition-all group text-center">
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2 py-2">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                  <span className="text-xs font-bold text-stone-800">
                    {uploadProgress
                      ? `Uploading Photo ${uploadProgress.current} of ${uploadProgress.total}...`
                      : 'Uploading Images...'}
                  </span>
                  <span className="text-[10px] text-stone-500">Saving to media storage...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 py-2">
                  <div className="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                      Choose Multiple Images
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Select multiple photos at once (JPG, PNG, WEBP)
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-white rounded-full border border-orange-200 shadow-2xs">
                    + Upload Images
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

            {/* Photos Previews */}
            {primaryImageUrl ? (
              <div className="space-y-3 pt-2">
                {/* Primary Cover Image */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Cover Photo (Primary)
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
                        Main Photo
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePrimary}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Additional Photos */}
                {galleryImages.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                      Additional Photos ({galleryImages.length})
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
                              className="self-end p-1 rounded bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="w-full py-1 px-1.5 rounded bg-brand-orange hover:bg-brand-orange-dark text-white text-[10px] font-bold uppercase tracking-wider transition-colors text-center shadow-xs cursor-pointer"
                            >
                              Set as Main
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
                No images selected yet. Tap above to upload.
              </div>
            )}

            {/* Save / Publish Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <span>{isEdit ? 'Update Product' : 'Create & Publish Product'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
