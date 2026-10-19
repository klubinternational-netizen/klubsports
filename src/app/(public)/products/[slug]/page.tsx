import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import ProductGallery from '@/components/products/ProductGallery';

export const revalidate = 60;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase();
  const product = await Product.findOne({ slug: params.slug, isPublished: true })
    .populate('categoryId', 'name')
    .lean();

  if (!product) {
    return {
      title: 'Product Not Found | Klub Sports',
    };
  }

  return {
    title: product.seo?.title || `${product.name} | Klub Sports Footwear`,
    description: product.seo?.description || product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  await connectToDatabase();

  const product = await Product.findOne({ slug: params.slug, isPublished: true })
    .populate('categoryId', 'name slug description')
    .lean();

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedProducts = await Product.find({
    categoryId: (product.categoryId as any)._id,
    _id: { $ne: product._id },
    isPublished: true,
  })
    .select('name slug shortDescription images sortOrder')
    .limit(3)
    .lean();

  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedRelated = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <div className="bg-white min-h-screen pt-28 sm:pt-36 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link href="/products" className="hover:text-stone-900 transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link
            href={`/categories/${serializedProduct.categoryId?.slug}`}
            className="hover:text-stone-900 transition-colors"
          >
            {serializedProduct.categoryId?.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="font-semibold text-stone-900">{serializedProduct.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={serializedProduct.images || []} productName={serializedProduct.name} />
          </div>

          {/* Right: Specifications & Enquiry CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <Link
                  href={`/categories/${serializedProduct.categoryId?.slug}`}
                  className="inline-block text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline mb-2"
                >
                  {serializedProduct.categoryId?.name}
                </Link>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 uppercase tracking-tight">
                  {serializedProduct.name}
                </h1>
                <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                  {serializedProduct.shortDescription}
                </p>
              </div>

              {/* Verified Product Features */}
              {serializedProduct.features && serializedProduct.features.length > 0 && (
                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                    Engineered Features & Specifications
                  </h3>
                  <ul className="space-y-2.5">
                    {serializedProduct.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Description */}
              {serializedProduct.description && (
                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Design & Performance Details
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {serializedProduct.description}
                  </p>
                </div>
              )}

              {/* Institutional Notice */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  <span>Institutional Procurement Notice</span>
                </div>
                <p>
                  Klub Sports is an institutional supplier. For sample requests, size curve matrices, and volume pricing, please connect through our business enquiry desk.
                </p>
              </div>
            </div>

            {/* Business Enquiry Action */}
            <div className="pt-8 mt-8 border-t border-stone-200 space-y-3">
              <Link
                href={`/contact?category=${serializedProduct.categoryId?.slug || ''}&product=${encodeURIComponent(serializedProduct.name)}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Business Enquiry for this Model</span>
              </Link>
              <p className="text-center text-[11px] text-stone-400">
                Institutional Desk Response: 24–48 Business Hours
              </p>
            </div>
          </div>
        </div>

        {/* Related Category Footwear */}
        {serializedRelated && serializedRelated.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Similar Models
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
                  More from {serializedProduct.categoryId?.name}
                </h2>
              </div>
              <Link
                href={`/categories/${serializedProduct.categoryId?.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serializedRelated.map((item: any) => {
                const relImg =
                  item.images?.find((img: any) => img.isPrimary)?.url ||
                  item.images?.[0]?.url ||
                  '/brand/logo-stacked.png';
                return (
                  <Link
                    key={item._id}
                    href={`/products/${item.slug}`}
                    className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-brand-orange/40 hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                      <Image
                        src={relImg}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-brand-orange transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                          {item.shortDescription}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-600 group-hover:text-brand-orange">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
