import { z } from 'zod';

export const fawryCallbackPayloadSchema = z.object({
  fawryRefNumber: z.string(),
  merchantRefNum: z.string(),
  paymentAmount: z.string(),
  orderAmount: z.string(),
  orderStatus: z.enum(['PAID', 'FAILED', 'EXPIRED', 'CANCELED', 'NEW']),
  paymentMethod: z.string(),
  messageSignature: z.string(),
});

export type FawryCallbackPayload = z.infer<typeof fawryCallbackPayloadSchema>;
