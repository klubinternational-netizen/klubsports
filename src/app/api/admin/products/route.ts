import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { productSchema } from '@/lib/validations/product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const categoryId = url.searchParams.get('categoryId') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }
    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (status === 'published') {
      query.isPublished = true;
    } else if (status === 'unpublished') {
      query.isPublished = false;
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
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify valid category
    const category = await Category.findById(parsed.data.categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await Product.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }

    const newProduct = await Product.create(parsed.data);

    // Record activity
    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'CREATE_PRODUCT',
      resourceType: 'PRODUCT',
      resourceId: (newProduct._id as any).toString(),
      summary: `Created product "${newProduct.name}" (slug: ${newProduct.slug})`,
    });

    // Revalidate public routes for immediate publishing
    revalidatePath('/products');
    revalidatePath(`/products/${newProduct.slug}`);
    revalidatePath(`/categories/${category.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Admin product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
