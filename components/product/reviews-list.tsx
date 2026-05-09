import Image from 'next/image';
import { StarRating } from '@/components/shared/star-rating';
import { getT } from '@/lib/locale';

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
      <p className="text-nav-sm text-text-secondary py-8 text-center">
        {t.product.noReviews}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border-primary/10 pb-6 last:border-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-bg-page flex-shrink-0">
              {review.user.image ? (
                <Image src={review.user.image} alt={review.user.name} fill className="object-cover" sizes="36px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-text-primary">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-nav-sm font-semibold text-text-primary">{review.user.name}</p>
              <StarRating rating={review.rating} size="md" />
            </div>
            <time
              className="ml-auto text-xs text-text-secondary"
              dateTime={review.createdAt.toISOString()}
            >
              {review.createdAt.toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })}
            </time>
          </div>
          {review.title && (
            <p className="text-nav-sm font-semibold text-text-primary mb-1">{review.title}</p>
          )}
          <p className="text-nav-sm text-text-body leading-relaxed">{review.body}</p>
        </div>
      ))}
    </div>
  );
}
