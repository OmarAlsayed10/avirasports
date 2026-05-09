import { z } from 'zod';
import { GOVERNORATES } from '@/lib/constants/governorates';
import { egyptianPhoneSchema } from './phone';

export const addressSchema = z.object({
  fullName: z.string().min(2).max(80).trim(),
  phone: egyptianPhoneSchema,
  addressLine: z.string().min(5).max(200).trim(),
  city: z.string().min(2).max(80).trim(),
  governorate: z.enum(GOVERNORATES),
  postalCode: z.string().max(10).optional(),
  isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
