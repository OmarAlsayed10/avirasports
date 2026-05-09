import { createHash, timingSafeEqual } from 'crypto';
import type { FawryCallbackPayload } from '@/lib/validators/fawry';

export function verifyFawrySignature(
  payload: FawryCallbackPayload,
  securityKey: string
): boolean {
  try {
    const paymentAmount = Number(payload.paymentAmount).toFixed(2);
    const orderAmount = Number(payload.orderAmount).toFixed(2);

    const data = [
      payload.fawryRefNumber,
      payload.merchantRefNum,
      paymentAmount,
      orderAmount,
      payload.orderStatus,
      payload.paymentMethod,
      securityKey,
    ].join('');

    const expected = createHash('sha256').update(data).digest('hex');
    const provided = payload.messageSignature;

    if (expected.length !== provided.length) return false;

    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(provided, 'hex'));
  } catch {
    return false;
  }
}
