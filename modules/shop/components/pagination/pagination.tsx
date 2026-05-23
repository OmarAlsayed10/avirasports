'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cn } from '@/modules/_shared/utils/cn';
import { paginationTokens } from './pagination.tokens';
import type { PaginationProps } from './pagination.types';

export function Pagination({ total, page, limit }: PaginationProps) {
  const { setParam } = useQueryParams();
  const { t } = useLocale();
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <nav aria-label="Pagination" className={paginationTokens.nav}>
      <button
        onClick={() => setParam('page', String(page - 1))}
        disabled={page === 1}
        aria-label={t.shop.prevPage}
        className={paginationTokens.btn}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => setParam('page', '1')}
            className={cn(paginationTokens.pageBtn, paginationTokens.pageBtnInactive)}
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className={paginationTokens.ellipsis}>…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setParam('page', String(p))}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            paginationTokens.pageBtn,
            p === page ? paginationTokens.pageBtnActive : paginationTokens.pageBtnInactive
          )}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className={paginationTokens.ellipsis}>…</span>
          )}
          <button
            onClick={() => setParam('page', String(totalPages))}
            className={cn(paginationTokens.pageBtn, paginationTokens.pageBtnInactive)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => setParam('page', String(page + 1))}
        disabled={page === totalPages}
        aria-label={t.shop.nextPage}
        className={paginationTokens.btn}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
