import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';
import { hashPassword } from '@/lib/auth/password';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { recordAdminActivity } from '@/lib/security/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limit: Max 10 attempts per 15 minutes
    const rateCheck = checkRateLimit(`reset-password-verify:${ip}`, 10, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, otp, newPassword } = body || {};

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: 'Please enter the valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanEmail = (email && typeof email === 'string' ? email : 'klubinternational@gmail.com').trim().toLowerCase();
    
    // Find admin by email or find admin with this OTP
    let admin = await Admin.findOne({ email: cleanEmail, isActive: true });
    if (!admin) {
      admin = await Admin.findOne({ resetPasswordOtp: otp.trim(), isActive: true });
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrator account not found.' },
        { status: 404 }
      );
    }

    // Verify OTP matches and is not expired
    if (!admin.resetPasswordOtp || admin.resetPasswordOtp !== otp.trim()) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check your email and try again.' },
        { status: 400 }
      );
    }

    if (!admin.resetPasswordExpires || new Date() > new Date(admin.resetPasswordExpires)) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new OTP code.' },
        { status: 400 }
      );
    }

    // Hash the new password and save
    const newHash = await hashPassword(newPassword.trim());
    admin.passwordHash = newHash;
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    // Log the password reset activity
    await recordAdminActivity({
      adminId: (admin._id as any).toString(),
      adminEmail: admin.email,
      action: 'RESET_PASSWORD',
      resourceType: 'AUTH',
      resourceId: (admin._id as any).toString(),
      summary: `Administrator password was reset via email OTP verification (${ip})`,
    });

    return NextResponse.json({
      success: true,
      message: 'Your administrator password has been reset successfully. Please log in with your new password.',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
