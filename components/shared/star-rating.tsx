import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export function StarRating({ rating, count, size = 'sm' }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;
  const sizeClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rounded
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-xs text-text-secondary dark:text-text-footer-link">({count})</span>
      )}
    </div>
  );
}
