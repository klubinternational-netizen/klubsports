import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Admin } from '@/models/Admin';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, setAdminSessionCookie } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { loginSchema } from '@/lib/validations/auth';
import { recordAdminActivity } from '@/lib/security/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${Math.ceil(rateCheck.resetInMs / 60000)} minutes.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findOne({ email: parsed.data.email });
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordValid = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = await createSessionToken({
      adminId: (admin._id as any).toString(),
      email: admin.email,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
      },
      token,
    });

    setAdminSessionCookie(response, token);

    await recordAdminActivity({
      adminId: (admin._id as any).toString(),
      adminEmail: admin.email,
      action: 'LOGIN',
      resourceType: 'AUTH',
      resourceId: (admin._id as any).toString(),
      summary: `Administrator logged in successfully from IP ${ip}`,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }
}
