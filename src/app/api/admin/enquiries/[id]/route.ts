import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Enquiry } from '@/models/Enquiry';
import { adminUpdateEnquirySchema } from '@/lib/validations/enquiry';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const enquiry = await Enquiry.findById(params.id).populate('categoryId', 'name slug').lean();
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }
    return NextResponse.json({ enquiry });
  } catch (error: any) {
    console.error('Fetch enquiry error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiry' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = adminUpdateEnquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const enquiry = await Enquiry.findById(params.id);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    enquiry.status = parsed.data.status;
    if (parsed.data.internalNotes !== undefined) {
      enquiry.internalNotes = parsed.data.internalNotes;
    }
    await enquiry.save();

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_ENQUIRY',
      resourceType: 'ENQUIRY',
      resourceId: params.id,
      summary: `Updated enquiry status to "${enquiry.status}" for submitter ${enquiry.name}`,
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    console.error('Update enquiry error:', error);
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const enquiry = await Enquiry.findById(params.id);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const name = enquiry.name;
    await Enquiry.findByIdAndDelete(params.id);

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'DELETE_ENQUIRY',
      resourceType: 'ENQUIRY',
      resourceId: params.id,
      summary: `Deleted enquiry from ${name}`,
    });

    return NextResponse.json({ success: true, message: `Enquiry from ${name} deleted successfully` });
  } catch (error: any) {
    console.error('Delete enquiry error:', error);
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
