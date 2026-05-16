import type { Metadata } from 'next';
import { FeedbackSection } from '@/modules/feedback/components/feedback-section';

export const metadata: Metadata = {
  title: 'Share Feedback — Avira Sports',
  description: 'Tell us what you love or what you\'d like to see. Your feedback helps us improve.',
};

export default function FeedbackPage() {
  return (
    <main>
      <FeedbackSection />
    </main>
  );
}
