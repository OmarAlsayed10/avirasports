'use server';

import { randomBytes } from 'crypto';
import { headers } from 'next/headers';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import type { ActionResult } from '@/types/action-result';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const ip = headers().get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const rl = rateLimit(`pwd-reset-req:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return { ok: false, error: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Always return ok to prevent email enumeration — never reveal whether the address exists.
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, passwordHash: true },
  });

  if (user?.passwordHash) {
    // Delete any existing unused tokens for this user before creating a new one.
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(normalizedEmail, resetUrl).catch(() => null);
  }

  return { ok: true };
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResult> {
  const ip = headers().get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const rl = rateLimit(`pwd-reset-use:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    return { ok: false, error: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' };
  }

  if (!token || newPassword.length < 8) {
    return { ok: false, error: 'Invalid request.', code: 'VALIDATION' };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!record) {
    return { ok: false, error: 'This reset link is invalid.', code: 'INVALID_TOKEN' };
  }
  if (record.usedAt) {
    return { ok: false, error: 'This reset link has already been used.', code: 'TOKEN_USED' };
  }
  if (record.expiresAt < new Date()) {
    return { ok: false, error: 'This reset link has expired. Please request a new one.', code: 'TOKEN_EXPIRED' };
  }

  const passwordHash = await hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.user.id },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
}
