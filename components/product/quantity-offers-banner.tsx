import { Tag } from 'lucide-react';
import type { Locale } from '@/lib/locale';

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
    <div className="rounded-xl border border-primary/25 bg-primary/5 dark:bg-white/5 dark:border-white/10 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-primary dark:text-white/70 shrink-0" />
        <h3 className="text-sm font-semibold text-text-primary dark:text-text-on-dark">
          {locale === 'ar' ? 'عروض خاصة على الكمية' : 'Quantity Offers'}
        </h3>
      </div>
      <div className="space-y-2.5">
        {offers.map((offer) => {
          const normalTotal = basePrice * offer.quantity;
          const savings = normalTotal - offer.offerPriceEgp;
          return (
            <div
              key={offer.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-text-body dark:text-text-on-dark/80">
                {locale === 'ar'
                  ? `اشترِ ${offer.quantity} قطع`
                  : `Buy ${offer.quantity} items`}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-primary dark:text-white">
                  {locale === 'ar'
                    ? `${offer.offerPriceEgp.toLocaleString('ar-EG')} ج.م`
                    : `EGP ${offer.offerPriceEgp.toLocaleString()}`}
                </span>
                {savings > 0 && (
                  <span className="text-xs font-medium text-sale">
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
