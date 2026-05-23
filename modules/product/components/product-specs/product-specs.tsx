import { Zap, Package, Ruler, Palette } from 'lucide-react';
import { productSpecsTokens } from './product-specs.tokens';
import type { ProductSpecsProps } from './product-specs.types';

const SPEC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wattage: Zap,
  capacity: Package,
  dimensions: Ruler,
  color: Palette,
};

export function ProductSpecs({ specs, locale = 'en' }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <div className={productSpecsTokens.grid} aria-label="Product specifications">
      {specs.map((entry, i) => {
        const label = locale === 'ar' && entry.keyAr ? entry.keyAr : entry.key;
        const value = locale === 'ar' && entry.valueAr ? entry.valueAr : entry.value;
        const Icon = SPEC_ICONS[entry.key.toLowerCase()] ?? Package;
        return (
          <div key={i} className={productSpecsTokens.item}>
            <Icon className={productSpecsTokens.icon} aria-hidden="true" />
            <div>
              <p className={productSpecsTokens.label}>{label}</p>
              <p className={productSpecsTokens.value}>{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
