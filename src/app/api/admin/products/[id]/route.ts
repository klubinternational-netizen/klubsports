import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { productSchema } from '@/lib/validations/product';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const product = await Product.findById(params.id).populate('categoryId', 'name slug').lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
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
    const existing = await Product.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Slug conflict check with other products
    const slugClash = await Product.findOne({ slug: parsed.data.slug, _id: { $ne: params.id } });
    if (slugClash) {
      return NextResponse.json({ error: 'Another product with this slug already exists' }, { status: 409 });
    }

    // Verify category
    const category = await Category.findById(parsed.data.categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 });
    }

    const previousSlug = existing.slug;
    Object.assign(existing, parsed.data);
    await existing.save();

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_PRODUCT',
      resourceType: 'PRODUCT',
      resourceId: params.id,
      summary: `Updated product "${existing.name}" (published: ${existing.isPublished})`,
    });

    // Immediate publishing cache revalidation
    revalidatePath('/products');
    revalidatePath(`/products/${existing.slug}`);
    if (previousSlug !== existing.slug) {
      revalidatePath(`/products/${previousSlug}`);
    }
    revalidatePath(`/categories/${category.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, product: existing });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const slug = product.slug;
    const name = product.name;
    await Product.findByIdAndDelete(params.id);

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'DELETE_PRODUCT',
      resourceType: 'PRODUCT',
      resourceId: params.id,
      summary: `Deleted product "${name}" (slug: ${slug})`,
    });

    // Revalidate paths immediately
    revalidatePath('/products');
    revalidatePath(`/products/${slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, message: `Product "${name}" deleted successfully` });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
