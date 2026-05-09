import { z } from 'zod';

export const newsletterEmailSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().max(255),
});

export type NewsletterEmailInput = z.infer<typeof newsletterEmailSchema>;
