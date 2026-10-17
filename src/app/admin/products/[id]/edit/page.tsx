import React from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import ProductForm from '@/components/admin/ProductForm';

interface Props {
  params: { id: string };
}

export const revalidate = 0;

export default async function EditProductPage({ params }: Props) {
  await connectToDatabase();
  const product = await Product.findById(params.id).populate('categoryId', 'name').lean();

  if (!product) {
    notFound();
  }

  const serialized = JSON.parse(JSON.stringify(product));

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Product Catalogue
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
          Edit Footwear Model
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Modify technical specifications, gallery images, category classification, or SEO metadata.
        </p>
      </div>

      <ProductForm initialData={serialized} isEdit={true} />
    </div>
  );
}
