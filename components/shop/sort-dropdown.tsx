'use client';

import { useQueryParams } from '@/lib/hooks/use-query-params';
import { useLocale } from '@/lib/i18n/context';

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
    <div className="flex items-center gap-2 w-full">
      <label htmlFor="sort" className="text-base font-medium text-text-primary dark:text-text-on-dark whitespace-nowrap">
        {t.shop.sortBy}
      </label>
      <select
        id="sort"
        value={current}
        disabled={isPending}
        onChange={(e) => setParam('sort', e.target.value)}
        className="flex-1 h-10 px-3 pr-8 border border-border-primary dark:border-white/20 rounded-btn-sm text-base text-text-primary dark:text-text-on-dark bg-bg-white dark:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50"
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
