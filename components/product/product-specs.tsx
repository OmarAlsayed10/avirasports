import { Zap, Package, Ruler, Palette } from 'lucide-react';
import type { Locale } from '@/lib/locale';
import type { SpecRow } from '@/lib/validators/admin-product';

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
    <div className="grid grid-cols-2 gap-3" aria-label="Product specifications">
      {specs.map((entry, i) => {
        const label = locale === 'ar' && entry.keyAr ? entry.keyAr : entry.key;
        const value = locale === 'ar' && entry.valueAr ? entry.valueAr : entry.value;
        const Icon = SPEC_ICONS[entry.key.toLowerCase()] ?? Package;
        return (
          <div
            key={i}
            className="flex items-center gap-2 p-3 bg-bg-page dark:bg-bg-surface rounded-tag"
          >
            <Icon className="w-4 h-4 text-primary-btn flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-text-secondary dark:text-text-footer-link">{label}</p>
              <p className="text-nav-sm font-medium text-text-primary dark:text-text-on-dark">{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
