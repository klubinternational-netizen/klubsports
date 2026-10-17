import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Product Catalogue
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
          Add New Footwear Model
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Create and immediately publish sports footwear to the public catalogue.
        </p>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}
