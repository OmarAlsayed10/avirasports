'use server';

import { prisma } from '@/lib/prisma';
import { revalidateTag, revalidatePath } from 'next/cache';
import { adminOfferSchema, type AdminOfferInput } from '@/lib/validators/admin-offer';
import { redirect } from 'next/navigation';
import { requireAdmin } from './_require-admin';

export async function createOffer(data: AdminOfferInput) {
  await requireAdmin();

  const parsed = adminOfferSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { triggerProductIds, ...rest } = parsed.data;

  await prisma.offer.create({
    data: {
      ...rest,
      triggers: { create: triggerProductIds.map((productId) => ({ productId })) },
    },
  });

  revalidateTag('offers');
  revalidatePath('/admin/offers');
  redirect('/admin/offers');
}

export async function updateOffer(id: string, data: AdminOfferInput) {
  await requireAdmin();

  const parsed = adminOfferSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { triggerProductIds, ...rest } = parsed.data;

  await prisma.$transaction([
    prisma.offerTriggerProduct.deleteMany({ where: { offerId: id } }),
    prisma.offer.update({
      where: { id },
      data: {
        ...rest,
        triggers: { create: triggerProductIds.map((productId) => ({ productId })) },
      },
    }),
  ]);

  revalidateTag('offers');
  revalidatePath('/admin/offers');
  redirect('/admin/offers');
}

export async function deleteOffer(id: string) {
  await requireAdmin();
  await prisma.offer.delete({ where: { id } });
  revalidateTag('offers');
  revalidatePath('/admin/offers');
}

export async function toggleOfferStatus(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.offer.update({ where: { id }, data: { isActive } });
  revalidateTag('offers');
  revalidatePath('/admin/offers');
}
