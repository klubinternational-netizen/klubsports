import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, recordAdminActivity } from '@/lib/security/adminAuth';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json().catch(() => ({}));
    const { currentPassword, newPassword, otp } = body;

    if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters in length.' },
        { status: 400 }
      );
    }

    const cleanOtp = typeof otp === 'string' ? otp.trim() : '';
    if (!cleanOtp || cleanOtp.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter the 6-digit OTP verification code sent to your email.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findById(authResult.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Administrator account not found or inactive.' }, { status: 404 });
    }

    // 1. Verify current password
    const isCurrentPasswordCorrect = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isCurrentPasswordCorrect) {
      return NextResponse.json({ error: 'Incorrect current password. Please re-enter your existing password.' }, { status: 400 });
    }

    // 2. Verify OTP
    if (!admin.resetPasswordOtp || !admin.resetPasswordExpires) {
      return NextResponse.json(
        { error: 'No verification request active. Please click "Send Verification OTP" first.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(admin.resetPasswordExpires)) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (admin.resetPasswordOtp.trim() !== cleanOtp) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check your email inbox and enter the correct code.' },
        { status: 400 }
      );
    }

    // 3. Hash and store new password; clear OTP
    admin.passwordHash = await hashPassword(newPassword.trim());
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    await recordAdminActivity({
      adminId: authResult.adminId,
      adminEmail: authResult.email,
      action: 'UPDATE_PASSWORD',
      resourceType: 'AUTH',
      resourceId: authResult.adminId,
      summary: 'Administrator password updated successfully with verified email OTP',
    });

    return NextResponse.json({
      success: true,
      message: 'Administrator password updated successfully!',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Failed to update administrator password' }, { status: 500 });
  }
}
