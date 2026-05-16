import { getT } from '@/modules/_shared/i18n/locale';
import { FeedbackForm } from './feedback-form';
import { feedbackTokens as tk } from '../feedback.tokens';

export function FeedbackSection() {
  const { t } = getT();
  return (
    <section className={tk.section} aria-labelledby="feedback-heading">
      <div className={tk.inner}>
        <h2 id="feedback-heading" className={tk.heading}>
          {t.feedback.heading}
        </h2>
        <p className={tk.sub}>{t.feedback.sub}</p>
        <FeedbackForm />
      </div>
    </section>
  );
}
