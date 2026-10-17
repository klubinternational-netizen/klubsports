import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest, AdminSessionPayload } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { AdminActivityLog } from '@/models/AdminActivityLog';
import { Admin } from '@/models/Admin';

export interface AuthenticatedAdminResult {
  session: AdminSessionPayload;
  response?: NextResponse;
}

export async function requireAdminAuth(req: NextRequest): Promise<AdminSessionPayload | NextResponse> {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Administrator authentication required' },
      { status: 401 }
    );
  }

  // Verify that the admin account is still active in DB
  try {
    await connectToDatabase();
    const admin = await Admin.findById(session.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator account inactive or not found' },
        { status: 401 }
      );
    }
  } catch {
    // If DB check fails, fail safely
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 503 }
    );
  }

  return session;
}

export async function recordAdminActivity(params: {
  adminEmail: string;
  adminId?: string;
  action: string;
  resourceType: 'PRODUCT' | 'CATEGORY' | 'PAGE' | 'SETTINGS' | 'ENQUIRY' | 'AUTH' | 'MEDIA';
  resourceId?: string;
  summary: string;
}): Promise<void> {
  try {
    await connectToDatabase();
    await AdminActivityLog.create({
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId || '',
      summary: params.summary,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to log admin activity:', err);
  }
}
