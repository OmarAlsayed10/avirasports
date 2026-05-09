import { describe, it, expect } from 'vitest';
import { buildMerchantRefNum } from '@/lib/fawry/reference';

describe('buildMerchantRefNum', () => {
  it('generates format INZ-YYYY-MM-NNNNNN', () => {
    const ref = buildMerchantRefNum(1);
    expect(ref).toMatch(/^INZ-\d{4}-\d{2}-\d{6}$/);
  });

  it('pads order count with leading zeros', () => {
    const ref = buildMerchantRefNum(42);
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    expect(ref).toBe(`INZ-${year}-${month}-000042`);
  });

  it('generates unique references for different order counts', () => {
    const refs = new Set(Array.from({ length: 100 }, (_, i) => buildMerchantRefNum(i + 1)));
    expect(refs.size).toBe(100);
  });

  it('uses current year', () => {
    const ref = buildMerchantRefNum(1);
    const year = new Date().getUTCFullYear();
    expect(ref).toContain(String(year));
  });
});
