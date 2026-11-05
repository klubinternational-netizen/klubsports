import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';
import { sendAdminPasswordResetOtpEmail } from '@/lib/email/resend';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limit: Max 5 OTP requests per 15 minutes per IP
    const rateCheck = checkRateLimit(`forgot-password-otp:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    let targetEmail = 'klubinternational@gmail.com';
    try {
      const body = await req.json();
      if (body?.email && typeof body.email === 'string' && body.email.trim()) {
        targetEmail = body.email.trim().toLowerCase();
      }
    } catch {
      // If empty body, proceed with default targetEmail
    }

    await connectToDatabase();

    // Look up admin by target email or fallback to klubinternational@gmail.com / primary active admin
    let admin = await Admin.findOne({ email: targetEmail, isActive: true });
    if (!admin && targetEmail === 'klubinternational@gmail.com') {
      admin = await Admin.findOne({ isActive: true });
    }

    if (!admin) {
      // Don't leak admin existence, but for clarity if requested specifically:
      return NextResponse.json(
        { error: 'No active administrator account registered for this email address.' },
        { status: 404 }
      );
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    admin.resetPasswordOtp = otp;
    admin.resetPasswordExpires = expiresAt;
    await admin.save();

    // Dispatch OTP email to admin email
    const emailResult = await sendAdminPasswordResetOtpEmail({
      toEmail: admin.email,
      otp,
      expiresInMinutes: 10,
    });

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please verify mail configuration or try again shortly.' },
        { status: 500 }
      );
    }

    // Mask email for privacy preview (e.g. k***l@gmail.com)
    const [user, domain] = admin.email.split('@');
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
    const maskedEmail = `${maskedUser}@${domain}`;

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${admin.email}`,
      maskedEmail,
      email: admin.email,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
