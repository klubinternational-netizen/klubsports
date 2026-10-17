import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const query: any = { isPublished: true };

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug, isPublished: true });
      if (category) {
        query.categoryId = category._id;
      } else {
        // If specified category doesn't exist/not published, return empty list
        return NextResponse.json({
          products: [],
          pagination: { total: 0, page, limit, pages: 0 },
        });
      }
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { shortDescription: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { features: { $regex: term, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('categoryId', 'name slug')
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Public products fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve products' }, { status: 500 });
  }
}
