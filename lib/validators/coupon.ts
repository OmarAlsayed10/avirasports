import { z } from 'zod';

export const couponCodeSchema = z.object({
  code: z.string().min(1).max(50).toUpperCase(),
  subtotalEgp: z.number().positive(),
});

export type CouponCodeInput = z.infer<typeof couponCodeSchema>;
