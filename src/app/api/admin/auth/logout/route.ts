import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSessionCookie, getAdminSessionFromRequest } from '@/lib/auth/session';
import { recordAdminActivity } from '@/lib/security/adminAuth';

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearAdminSessionCookie(response);

  if (session) {
    await recordAdminActivity({
      adminId: session.adminId,
      adminEmail: session.email,
      action: 'LOGOUT',
      resourceType: 'AUTH',
      resourceId: session.adminId,
      summary: 'Administrator logged out',
    });
  }

  return response;
}
