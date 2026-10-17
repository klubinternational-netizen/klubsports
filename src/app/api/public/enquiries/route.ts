import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Enquiry } from '@/models/Enquiry';
import { Category } from '@/models/Category';
import { publicEnquirySchema } from '@/lib/validations/enquiry';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limiting: 5 enquiries per IP per 10 minutes
    const rateCheck = checkRateLimit(`enquiry:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'You have submitted multiple enquiries recently. Please wait a few moments before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot spam protection
    if (body.honeypot && body.honeypot.length > 0) {
      // Bot detected, pretend success without saving
      return NextResponse.json({
        success: true,
        message: 'Your enquiry has been received. Our team will contact you shortly.',
      });
    }

    const parsed = publicEnquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please review and correct the form fields.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Duplicate submission prevention: check if identical enquiry was received from same email/ip in the last 60 seconds
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const duplicate = await Enquiry.findOne({
      email: parsed.data.email,
      message: parsed.data.message,
      createdAt: { $gte: oneMinuteAgo },
    });

    if (duplicate) {
      return NextResponse.json({
        success: true,
        message: 'Your enquiry was already received. Our institutional desk is reviewing it.',
        enquiryId: duplicate._id,
      });
    }

    // Resolve category name if categoryId was selected
    let resolvedCategoryName = parsed.data.categoryName || '';
    let categoryObjId: any = undefined;

    if (parsed.data.categoryId) {
      try {
        const cat = await Category.findById(parsed.data.categoryId);
        if (cat) {
          resolvedCategoryName = cat.name;
          categoryObjId = cat._id;
        }
      } catch {
        // invalid object id, ignore
      }
    }

    const enquiry = await Enquiry.create({
      name: parsed.data.name,
      companyName: parsed.data.companyName || '',
      email: parsed.data.email,
      phone: parsed.data.phone,
      categoryId: categoryObjId,
      categoryName: resolvedCategoryName,
      message: parsed.data.message,
      status: 'New',
      sourcePage: parsed.data.sourcePage || '/contact',
      ipAddress: ip,
    });

    // Optional Resend notification hook
    if (process.env.RESEND_API_KEY && process.env.ENQUIRY_NOTIFICATION_EMAIL) {
      try {
        // Trigger Resend asynchronously if key is provided
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Klub Sports Notifications <no-reply@klubsports.com>',
            to: [process.env.ENQUIRY_NOTIFICATION_EMAIL],
            subject: `New Business Enquiry from ${parsed.data.name} (${parsed.data.companyName || 'Individual'})`,
            html: `
              <h2>New Business Enquiry Received</h2>
              <p><strong>Name:</strong> ${parsed.data.name}</p>
              <p><strong>Company:</strong> ${parsed.data.companyName || 'N/A'}</p>
              <p><strong>Email:</strong> ${parsed.data.email}</p>
              <p><strong>Phone:</strong> ${parsed.data.phone}</p>
              <p><strong>Interested Category:</strong> ${resolvedCategoryName || 'General Enquiry'}</p>
              <p><strong>Source Page:</strong> ${parsed.data.sourcePage}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${parsed.data.message.replace(/\n/g, '<br />')}</p>
            `,
          }),
        }).catch((err) => console.error('Resend email error:', err));
      } catch (e) {
        console.error('Email dispatch error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting Klub Sports. Our team will review your requirement and respond shortly.',
      enquiryId: enquiry._id,
    });
  } catch (error: any) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving your enquiry. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
