import { NextResponse } from 'next/server';
import { feedbackSchema } from '@/modules/feedback/feedback.validators';
import { sendFeedbackEmail } from '@/infrastructure/email/mailer';
import { rateLimit, getClientIp } from '@/infrastructure/rate-limit/limiter';
import { RATE_LIMITS } from '@/infrastructure/rate-limit/limits.constants';

const WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`feedback:${ip}`, RATE_LIMITS.feedback.requests, WINDOW_MS);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  try {
    await sendFeedbackEmail(parsed.data);
  } catch {
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
