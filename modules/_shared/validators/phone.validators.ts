import { z } from 'zod';

export const egyptianPhoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, '').replace(/^\+20/, '0').replace(/^0020/, '0'))
  .refine((v) => /^01[0125][0-9]{8}$/.test(v), 'Invalid Egyptian mobile number');
