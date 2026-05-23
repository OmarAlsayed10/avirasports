import { Tag } from 'lucide-react';
import { tr } from '@/modules/_shared/i18n/i18n.translations';
import { quantityOffersBannerTokens } from './quantity-offers-banner.tokens';
import type { QuantityOffersBannerProps } from './quantity-offers-banner.types';

export function QuantityOffersBanner({ offers, basePrice, locale }: QuantityOffersBannerProps) {
  if (offers.length === 0) return null;

  const t = tr(locale).product;
  const numLocale = locale === 'ar' ? 'ar-EG' : undefined;

  return (
    <div className={quantityOffersBannerTokens.root}>
      <div className={quantityOffersBannerTokens.header}>
        <Tag className={quantityOffersBannerTokens.icon} />
        <h3 className={quantityOffersBannerTokens.title}>
          {t.quantityOffersBannerTitle}
        </h3>
      </div>
      <div className={quantityOffersBannerTokens.list}>
        {offers.map((offer) => {
          const normalTotal = basePrice * offer.quantity;
          const savings = normalTotal - offer.offerPriceEgp;
          return (
            <div key={offer.id} className={quantityOffersBannerTokens.row}>
              <span className={quantityOffersBannerTokens.label}>
                {t.buyNItems(offer.quantity)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={quantityOffersBannerTokens.price}>
                  {t.offerPrice(offer.offerPriceEgp.toLocaleString(numLocale))}
                </span>
                {savings > 0 && (
                  <span className={quantityOffersBannerTokens.savings}>
                    {t.saveAmount(savings.toLocaleString(numLocale))}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
