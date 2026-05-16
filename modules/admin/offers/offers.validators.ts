import { z } from 'zod';

export const adminOfferSchema = z
  .object({
    isActive: z.boolean().default(true),
    rewardType: z.enum(['GIFT', 'PERCENT_OFF']),
    discountPercent: z.number().int().min(1).max(99).nullable().optional(),
    rewardProductId: z.string().min(1, 'Reward product is required'),
    triggerProductIds: z.array(z.string().min(1)).min(1, 'At least one trigger product is required'),
  })
  .refine(
    (data) =>
      data.rewardType !== 'PERCENT_OFF' ||
      (data.discountPercent != null && data.discountPercent > 0),
    { message: 'Discount percent required for PERCENT_OFF offers', path: ['discountPercent'] }
  );

export type AdminOfferInput = z.infer<typeof adminOfferSchema>;
