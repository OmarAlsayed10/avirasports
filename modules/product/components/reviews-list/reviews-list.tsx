import Image from 'next/image';
import { StarRating } from '@/modules/_shared/ui/star-rating';
import { getT } from '@/modules/_shared/i18n/locale';
import { reviewsListTokens } from './reviews-list.tokens';
import type { ReviewsListProps } from './reviews-list.types';

export function ReviewsList({ reviews }: ReviewsListProps) {
  const { locale, t } = getT();
  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-EG';

  if (reviews.length === 0) {
    return (
      <p className={reviewsListTokens.emptyMsg}>
        {t.product.noReviews}
      </p>
    );
  }

  return (
    <div className={reviewsListTokens.list}>
      {reviews.map((review) => (
        <div key={review.id} className={reviewsListTokens.listItem}>
          <div className={reviewsListTokens.listMeta}>
            <div className={reviewsListTokens.avatarWrapper}>
              {review.user.image ? (
                <Image src={review.user.image} alt={review.user.name} fill className="object-cover" sizes="36px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-text-primary">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className={reviewsListTokens.reviewerName}>{review.user.name}</p>
              <StarRating rating={review.rating} size="md" />
            </div>
            <time
              className={reviewsListTokens.reviewDate}
              dateTime={review.createdAt.toISOString()}
            >
              {review.createdAt.toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })}
            </time>
          </div>
          {review.title && (
            <p className={reviewsListTokens.reviewTitle}>{review.title}</p>
          )}
          <p className={reviewsListTokens.reviewBody}>{review.body}</p>
        </div>
      ))}
    </div>
  );
}
