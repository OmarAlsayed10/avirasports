import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyFawrySignature } from '@/lib/fawry/verify-callback';
import { fawryCallbackPayloadSchema } from '@/lib/validators/fawry';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`fawry-cb:${ip}`, 30, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = fawryCallbackPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid callback payload' }, { status: 400 });
  }

  const payload = parsed.data;
  const securityKey = process.env.FAWRY_SECURITY_KEY ?? '';

  const signatureValid = verifyFawrySignature(payload, securityKey);
  if (!signatureValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (payload.orderStatus !== 'PAID') {
    return NextResponse.json({ ok: true, note: 'Non-payment status received' });
  }

  const fawryPayment = await prisma.fawryPayment.findUnique({
    where: { merchantRefNum: payload.merchantRefNum },
    include: { order: { include: { items: true } } },
  });

  if (!fawryPayment) {
    return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
  }

  if (fawryPayment.status === 'PAID') {
    return NextResponse.json({ ok: true, note: 'Already processed (idempotent)' });
  }

  const expectedAmount = Number(fawryPayment.amountEgp);
  const receivedAmount = Number(payload.paymentAmount);
  if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
    console.error('[Fawry Callback] Amount mismatch', {
      merchantRefNum: payload.merchantRefNum,
      expected: expectedAmount,
      received: receivedAmount,
    });
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of fawryPayment.order.items) {
        if (item.productVariantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.productVariantId },
          });
          if (!variant || variant.stockCount < item.quantity) {
            throw new Error(`STOCK_UNAVAILABLE:${item.productId}`);
          }
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stockCount: { decrement: item.quantity } },
          });
        }
      }

      await tx.fawryPayment.update({
        where: { id: fawryPayment.id },
        data: {
          status: 'PAID',
          fawryRefNumber: payload.fawryRefNumber,
          callbackPayload: payload as object,
          callbackVerifiedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: fawryPayment.orderId },
        data: { status: 'paid', paidAt: new Date() },
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.startsWith('STOCK_UNAVAILABLE')) {
      await prisma.order.update({
        where: { id: fawryPayment.orderId },
        data: { status: 'cancelled', cancelledAt: new Date() },
      });
      return NextResponse.json({ ok: true, note: 'Order cancelled: stock unavailable after payment' });
    }
    console.error('[Fawry Callback] Unhandled error', { merchantRefNum: payload.merchantRefNum, err });
    throw err;
  }

  return NextResponse.json({ ok: true });
}
