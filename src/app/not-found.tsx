import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Footprints } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center mb-6">
        <Footprints className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
        Page or Product Not Found
      </h1>
      <p className="text-stone-600 text-sm max-w-md mt-3 leading-relaxed">
        The footwear model or corporate page you are looking for does not exist or may currently be unpublished.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors shadow-sm"
        >
          <span>Browse Catalogue</span>
        </Link>
      </div>
    </div>
  );
}
