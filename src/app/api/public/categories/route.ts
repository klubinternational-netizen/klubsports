import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isPublished: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Published product count per category
    const productCounts = await Product.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(productCounts.map((c) => [c._id.toString(), c.count]));

    const result = categories.map((cat) => ({
      ...cat,
      productCount: countMap.get(cat._id.toString()) || 0,
    }));

    return NextResponse.json({ categories: result });
  } catch (error: any) {
    console.error('Public categories fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve categories' }, { status: 500 });
  }
}
