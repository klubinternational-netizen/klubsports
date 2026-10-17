import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  await connectToDatabase();
  const admin = await Admin.findById(authResult.adminId).select('-passwordHash');
  if (!admin) {
    return NextResponse.json({ error: 'Administrator not found' }, { status: 404 });
  }

  return NextResponse.json({
    admin: {
      id: admin._id,
      email: admin.email,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
    },
  });
}
