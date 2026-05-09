import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterEmailSchema } from '@/lib/validators/newsletter';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = newsletterEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  await prisma.newsletterSubscription.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email },
  });

  return NextResponse.json({ ok: true });
}
