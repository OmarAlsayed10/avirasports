'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { newsletterEmailSchema } from '@/lib/validators/newsletter';
import { rateLimit } from '@/lib/rate-limit';

type ActionResult = { ok: true; isNew: boolean } | { ok: false; error: string; code?: string };

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  const ip = headers().get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const rl = rateLimit(`newsletter:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return { ok: false, error: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' };
  }

  const parsed = newsletterEmailSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid email address', code: 'VALIDATION' };
  }

  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (!existing) {
    await prisma.newsletterSubscription.create({ data: { email: parsed.data.email } });
  }

  return { ok: true, isNew: !existing };
}
