import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { SiteSettings } from '@/models/SiteSettings';
import { siteSettingsSchema } from '@/lib/validations/settings';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    let settings: any = await SiteSettings.findOne().lean();
    if (!settings) {
      const created = await SiteSettings.create({});
      settings = created.toObject();
    }
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await SiteSettings.findOneAndUpdate(
      {},
      {
        ...parsed.data,
        updatedBy: authResult.email,
      },
      { new: true, upsert: true }
    );

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_SETTINGS',
      resourceType: 'SETTINGS',
      resourceId: (updated._id as any).toString(),
      summary: `Updated site settings for "${updated.brandName}"`,
    });

    // Revalidate public layouts
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}
