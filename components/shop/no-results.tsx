'use client';

import Link from 'next/link';
import { useQueryParams } from '@/lib/hooks/use-query-params';
import { useLocale } from '@/lib/i18n/context';

const FILTERABLE_PARAMS = ['category', 'brand', 'priceMin', 'priceMax', 'rating', 'inStockOnly'];

export function NoResults() {
  const { clearParams } = useQueryParams();
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-bg-page dark:bg-bg-surface">
        <svg
          className="w-12 h-12 text-text-placeholder"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-newsletter-sub font-semibold text-text-primary dark:text-text-on-dark mb-2">
        {t.shop.noResults}
      </h3>
      <p className="text-nav-sm text-text-secondary dark:text-text-footer-link max-w-sm mb-6">
        {t.shop.noResultsSub}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => clearParams(FILTERABLE_PARAMS)}
          className="px-6 py-2.5 bg-primary dark:bg-bg-white text-text-on-dark dark:text-text-primary rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 dark:hover:bg-bg-page transition-colors"
        >
          {t.shop.clearFilters}
        </button>
        <Link
          href="/shop"
          className="px-6 py-2.5 border border-border-primary dark:border-white/20 text-text-primary dark:text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-bg-page dark:hover:bg-bg-surface transition-colors"
        >
          {t.shop.viewAll}
        </Link>
      </div>
    </div>
  );
}
