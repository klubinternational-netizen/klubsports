import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { changePasswordSchema } from '@/lib/validations/auth';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findById(authResult.adminId);
    if (!admin) {
      return NextResponse.json({ error: 'Administrator not found' }, { status: 404 });
    }

    const isMatch = await verifyPassword(parsed.data.currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    admin.passwordHash = await hashPassword(parsed.data.newPassword);
    await admin.save();

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_PASSWORD',
      resourceType: 'AUTH',
      resourceId: authResult.adminId,
      summary: 'Administrator password updated successfully',
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
