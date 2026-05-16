import Image from 'next/image';
import { StarRating } from '@/modules/_shared/ui/star-rating';
import { getT } from '@/modules/_shared/i18n/locale';
import { productTokens } from '../product.tokens';

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
  user: { name: string; image: string | null };
};

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const { locale, t } = getT();
  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-EG';

  if (reviews.length === 0) {
    return (
      <p className={productTokens.review.emptyMsg}>
        {t.product.noReviews}
      </p>
    );
  }

  return (
    <div className={productTokens.review.list}>
      {reviews.map((review) => (
        <div key={review.id} className={productTokens.review.listItem}>
          <div className={productTokens.review.listMeta}>
            <div className={productTokens.review.avatarWrapper}>
              {review.user.image ? (
                <Image src={review.user.image} alt={review.user.name} fill className="object-cover" sizes="36px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-text-primary">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className={productTokens.review.reviewerName}>{review.user.name}</p>
              <StarRating rating={review.rating} size="md" />
            </div>
            <time
              className={productTokens.review.reviewDate}
              dateTime={review.createdAt.toISOString()}
            >
              {review.createdAt.toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })}
            </time>
          </div>
          {review.title && (
            <p className={productTokens.review.reviewTitle}>{review.title}</p>
          )}
          <p className={productTokens.review.reviewBody}>{review.body}</p>
        </div>
      ))}
    </div>
  );
}
