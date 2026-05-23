'use client';

import { X } from 'lucide-react';
import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { filterChipsTokens } from './filter-chips.tokens';

const FILTER_LABELS: Record<string, (val: string) => string> = {
  category: (v) => `Category: ${v}`,
  brand: (v) => `Brand: ${v}`,
  priceMin: (v) => `Min: EGP ${Number(v).toLocaleString('en-EG')}`,
  priceMax: (v) => `Max: EGP ${Number(v).toLocaleString('en-EG')}`,
  rating: (v) => `${v}★ & up`,
  inStockOnly: () => 'In Stock',
};

const FILTERABLE_PARAMS = Object.keys(FILTER_LABELS);

export function FilterChips() {
  const { searchParams, clearParams, setParam } = useQueryParams();

  const chips = FILTERABLE_PARAMS.flatMap((key) => {
    const val = searchParams.get(key);
    if (!val || val === 'false') return [];
    return [{ key, val, label: FILTER_LABELS[key]?.(val) ?? `${key}: ${val}` }];
  });

  if (chips.length === 0) return null;

  return (
    <div className={filterChipsTokens.wrapper}>
      {chips.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setParam(key, null)}
          className={filterChipsTokens.chip}
          aria-label={`Remove filter: ${label}`}
        >
          {label}
          <X className="w-3.5 h-3.5" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={() => clearParams(FILTERABLE_PARAMS)}
          className={filterChipsTokens.clearAll}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
