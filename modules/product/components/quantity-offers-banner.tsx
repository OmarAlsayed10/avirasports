import { Tag } from 'lucide-react';
import type { Locale } from '@/modules/_shared/i18n/locale';
import { productTokens } from '../product.tokens';
import { tr } from '@/modules/_shared/i18n/i18n.translations';

interface QuantityOffer {
  id: string;
  quantity: number;
  offerPriceEgp: number;
}

interface QuantityOffersBannerProps {
  offers: QuantityOffer[];
  basePrice: number;
  locale: Locale;
}

export function QuantityOffersBanner({ offers, basePrice, locale }: QuantityOffersBannerProps) {
  if (offers.length === 0) return null;

  const t = tr(locale).product;
  const numLocale = locale === 'ar' ? 'ar-EG' : undefined;

  return (
    <div className={productTokens.quantityOffer.banner.root}>
      <div className={productTokens.quantityOffer.banner.header}>
        <Tag className={productTokens.quantityOffer.banner.icon} />
        <h3 className={productTokens.quantityOffer.banner.title}>
          {t.quantityOffersBannerTitle}
        </h3>
      </div>
      <div className={productTokens.quantityOffer.banner.list}>
        {offers.map((offer) => {
          const normalTotal = basePrice * offer.quantity;
          const savings = normalTotal - offer.offerPriceEgp;
          return (
            <div key={offer.id} className={productTokens.quantityOffer.banner.row}>
              <span className={productTokens.quantityOffer.banner.label}>
                {t.buyNItems(offer.quantity)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={productTokens.quantityOffer.banner.price}>
                  {t.offerPrice(offer.offerPriceEgp.toLocaleString(numLocale))}
                </span>
                {savings > 0 && (
                  <span className={productTokens.quantityOffer.banner.savings}>
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
