import type { Locale } from '@/modules/_shared/i18n/locale';

export interface QuantityOfferBannerItem {
  id: string;
  quantity: number;
  offerPriceEgp: number;
}

export interface QuantityOffersBannerProps {
  offers: QuantityOfferBannerItem[];
  basePrice: number;
  locale: Locale;
}
