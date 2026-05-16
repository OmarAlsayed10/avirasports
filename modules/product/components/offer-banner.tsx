import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { ProductOffer } from '@/modules/admin/offers/offers.queries';
import type { Locale } from '@/modules/_shared/i18n/locale';
import { productTokens } from '../product.tokens';
import { tr } from '@/modules/_shared/i18n/i18n.translations';

function offerMessage(offer: ProductOffer, locale: Locale): React.ReactNode {
  const t = tr(locale).product;
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
        {t.offerBuyGetGiftPre}
        {rewardLink}
        {t.offerBuyGetGiftPost}
      </>
    );
  }

  return (
    <>
      {t.offerBuyGetDiscountPre}
      <span className="font-semibold">{offer.discountPercent}%</span>
      {t.offerBuyGetDiscountMid}
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
