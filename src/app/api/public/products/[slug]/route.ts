import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

interface RouteContext {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: params.slug, isPublished: true })
      .populate('categoryId', 'name slug description')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found or currently unavailable' }, { status: 404 });
    }

    // Related products from the same published category (excluding current product)
    const relatedProducts = await Product.find({
      categoryId: (product.categoryId as any)._id,
      _id: { $ne: product._id },
      isPublished: true,
    })
      .select('name slug shortDescription images sortOrder')
      .limit(4)
      .lean();

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error: any) {
    console.error('Public product detail error:', error);
    return NextResponse.json({ error: 'Failed to retrieve product details' }, { status: 500 });
  }
}
