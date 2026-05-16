import { auth } from '@/infrastructure/auth/auth.config';
import { redirect } from 'next/navigation';

export default async function PostLoginRedirect() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role === 'ADMIN') {
    redirect('/admin');
  }

  redirect('/account');
}
