import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Enquiry } from '@/models/Enquiry';
import { AdminActivityLog } from '@/models/AdminActivityLog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    await connectToDatabase();

    const [
      totalProducts,
      publishedProducts,
      unpublishedProducts,
      totalCategories,
      newEnquiries,
      inProgressEnquiries,
      closedEnquiries,
      recentProducts,
      recentEnquiries,
      recentActivities,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isPublished: true }),
      Product.countDocuments({ isPublished: false }),
      Category.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'In Progress' }),
      Enquiry.countDocuments({ status: 'Closed' }),
      Product.find()
        .populate('categoryId', 'name')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      AdminActivityLog.find().sort({ timestamp: -1 }).limit(8).lean(),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        publishedProducts,
        unpublishedProducts,
        totalCategories,
        enquiries: {
          new: newEnquiries,
          inProgress: inProgressEnquiries,
          closed: closedEnquiries,
          total: newEnquiries + inProgressEnquiries + closedEnquiries,
        },
      },
      recentProducts,
      recentEnquiries,
      recentActivities,
    });
  } catch (error: any) {
    console.error('Dashboard stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
