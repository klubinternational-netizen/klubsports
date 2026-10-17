import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { categorySchema } from '@/lib/validations/category';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();

    // Attach product counts to each category
    const productCounts = await Product.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(productCounts.map((c) => [c._id.toString(), c.count]));

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      productCount: countMap.get(cat._id.toString()) || 0,
    }));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error: any) {
    console.error('Admin categories fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existing = await Category.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }

    const category = await Category.create(parsed.data);

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'CREATE_CATEGORY',
      resourceType: 'CATEGORY',
      resourceId: (category._id as any).toString(),
      summary: `Created category "${category.name}" (slug: ${category.slug})`,
    });

    revalidatePath('/products');
    revalidatePath('/categories');
    revalidatePath(`/categories/${category.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
