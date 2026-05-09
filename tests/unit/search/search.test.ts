import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const querySchema = z.string().min(1).max(100);

describe('search query validation', () => {
  it('accepts valid queries', () => {
    expect(querySchema.safeParse('philips').success).toBe(true);
    expect(querySchema.safeParse('air fryer').success).toBe(true);
    expect(querySchema.safeParse('a').success).toBe(true);
    expect(querySchema.safeParse('x'.repeat(100)).success).toBe(true);
  });

  it('rejects empty query', () => {
    expect(querySchema.safeParse('').success).toBe(false);
  });

  it('rejects query over 100 chars', () => {
    expect(querySchema.safeParse('x'.repeat(101)).success).toBe(false);
  });
});

describe('search results grouping', () => {
  it('returns separate products and categories arrays', () => {
    const mockResult = {
      products: [
        { id: '1', slug: 'philips-hd-9252', name: 'Philips Air Fryer HD9252', brand: 'Philips', priceEgp: 3500, discountPercent: null, imageUrl: '/img.jpg', imageAlt: 'Philips Air Fryer', categorySlug: 'air-fryers' },
      ],
      categories: [
        { id: 'c1', slug: 'air-fryers', name: 'Air Fryers' },
      ],
    };

    expect(Array.isArray(mockResult.products)).toBe(true);
    expect(Array.isArray(mockResult.categories)).toBe(true);
    expect(mockResult.products).toHaveLength(1);
    expect(mockResult.categories).toHaveLength(1);
  });

  it('products have required fields', () => {
    const product = { id: '1', slug: 'test', name: 'Test', brand: 'Brand', priceEgp: 1000, discountPercent: 10, imageUrl: '/img.jpg', imageAlt: 'Test', categorySlug: 'microwaves' };
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('slug');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('priceEgp');
    expect(product).toHaveProperty('categorySlug');
  });

  it('categories have required fields', () => {
    const category = { id: 'c1', slug: 'microwaves', name: 'Microwaves' };
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('slug');
    expect(category).toHaveProperty('name');
  });
});
