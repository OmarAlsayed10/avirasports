import { describe, it, expect } from 'vitest';
import { productFiltersSchema } from '@/lib/validators/product';

const VALID_SORT_VALUES = ['featured', 'price_asc', 'price_desc', 'newest', 'rating'] as const;

describe('sort options', () => {
  it('has exactly 5 valid sort values', () => {
    expect(VALID_SORT_VALUES).toHaveLength(5);
  });

  for (const sort of VALID_SORT_VALUES) {
    it(`accepts sort="${sort}"`, () => {
      const result = productFiltersSchema.safeParse({ sort });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.sort).toBe(sort);
    });
  }

  it('rejects unknown sort values', () => {
    const unknowns = ['asc', 'desc', 'cheap', 'popular', ''];
    for (const sort of unknowns) {
      const result = productFiltersSchema.safeParse({ sort });
      expect(result.success).toBe(false);
    }
  });

  it('defaults to "featured" when sort is omitted', () => {
    const result = productFiltersSchema.parse({});
    expect(result.sort).toBe('featured');
  });
});
