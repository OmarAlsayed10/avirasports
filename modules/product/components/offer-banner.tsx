import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { ProductOffer } from '@/modules/admin/offers/offers.queries';
import type { Locale } from '@/modules/_shared/i18n/locale';
import { productTokens } from '../product.tokens';

function offerMessage(offer: ProductOffer, locale: Locale): React.ReactNode {
  const rewardName =
    locale === 'ar' && offer.rewardProduct.nameAr
      ? offer.rewardProduct.nameAr
      : offer.rewardProduct.name;

  const rewardLink = (
    <Link
      href={`/product/${offer.rewardProduct.slug}`}
      className={productTokens.offerBanner.rewardLink}
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
    <div className={productTokens.offerBanner.root}>
      {offers.map((offer) => (
        <div key={offer.id} className={productTokens.offerBanner.item}>
          <Tag className={productTokens.offerBanner.icon} />
          <span>{offerMessage(offer, locale)}</span>
        </div>
      ))}
    </div>
  );
}
