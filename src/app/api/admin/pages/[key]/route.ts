import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Page } from '@/models/Page';
import { pageContentSchema } from '@/lib/validations/page';

interface RouteContext {
  params: { key: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const page = await Page.findOne({ key: params.key.toLowerCase() }).lean();
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ page });
  } catch (error: any) {
    console.error('Fetch page error:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = pageContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const key = params.key.toLowerCase();
    const updated = await Page.findOneAndUpdate(
      { key },
      {
        ...parsed.data,
        updatedBy: authResult.email,
      },
      { new: true, upsert: true }
    );

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_PAGE',
      resourceType: 'PAGE',
      resourceId: key,
      summary: `Updated page content for "${key}" (title: ${updated.title})`,
    });

    // Revalidate the corresponding public page immediately
    if (key === 'home') {
      revalidatePath('/');
    } else {
      revalidatePath(`/${key}`);
    }

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
  }
}
