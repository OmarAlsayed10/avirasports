import { Tag } from 'lucide-react';
import type { Locale } from '@/modules/_shared/i18n/locale';
import { productTokens } from '../product.tokens';

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

  return (
    <div className={productTokens.quantityOffer.banner.root}>
      <div className={productTokens.quantityOffer.banner.header}>
        <Tag className={productTokens.quantityOffer.banner.icon} />
        <h3 className={productTokens.quantityOffer.banner.title}>
          {locale === 'ar' ? 'عروض خاصة على الكمية' : 'Quantity Offers'}
        </h3>
      </div>
      <div className={productTokens.quantityOffer.banner.list}>
        {offers.map((offer) => {
          const normalTotal = basePrice * offer.quantity;
          const savings = normalTotal - offer.offerPriceEgp;
          return (
            <div key={offer.id} className={productTokens.quantityOffer.banner.row}>
              <span className={productTokens.quantityOffer.banner.label}>
                {locale === 'ar'
                  ? `اشترِ ${offer.quantity} قطع`
                  : `Buy ${offer.quantity} items`}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={productTokens.quantityOffer.banner.price}>
                  {locale === 'ar'
                    ? `${offer.offerPriceEgp.toLocaleString('ar-EG')} ج.م`
                    : `EGP ${offer.offerPriceEgp.toLocaleString()}`}
                </span>
                {savings > 0 && (
                  <span className={productTokens.quantityOffer.banner.savings}>
                    {locale === 'ar'
                      ? `وفّر ${savings.toLocaleString('ar-EG')} ج.م`
                      : `save EGP ${savings.toLocaleString()}`}
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
