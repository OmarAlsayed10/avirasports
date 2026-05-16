'use server';

import { auth } from '@/infrastructure/auth/auth.config';
import { prisma } from '@/infrastructure/db/prisma';
import { z } from 'zod';
import type { ActionResult } from '@/modules/_shared/types/action-result.type';

const productIdSchema = z.string().cuid();

export async function addToWishlist(
  productId: string
): Promise<ActionResult<{ added: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Please log in to save items', code: 'UNAUTH' };
  }

  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid product ID', code: 'VALIDATION' };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) return { ok: true, data: { added: false } };

  await prisma.wishlistItem.create({
    data: { userId: session.user.id, productId },
  });

  return { ok: true, data: { added: true } };
}

export async function removeFromWishlist(
  productId: string
): Promise<ActionResult<{ removed: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Please log in', code: 'UNAUTH' };
  }

  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid product ID', code: 'VALIDATION' };
  }

  const deleted = await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  return { ok: true, data: { removed: deleted.count > 0 } };
}
