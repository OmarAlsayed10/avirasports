import type { ProductOffer } from '@/modules/admin/offers/offers.queries';
import type { Locale } from '@/modules/_shared/i18n/locale';

export interface OfferBannerProps {
  offers: ProductOffer[];
  locale: Locale;
}
