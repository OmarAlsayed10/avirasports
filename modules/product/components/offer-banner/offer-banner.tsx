import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { ProductOffer } from '@/modules/admin/offers/offers.queries';
import type { Locale } from '@/modules/_shared/i18n/locale';
import { tr } from '@/modules/_shared/i18n/i18n.translations';
import { offerBannerTokens } from './offer-banner.tokens';
import type { OfferBannerProps } from './offer-banner.types';

function offerMessage(offer: ProductOffer, locale: Locale): React.ReactNode {
  const t = tr(locale).product;
  const rewardName =
    locale === 'ar' && offer.rewardProduct.nameAr
      ? offer.rewardProduct.nameAr
      : offer.rewardProduct.name;

  const rewardLink = (
    <Link
      href={`/product/${offer.rewardProduct.slug}`}
      className={offerBannerTokens.rewardLink}
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

export function OfferBanner({ offers, locale }: OfferBannerProps) {
  if (offers.length === 0) return null;

  return (
    <div className={offerBannerTokens.root}>
      {offers.map((offer) => (
        <div key={offer.id} className={offerBannerTokens.item}>
          <Tag className={offerBannerTokens.icon} />
          <span>{offerMessage(offer, locale)}</span>
        </div>
      ))}
    </div>
  );
}
