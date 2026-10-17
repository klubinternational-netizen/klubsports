import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Enquiry } from '@/models/Enquiry';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '25', 10);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const [enquiries, total, countsByStatus] = await Promise.all([
      Enquiry.find(query)
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(query),
      Enquiry.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCounts = {
      New: 0,
      'In Progress': 0,
      Closed: 0,
    };
    countsByStatus.forEach((item) => {
      if (item._id in statusCounts) {
        (statusCounts as any)[item._id] = item.count;
      }
    });

    return NextResponse.json({
      enquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      statusCounts,
    });
  } catch (error: any) {
    console.error('Fetch enquiries error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
