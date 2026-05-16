import { z } from 'zod';

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10).max(1000),
  name: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
