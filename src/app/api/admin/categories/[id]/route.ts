import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { categorySchema } from '@/lib/validations/category';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const category = await Category.findById(params.id).lean();
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Fetch category error:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
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
    const existing = await Category.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const slugClash = await Category.findOne({ slug: parsed.data.slug, _id: { $ne: params.id } });
    if (slugClash) {
      return NextResponse.json({ error: 'Another category with this slug already exists' }, { status: 409 });
    }

    const previousSlug = existing.slug;
    Object.assign(existing, parsed.data);
    await existing.save();

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_CATEGORY',
      resourceType: 'CATEGORY',
      resourceId: params.id,
      summary: `Updated category "${existing.name}" (slug: ${existing.slug})`,
    });

    revalidatePath('/products');
    revalidatePath('/categories');
    revalidatePath(`/categories/${existing.slug}`);
    if (previousSlug !== existing.slug) {
      revalidatePath(`/categories/${previousSlug}`);
    }
    revalidatePath('/');

    return NextResponse.json({ success: true, category: existing });
  } catch (error: any) {
    console.error('Category update error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // SAFEGUARD: Check if any products reference this category
    const referencingProductsCount = await Product.countDocuments({ categoryId: params.id });
    if (referencingProductsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}". It is currently referenced by ${referencingProductsCount} product(s). Please reassign or remove these products first.`,
        },
        { status: 400 }
      );
    }

    const slug = category.slug;
    const name = category.name;
    await Category.findByIdAndDelete(params.id);

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'DELETE_CATEGORY',
      resourceType: 'CATEGORY',
      resourceId: params.id,
      summary: `Deleted category "${name}" (slug: ${slug})`,
    });

    revalidatePath('/products');
    revalidatePath('/categories');
    revalidatePath(`/categories/${slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, message: `Category "${name}" deleted successfully` });
  } catch (error: any) {
    console.error('Category delete error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
