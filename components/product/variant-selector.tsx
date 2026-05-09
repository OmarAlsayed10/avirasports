'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/i18n/context';

export type VariantOption = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  priceOverrideEgp?: number | null | { toNumber: () => number };
  stockCount: number;
};

interface VariantSelectorProps {
  variants: VariantOption[];
  selectedId: string | null;
  onSelect: (variantId: string | null) => void;
}

function isHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{3,8}$/.test(value);
}

function isColorKey(key: string, variants: VariantOption[]): boolean {
  const withKey = variants.filter((v) => key in v.attributes);
  return withKey.length > 0 && withKey.every((v) => isHexColor(v.attributes[key]));
}

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  const { t } = useLocale();
  const [selections, setSelections] = useState<Record<string, string>>({});

  const allKeys = useMemo(() => {
    const keys = new Set<string>();
    variants.forEach((v) => Object.keys(v.attributes).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [variants]);

  const colorKeys = useMemo(
    () => new Set(allKeys.filter((k) => isColorKey(k, variants))),
    [allKeys, variants]
  );

  const valuesByKey = useMemo(() => {
    const result: Record<string, string[]> = {};
    allKeys.forEach((key) => {
      const seen = new Set<string>();
      const values: string[] = [];
      variants.forEach((v) => {
        const val = v.attributes[key];
        if (val !== undefined && !seen.has(val)) {
          seen.add(val);
          values.push(val);
        }
      });
      result[key] = values;
    });
    return result;
  }, [allKeys, variants]);

  if (variants.length <= 1 || allKeys.length === 0) return null;

  function getStatesForKey(key: string) {
    const otherEntries = Object.entries(selections).filter(([k]) => k !== key);
    const available = new Set<string>();
    const inStock = new Set<string>();

    variants.forEach((v) => {
      const matchesOthers = otherEntries.every(([k, val]) => v.attributes[k] === val);
      if (matchesOthers && v.attributes[key] !== undefined) {
        available.add(v.attributes[key]);
        if (v.stockCount > 0) inStock.add(v.attributes[key]);
      }
    });

    return { available, inStock };
  }

  function handleSelect(key: string, value: string) {
    const next = { ...selections, [key]: value };

    allKeys.forEach((k) => {
      if (k === key || next[k] === undefined) return;
      const stillReachable = variants.some((v) =>
        Object.entries(next).every(([ak, av]) => v.attributes[ak] === av)
      );
      if (!stillReachable) delete next[k];
    });

    setSelections(next);

    const matched = variants.find((v) =>
      allKeys.every((k) => v.attributes[k] === next[k])
    );
    onSelect(matched?.id ?? null);
  }

  return (
    <div className="space-y-4" role="group" aria-label={t.product.variantSelect}>
      {allKeys.map((key) => {
        const isColor = colorKeys.has(key);
        const values = valuesByKey[key];
        const { available, inStock } = getStatesForKey(key);
        const selected = selections[key];

        return (
          <div key={key}>
            <h3 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-2 capitalize flex items-center gap-2">
              {key}
              {isColor && selected && (
                <span className="text-xs font-mono font-normal text-text-secondary">{selected}</span>
              )}
            </h3>

            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const isAvailable = available.has(val);
                const isInStock = inStock.has(val);
                const isSelected = selected === val;

                if (isColor) {
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => isAvailable && handleSelect(key, val)}
                      disabled={!isAvailable}
                      aria-pressed={isSelected}
                      aria-label={`${key} ${val}${!isInStock ? ` — ${t.product.variantOutOfStock}` : ''}`}
                      title={val}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                        isSelected
                          ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-bg-surface'
                          : isAvailable
                            ? 'border-transparent hover:border-primary/60'
                            : 'border-transparent',
                        !isAvailable && 'opacity-30 cursor-not-allowed',
                        isAvailable && !isInStock && 'opacity-50'
                      )}
                      style={{ backgroundColor: val }}
                    />
                  );
                }

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => isAvailable && handleSelect(key, val)}
                    disabled={!isAvailable}
                    aria-pressed={isSelected}
                    aria-label={`${val}${!isInStock ? ` — ${t.product.variantOutOfStock}` : ''}`}
                    className={cn(
                      'px-4 py-2 rounded-btn-sm border text-nav-sm font-medium transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-text-on-dark'
                        : isAvailable && isInStock
                          ? 'border-border-primary/40 dark:border-white/20 text-text-primary dark:text-text-on-dark hover:border-primary'
                          : isAvailable
                            ? 'border-border-primary/30 dark:border-white/15 text-text-placeholder dark:text-text-footer-link/50 line-through cursor-not-allowed'
                            : 'border-border-primary/20 dark:border-white/10 text-text-placeholder dark:text-text-footer-link/50 opacity-50 cursor-not-allowed'
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
