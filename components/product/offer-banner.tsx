import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { ProductOffer } from '@/lib/queries/offers';
import type { Locale } from '@/lib/locale';

function offerMessage(offer: ProductOffer, locale: Locale): React.ReactNode {
  const rewardName =
    locale === 'ar' && offer.rewardProduct.nameAr
      ? offer.rewardProduct.nameAr
      : offer.rewardProduct.name;

  const rewardLink = (
    <Link
      href={`/product/${offer.rewardProduct.slug}`}
      className="font-semibold underline underline-offset-2 hover:text-primary transition-colors"
    >
      {rewardName}
    </Link>
  );

  if (offer.rewardType === 'GIFT') {
    return (
      <>
        {locale === 'ar' ? 'اشترِ واحصل على ' : 'Buy and get '}
        {rewardLink}
        {locale === 'ar' ? ' كهدية مجانية!' : ' as a free gift!'}
      </>
    );
  }

  return (
    <>
      {locale === 'ar' ? 'اشترِ واحصل على خصم ' : 'Buy and get '}
      <span className="font-semibold">{offer.discountPercent}%</span>
      {locale === 'ar' ? ' على ' : ' off '}
      {rewardLink}
      {'!'}
    </>
  );
}

interface OfferBannerProps {
  offers: ProductOffer[];
  locale: Locale;
}

export function OfferBanner({ offers, locale }: OfferBannerProps) {
  if (offers.length === 0) return null;

  return (
    <div className="space-y-2">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-text-primary"
        >
          <Tag className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <span>{offerMessage(offer, locale)}</span>
        </div>
      ))}
    </div>
  );
}
