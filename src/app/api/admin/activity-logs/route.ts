import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { AdminActivityLog } from '@/models/AdminActivityLog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50', 10));
    const logs = await AdminActivityLog.find().sort({ timestamp: -1 }).limit(limit).lean();

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Fetch activity logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}
