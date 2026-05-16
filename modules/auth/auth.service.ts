'use server';

import { headers } from 'next/headers';
import { prisma } from '@/infrastructure/db/prisma';
import { registerSchema } from '@/modules/auth/auth.validators';
import bcrypt from 'bcryptjs';
import { signIn } from '@/infrastructure/auth/auth.config';
import { rateLimit } from '@/infrastructure/rate-limit/limiter';
import type { ActionResult } from '@/modules/_shared/types/action-result.type';

export async function registerUser(rawInput: unknown): Promise<ActionResult> {
  const ip = headers().get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return { ok: false, error: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' };
  }

  const parsed = registerSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join('; '),
      code: 'VALIDATION',
    };
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: 'An account with this email already exists', code: 'CONFLICT' };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, phone, passwordHash },
  });

  await signIn('credentials', { email, password, redirect: false });

  return { ok: true };
}
