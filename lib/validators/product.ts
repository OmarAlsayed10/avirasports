import { z } from 'zod';

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  inStockOnly: z.coerce.boolean().optional(),
  onSale: z.coerce.boolean().optional(),
  sort: z
    .enum(['featured', 'price_asc', 'price_desc', 'newest', 'rating'])
    .optional()
    .default('featured'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(24),
});

export const quantitySchema = z.number().int().min(1).max(99);

export type ProductFilters = z.infer<typeof productFiltersSchema>;
