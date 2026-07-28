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

export const specRowSchema = z.object({
  key: z.string().min(1, 'Spec key is required'),
  keyAr: z.string().default(''),
  value: z.string(),
  valueAr: z.string().default(''),
});

export type SpecRow = z.infer<typeof specRowSchema>;

export const adminProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  gender: z.enum(['ALL', 'MALE', 'FEMALE', 'KIDS']).default('ALL'),
  modelNumber: z.string().optional().nullable(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  description: z.string().min(1, 'Description is required'),
  descriptionAr: z.string().optional(),
  specs: z.array(specRowSchema),
  categoryId: z.string().min(1, 'Category is required'),
  basePriceEgp: z.coerce.number().positive('Price must be positive'),
  discountPercent: z.coerce.number().int().min(0).max(99).optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHolidayOffer: z.boolean().default(false),
  hasReturnPolicy: z.boolean().default(true),
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().min(1, 'Image URL is required'),
      alt: z.string().default(''),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    })
  ),
  variants: z.array(
    z.object({
      id: z.string().optional(),
      sku: z.string().min(1, 'SKU is required'),
      attributes: z.record(z.string()).default({}),
      priceOverrideEgp: z.coerce.number().positive().optional().nullable(),
      stockCount: z.coerce.number().int().min(0).default(0),
      imageUrl: z.string().optional().nullable(),
    })
  ),
  quantityOffers: z.array(
    z.object({
      id: z.string().optional(),
      quantity: z.coerce.number().int().min(2, 'Min quantity is 2'),
      offerPriceEgp: z.coerce.number().positive('Price must be positive'),
      isActive: z.boolean().default(true),
      popupIntervalMinutes: z.coerce.number().int().min(1).max(120).default(10),
    })
  ).default([]),
  addOnOptions: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, 'Piece name is required'),
      nameAr: z.string().optional(),
      imageUrl: z.string().optional().nullable(),
      basePriceEgp: z.coerce.number().positive('Price must be positive'),
      sizes: z.array(z.string()).default([]),
      colors: z.array(z.string()).default([]),
    })
  ).default([]),
  sizeWeights: z.array(
    z.object({
      id: z.string().optional(),
      size: z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'], { required_error: 'Choose a size' }),
      minWeightKg: z.coerce.number().min(0).optional().nullable(),
      maxWeightKg: z.coerce.number().min(0).optional().nullable(),
    })
  ).default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
