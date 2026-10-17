import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { SiteSettings } from '@/models/SiteSettings';

export async function GET() {
  try {
    await connectToDatabase();
    let settings: any = await SiteSettings.findOne().lean();
    if (!settings) {
      const created = await SiteSettings.create({});
      settings = created.toObject();
    }
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Public settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}
