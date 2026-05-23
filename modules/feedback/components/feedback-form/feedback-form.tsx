'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { feedbackFormTokens as tk } from './feedback-form.tokens';

export function FeedbackForm() {
  const { t } = useLocale();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<{ rating?: string; message?: string }>({});

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (rating === 0) errors.rating = t.feedback.ratingError;
    if (message.trim().length < 10) errors.message = t.feedback.messageError;
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus('loading');

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, message: message.trim(), name: name.trim() || undefined, email: email.trim() || undefined }),
    });

    setStatus(res.ok ? 'success' : 'error');
  };

  if (status === 'success') {
    return (
      <div className={tk.successWrapper}>
        <p className={tk.successMsg}>{t.feedback.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={tk.form} noValidate>
      <div>
        <p className={tk.ratingLabel}>{t.feedback.ratingLabel}</p>
        <div className={tk.starsRow} role="group" aria-label={t.feedback.ratingLabel}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              aria-label={`${s} star${s !== 1 ? 's' : ''}`}
              className={tk.star.base}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  s <= (hovered || rating) ? tk.star.active : tk.star.inactive
                }`}
                fill={s <= (hovered || rating) ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
        {fieldErrors.rating && <p className={tk.errorMsg}>{fieldErrors.rating}</p>}
      </div>

      <div className={tk.grid}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.feedback.namePlaceholder}
          maxLength={100}
          className={tk.field}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.feedback.emailPlaceholder}
          className={tk.field}
        />
      </div>

      <div>
        <label className="sr-only">{t.feedback.messageLabel}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.feedback.messagePlaceholder}
          rows={4}
          maxLength={1000}
          className={tk.textarea}
        />
        {fieldErrors.message && <p className={tk.errorMsg}>{fieldErrors.message}</p>}
      </div>

      {status === 'error' && <p className={tk.errorMsg}>{t.feedback.error}</p>}

      <button type="submit" disabled={status === 'loading'} className={tk.submitBtn}>
        {status === 'loading' ? t.feedback.submitting : t.feedback.submitButton}
      </button>
    </form>
  );
}
