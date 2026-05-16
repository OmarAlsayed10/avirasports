'use client';

import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { shopTokens } from '../shop.tokens';

export function SortDropdown() {
  const { getParam, setParam, isPending } = useQueryParams();
  const { t } = useLocale();
  const current = getParam('sort') ?? 'featured';

  const SORT_OPTIONS = [
    { value: 'featured', label: t.shop.featured },
    { value: 'price_asc', label: t.shop.priceLowHigh },
    { value: 'price_desc', label: t.shop.priceHighLow },
    { value: 'newest', label: t.shop.newest },
    { value: 'rating', label: t.shop.bestRated },
  ] as const;

  return (
    <div className={shopTokens.sortDropdown.wrapper}>
      <label htmlFor="sort" className={shopTokens.sortDropdown.label}>
        {t.shop.sortBy}
      </label>
      <select
        id="sort"
        value={current}
        disabled={isPending}
        onChange={(e) => setParam('sort', e.target.value)}
        className={shopTokens.sortDropdown.select}
        aria-label={t.shop.sortProducts}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
