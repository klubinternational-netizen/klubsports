import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Page } from '@/models/Page';

interface RouteContext {
  params: { key: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ key: params.key.toLowerCase(), isPublished: true }).lean();
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ page });
  } catch (error: any) {
    console.error('Public page fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve page content' }, { status: 500 });
  }
}
