import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { uploadMediaFile } from '@/lib/imagekit';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'ksports';

    if (!file) {
      return NextResponse.json({ error: 'No file provided for upload' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadMediaFile(buffer, file.name, file.type, folder);

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPLOAD_MEDIA',
      resourceType: 'MEDIA',
      resourceId: result.fileId,
      summary: `Uploaded image "${file.name}" via ${result.provider}`,
    });

    return NextResponse.json({
      success: true,
      media: {
        url: result.url,
        fileId: result.fileId,
        fileName: result.name,
        provider: result.provider,
      },
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: error.message || 'Media upload failed' }, { status: 400 });
  }
}
