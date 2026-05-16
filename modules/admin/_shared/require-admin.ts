'use server';

import { auth } from '@/infrastructure/auth/auth.config';

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');
}
