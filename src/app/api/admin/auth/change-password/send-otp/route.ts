import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';
import { verifyPassword } from '@/lib/auth/password';
import { sendAdminPasswordResetOtpEmail } from '@/lib/email/resend';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limit: Max 5 password-change OTP requests per 10 minutes
    const rateCheck = checkRateLimit(`change-pw-otp:${authResult.adminId}:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { currentPassword } = body;

    await connectToDatabase();
    const admin = await Admin.findById(authResult.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Administrator account not found or inactive.' }, { status: 404 });
    }

    // If currentPassword was supplied, verify it before sending OTP
    if (currentPassword) {
      const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: 'Current password is incorrect. Please re-enter your current password.' },
          { status: 400 }
        );
      }
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    admin.resetPasswordOtp = otp;
    admin.resetPasswordExpires = expiresAt;
    await admin.save();

    // Dispatch verification email to admin email (klubinternational@gmail.com)
    const emailResult = await sendAdminPasswordResetOtpEmail({
      toEmail: admin.email,
      otp,
      expiresInMinutes: 10,
    });

    if (!emailResult.success) {
      console.error('Failed to dispatch password change OTP email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to deliver OTP email. Please verify mail configuration or try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${admin.email}`,
      email: admin.email,
    });
  } catch (error: any) {
    console.error('Change password send OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate verification code' },
      { status: 500 }
    );
  }
}
