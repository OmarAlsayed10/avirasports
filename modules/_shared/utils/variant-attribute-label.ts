import type { Translations } from '@/modules/_shared/i18n/i18n.translations';

export function variantAttributeLabel(key: string, t: Translations): string {
  switch (key.toLowerCase()) {
    case 'size':
      return t.product.size;
    case 'color':
      return t.product.color;
    case 'minweightkg':
      return t.product.minWeight;
    case 'maxweightkg':
      return t.product.maxWeight;
    default:
      return key;
  }
}
