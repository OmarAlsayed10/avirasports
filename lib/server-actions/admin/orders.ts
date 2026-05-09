'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { OrderStatus } from '@prisma/client';
import { requireAdmin } from './_require-admin';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}),
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
}
