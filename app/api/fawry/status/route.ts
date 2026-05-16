import { NextResponse } from 'next/server';
import { auth } from '@/infrastructure/auth/auth.config';
import { prisma } from '@/infrastructure/db/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
  }

  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { fawryPayment: { select: { fawryRefNumber: true, expiryAt: true, status: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.userId && session?.user?.id !== order.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    fawryRefNumber: order.fawryPayment?.fawryRefNumber,
    expiryAt: order.fawryPayment?.expiryAt,
  });
}
