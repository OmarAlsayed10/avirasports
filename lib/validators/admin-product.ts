import { z } from 'zod';

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
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
