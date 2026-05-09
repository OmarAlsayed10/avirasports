export function buildMerchantRefNum(orderCount: number): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const seq = String(orderCount).padStart(6, '0');
  return `INZ-${year}-${month}-${seq}`;
}

import { createHash } from 'crypto';

export function buildChargeSignature(
  merchantCode: string,
  merchantRefNum: string,
  customerProfileId: string,
  paymentMethod: string,
  amount: number,
  securityKey: string
): string {
  const data = [
    merchantCode,
    merchantRefNum,
    customerProfileId,
    paymentMethod,
    amount.toFixed(2),
    securityKey,
  ].join('');
  return createHash('sha256').update(data).digest('hex');
}
