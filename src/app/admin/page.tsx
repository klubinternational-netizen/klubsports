import { redirect } from 'next/navigation';
import { getAdminSessionFromCookies } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function AdminRootPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
