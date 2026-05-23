import type { Locale } from '@/modules/_shared/i18n/locale';
import type { SpecRow } from '@/modules/product/product.validators';

export interface ProductSpecsProps {
  specs: SpecRow[];
  locale?: Locale;
}
