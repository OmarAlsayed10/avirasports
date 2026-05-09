import { describe, it, expect } from 'vitest';
import { productFiltersSchema } from '@/lib/validators/product';

describe('productFiltersSchema', () => {
  it('returns defaults when no input provided', () => {
    const result = productFiltersSchema.parse({});
    expect(result.sort).toBe('featured');
    expect(result.page).toBe(1);
    expect(result.limit).toBe(24);
  });

  it('coerces string number params', () => {
    const result = productFiltersSchema.parse({ priceMin: '500', priceMax: '5000', page: '2' });
    expect(result.priceMin).toBe(500);
    expect(result.priceMax).toBe(5000);
    expect(result.page).toBe(2);
  });

  it('coerces inStockOnly boolean', () => {
    const result = productFiltersSchema.parse({ inStockOnly: 'true' });
    expect(result.inStockOnly).toBe(true);
  });

  it('accepts valid category slug', () => {
    const result = productFiltersSchema.parse({ category: 'air-fryers' });
    expect(result.category).toBe('air-fryers');
  });

  it('rejects invalid sort value', () => {
    const result = productFiltersSchema.safeParse({ sort: 'invalid-sort' });
    expect(result.success).toBe(false);
  });

  it('rejects negative priceMin', () => {
    const result = productFiltersSchema.safeParse({ priceMin: '-100' });
    expect(result.success).toBe(false);
  });

  it('rejects rating outside 1-5', () => {
    const outOfRange = productFiltersSchema.safeParse({ rating: '6' });
    expect(outOfRange.success).toBe(false);
  });

  it('accepts all valid sort options', () => {
    const sorts = ['featured', 'price_asc', 'price_desc', 'newest', 'rating'];
    for (const sort of sorts) {
      const result = productFiltersSchema.safeParse({ sort });
      expect(result.success).toBe(true);
    }
  });
});
