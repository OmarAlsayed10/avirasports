import { prisma } from '@/lib/prisma';

export async function getOrder(orderId: string, userId?: string) {
  return prisma.order.findUnique({
    where: { id: orderId, ...(userId ? { userId } : {}) },
    include: {
      items: true,
      fawryPayment: true,
    },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      fawryPayment: true,
    },
  });
}

export async function getOrderHistory(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: { take: 3 }, fawryPayment: { select: { fawryRefNumber: true, expiryAt: true, status: true } } },
  });
}
