import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const expiredOrders = await prisma.order.findMany({
    where: { status: 'pending_payment', createdAt: { lt: cutoff } },
    select: { id: true, fawryPayment: { select: { id: true } } },
  });

  if (expiredOrders.length === 0) {
    return NextResponse.json({ ok: true, expiredCount: 0 });
  }

  await prisma.$transaction(
    expiredOrders.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'cancelled', cancelledAt: new Date() },
      })
    )
  );

  const withPayment = expiredOrders.filter(
    (o): o is typeof o & { fawryPayment: NonNullable<typeof o.fawryPayment> } =>
      o.fawryPayment !== null,
  );
  if (withPayment.length > 0) {
    await prisma.$transaction(
      withPayment.map((order) =>
        prisma.fawryPayment.update({
          where: { id: order.fawryPayment.id },
          data: { status: 'EXPIRED' },
        })
      )
    );
  }

  return NextResponse.json({ ok: true, expiredCount: expiredOrders.length });
}
