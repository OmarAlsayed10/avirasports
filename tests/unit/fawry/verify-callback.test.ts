import { describe, it, expect } from 'vitest';
import { verifyFawrySignature } from '@/lib/fawry/verify-callback';

describe('verifyFawrySignature', () => {
  const validPayload = {
    fawryRefNumber: 'FAW123456',
    merchantRefNum: 'INZ-2026-000001',
    paymentAmount: '1499.00',
    orderAmount: '1499.00',
    orderStatus: 'PAID' as const,
    paymentMethod: 'PAYATFAWRY',
    messageSignature: '',
  };

  const securityKey = 'test-security-key-abc123';

  it('accepts a valid signature', async () => {
    const { createHash } = await import('crypto');
    const expected = createHash('sha256')
      .update(
        `${validPayload.fawryRefNumber}${validPayload.merchantRefNum}${Number(validPayload.paymentAmount).toFixed(2)}${Number(validPayload.orderAmount).toFixed(2)}${validPayload.orderStatus}${validPayload.paymentMethod}${securityKey}`
      )
      .digest('hex');

    const result = verifyFawrySignature({ ...validPayload, messageSignature: expected }, securityKey);
    expect(result).toBe(true);
  });

  it('rejects a tampered signature', () => {
    const result = verifyFawrySignature(
      { ...validPayload, messageSignature: 'deadbeef0000' },
      securityKey
    );
    expect(result).toBe(false);
  });

  it('rejects empty signature', () => {
    const result = verifyFawrySignature({ ...validPayload, messageSignature: '' }, securityKey);
    expect(result).toBe(false);
  });
});
