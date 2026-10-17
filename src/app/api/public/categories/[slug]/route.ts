import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

interface RouteContext {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectToDatabase();
    const category = await Category.findOne({ slug: params.slug, isPublished: true }).lean();
    if (!category) {
      return NextResponse.json({ error: 'Category not found or unavailable' }, { status: 404 });
    }

    const products = await Product.find({ categoryId: category._id, isPublished: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      category,
      products,
    });
  } catch (error: any) {
    console.error('Public category detail error:', error);
    return NextResponse.json({ error: 'Failed to retrieve category' }, { status: 500 });
  }
}
