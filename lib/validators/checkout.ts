import { z } from 'zod';
import { GOVERNORATES } from '@/lib/constants/governorates';
import { egyptianPhoneSchema } from './phone';

export const shippingFormSchema = z.object({
  email: z.string().email().toLowerCase().max(255),
  fullName: z.string().min(2).max(80).trim(),
  phone: egyptianPhoneSchema,
  addressLine: z.string().min(5).max(200).trim(),
  city: z.string().min(2).max(80).trim(),
  governorate: z.enum(GOVERNORATES),
  postalCode: z.string().max(10).optional(),
});

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: z.number().int().min(1).max(100),
});

export const placeOrderSchema = z.object({
  contact: z.object({
    email: z.string().email().toLowerCase(),
    fullName: z.string().min(2).max(80).trim(),
    phone: egyptianPhoneSchema,
  }),
  shipping: z.object({
    addressLine: z.string().min(5).max(200).trim(),
    city: z.string().min(2).max(80).trim(),
    governorate: z.enum(GOVERNORATES),
    postalCode: z.string().max(10).optional(),
  }),
  couponCode: z.string().max(50).optional(),
  cartItems: z.array(cartItemSchema).min(1, 'Cart is empty'),
});

export type ShippingFormInput = z.infer<typeof shippingFormSchema>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
