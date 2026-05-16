import { auth } from '@/infrastructure/auth/auth.config';
import { prisma } from '@/infrastructure/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  return NextResponse.json({ hasPassword: !!user?.passwordHash });
}
