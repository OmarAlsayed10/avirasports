import type { Locale } from '@/modules/_shared/i18n/locale';

export interface QuantityOffer {
  id: string;
  quantity: number;
  offerPriceEgp: number;
  popupIntervalMinutes: number;
}

export interface QuantityOfferPopupProps {
  offers: QuantityOffer[];
  productId: string;
  productName: string;
  basePrice: number;
  locale: Locale;
}
