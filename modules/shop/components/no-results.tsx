'use client';

import Link from 'next/link';
import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { shopTokens } from '../shop.tokens';

const FILTERABLE_PARAMS = ['category', 'brand', 'priceMin', 'priceMax', 'rating', 'inStockOnly'];

export function NoResults() {
  const { clearParams } = useQueryParams();
  const { t } = useLocale();

  return (
    <div className={shopTokens.noResults.wrapper}>
      <div className={shopTokens.noResults.iconWrapper}>
        <svg
          className={shopTokens.noResults.icon}
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
      <h3 className={shopTokens.noResults.title}>{t.shop.noResults}</h3>
      <p className={shopTokens.noResults.sub}>{t.shop.noResultsSub}</p>
      <div className={shopTokens.noResults.btnRow}>
        <button
          onClick={() => clearParams(FILTERABLE_PARAMS)}
          className={shopTokens.noResults.clearBtn}
        >
          {t.shop.clearFilters}
        </button>
        <Link href="/shop" className={shopTokens.noResults.viewAllLink}>
          {t.shop.viewAll}
        </Link>
      </div>
    </div>
  );
}
