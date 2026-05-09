import { describe, it, expect } from 'vitest';
import { quantitySchema } from '@/lib/validators/product';

describe('quantity validation', () => {
  it('accepts values from 1 to 99', () => {
    expect(quantitySchema.safeParse(1).success).toBe(true);
    expect(quantitySchema.safeParse(50).success).toBe(true);
    expect(quantitySchema.safeParse(99).success).toBe(true);
  });

  it('rejects 0', () => {
    expect(quantitySchema.safeParse(0).success).toBe(false);
  });

  it('rejects values above 99', () => {
    expect(quantitySchema.safeParse(100).success).toBe(false);
  });

  it('rejects non-integer', () => {
    expect(quantitySchema.safeParse(1.5).success).toBe(false);
  });

  it('rejects negative', () => {
    expect(quantitySchema.safeParse(-1).success).toBe(false);
  });
});
