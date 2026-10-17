'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Copy, Check, Loader2, AlertCircle, ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  const [uploadedMedia, setUploadedMedia] = useState<Array<{ url: string; fileName: string; provider: string }>>([
    { url: '/brand/logo-horizontal.png', fileName: 'logo-horizontal.png', provider: 'official-brand' },
    { url: '/brand/logo-stacked.png', fileName: 'logo-stacked.png', provider: 'official-brand' },
    { url: '/brand/logo-icon.png', fileName: 'logo-icon.png', provider: 'official-brand' },
    { url: '/brand/logo-wordmark.png', fileName: 'logo-wordmark.png', provider: 'official-brand' },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'media-library');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setUploadedMedia([
        {
          url: data.media.url,
          fileName: data.media.fileName,
          provider: data.media.provider,
        },
        ...uploadedMedia,
      ]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Asset Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Media Library
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Upload sports footwear photography, factory imagery, and branding assets with automatic optimization.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-sm cursor-pointer self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload New Media'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-3 border-b border-stone-100 mb-6">
          Stored Images & Media Assets ({uploadedMedia.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {uploadedMedia.map((item, idx) => (
            <div
              key={idx}
              className="group bg-stone-50 rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-brand-orange/40 hover:shadow-md transition-all"
            >
              <div className="relative aspect-square bg-white flex items-center justify-center p-2">
                <Image
                  src={item.url}
                  alt={item.fileName}
                  fill
                  className="object-contain p-2"
                  sizes="200px"
                />
              </div>
              <div className="p-3 bg-white border-t border-stone-100 space-y-2">
                <div className="text-[11px] font-bold text-stone-800 truncate" title={item.fileName}>
                  {item.fileName}
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span className="uppercase">{item.provider}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.url)}
                    className="inline-flex items-center gap-1 text-brand-orange hover:text-brand-orange-dark font-bold"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
