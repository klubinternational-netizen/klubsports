import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'klub_admin_session';
const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || 'klub_sports_production_fallback_secret_key_minimum_32_chars_2026'
);

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  role: 'superadmin';
  iat?: number;
  exp?: number;
}

export async function createSessionToken(payload: { adminId: string; email: string }): Promise<string> {
  return new SignJWT({
    adminId: payload.adminId,
    email: payload.email,
    role: 'superadmin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(req: NextRequest): Promise<AdminSessionPayload | null> {
  try {
    const cookieToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || authHeader;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
  const isHttps = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
