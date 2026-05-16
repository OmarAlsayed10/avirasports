'use server';

import { headers } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { auth } from '@/infrastructure/auth/auth.config';
import { prisma } from '@/infrastructure/db/prisma';
import { rateLimit } from '@/infrastructure/rate-limit/limiter';
import { z } from 'zod';
import type { ActionResult } from '@/modules/_shared/types/action-result.type';

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(20, 'Review must be at least 20 characters').max(2000),
});

export async function createReview(rawInput: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'You must be signed in to leave a review', code: 'UNAUTHENTICATED' };
  }
  const userId = session.user.id;

  const ip = headers().get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const rl = rateLimit(`review:${ip}`, 3, 24 * 60 * 60 * 1000);
  if (!rl.allowed) {
    return { ok: false, error: 'Too many review submissions. Please try again later.', code: 'RATE_LIMITED' };
  }

  const parsed = reviewSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input', code: 'VALIDATION' };
  }

  const { productId, rating, title, body } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId, isActive: true }, select: { id: true } });
  if (!product) {
    return { ok: false, error: 'Product not found', code: 'NOT_FOUND' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: { productId, userId, rating, title: title || null, body },
      });

      const stats = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          ratingAvg: Math.round((stats._avg.rating ?? 0) * 10) / 10,
          reviewCount: stats._count.id,
        },
      });
    });

    revalidateTag('products');
    return { ok: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return { ok: false, error: 'You have already reviewed this product', code: 'CONFLICT' };
    }
    throw err;
  }
}
