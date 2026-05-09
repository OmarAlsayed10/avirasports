import { z } from 'zod';
import { egyptianPhoneSchema } from './phone';

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().max(255),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2).max(80).trim(),
    email: z.string().email().toLowerCase().max(255),
    phone: egyptianPhoneSchema,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-zA-Z]/, 'Password must include a letter')
      .regex(/[0-9]/, 'Password must include a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
