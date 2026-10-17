'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const fallbackList = images && images.length > 0 ? images : [{ url: '/brand/logo-stacked.png', alt: productName }];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = fallbackList[selectedIndex] || fallbackList[0];

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productName}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>

      {/* Gallery Thumbnails */}
      {fallbackList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {fallbackList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-brand-orange shadow-md scale-[1.02]'
                  : 'border-stone-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
