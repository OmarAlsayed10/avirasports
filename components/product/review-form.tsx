'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2 } from 'lucide-react';
import { createReview } from '@/lib/server-actions/reviews';
import { useLocale } from '@/lib/i18n/context';

interface ReviewFormProps {
  productId: string;
}

const inputCls =
  'w-full px-3 py-2 border border-border-primary/30 rounded-lg text-sm text-text-primary bg-bg-white dark:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors';

export function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(t.product.selectRating);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createReview({
        productId,
        rating,
        title: title.trim() || undefined,
        body,
      });
      if (result.ok) {
        setSubmitted(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  if (submitted) {
    return (
      <div className="mb-6 p-4 bg-success/10 rounded-lg text-sm text-success font-medium">
        {t.product.reviewSubmitted}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-5 border border-border-primary/20 rounded-xl space-y-4 bg-bg-white dark:bg-bg-surface"
    >
      <h3 className="text-base font-semibold text-text-primary">{t.product.writeReview}</h3>

      {/* Star rating picker */}
      <div>
        <p className="text-sm text-text-secondary mb-2">{t.product.yourRating}</p>
        <div className="flex gap-1" role="radiogroup" aria-label={t.product.yourRating}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              aria-label={`${s} star${s !== 1 ? 's' : ''}`}
              aria-pressed={rating === s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= (hovered || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-text-secondary mb-1">{t.product.reviewTitleLabel}</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder={t.product.reviewTitlePlaceholder}
          className={inputCls}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm text-text-secondary mb-1">{t.product.reviewBodyLabel}</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={20}
          maxLength={2000}
          rows={4}
          placeholder={t.product.reviewBodyPlaceholder}
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-text-secondary mt-1 text-right">{body.length} / 2000</p>
      </div>

      {error && <p className="text-sm text-sale font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isPending || body.length < 20 || rating === 0}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-btn text-white text-sm font-medium rounded-lg hover:bg-primary-btn/90 disabled:opacity-50 transition-colors"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? t.product.submitting : t.product.submitReview}
      </button>
    </form>
  );
}
