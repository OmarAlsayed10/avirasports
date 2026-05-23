import { Star } from 'lucide-react';
import { starRatingTokens as tk } from './star-rating.tokens';
import type { StarRatingProps } from './star-rating.types';

export function StarRating({ rating, count, size = 'sm' }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;
  const sizeClass = size === 'md' ? tk.sizeMd : tk.sizeSm;

  return (
    <div className={tk.wrapper} aria-label={`${rating} out of 5 stars`}>
      <div className={tk.stars} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rounded ? tk.starActive : tk.starInactive}`}
          />
        ))}
      </div>
      {count !== undefined && count > 0 && (
        <span className={tk.count}>({count})</span>
      )}
    </div>
  );
}
