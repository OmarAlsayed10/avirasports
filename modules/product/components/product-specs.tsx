import { Zap, Package, Ruler, Palette } from 'lucide-react';
import type { Locale } from '@/modules/_shared/i18n/locale';
import type { SpecRow } from '@/modules/product/product.validators';
import { productTokens } from '../product.tokens';

interface ProductSpecsProps {
  specs: SpecRow[];
  locale?: Locale;
}

const SPEC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wattage: Zap,
  capacity: Package,
  dimensions: Ruler,
  color: Palette,
};

export function ProductSpecs({ specs, locale = 'en' }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <div className={productTokens.specs.grid} aria-label="Product specifications">
      {specs.map((entry, i) => {
        const label = locale === 'ar' && entry.keyAr ? entry.keyAr : entry.key;
        const value = locale === 'ar' && entry.valueAr ? entry.valueAr : entry.value;
        const Icon = SPEC_ICONS[entry.key.toLowerCase()] ?? Package;
        return (
          <div key={i} className={productTokens.specs.item}>
            <Icon className={productTokens.specs.icon} aria-hidden="true" />
            <div>
              <p className={productTokens.specs.label}>{label}</p>
              <p className={productTokens.specs.value}>{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
