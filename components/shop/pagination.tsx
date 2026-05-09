'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryParams } from '@/lib/hooks/use-query-params';
import { useLocale } from '@/lib/i18n/context';

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
}

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
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => setParam('page', String(page - 1))}
        disabled={page === 1}
        aria-label={t.shop.prevPage}
        className="flex items-center justify-center w-10 h-10 rounded-btn-sm border border-border-primary/30 dark:border-white/20 text-text-primary dark:text-text-on-dark disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => setParam('page', '1')}
            className="flex items-center justify-center w-10 h-10 rounded-btn-sm border border-border-primary/30 dark:border-white/20 text-nav-sm text-text-primary dark:text-text-on-dark hover:border-primary hover:text-primary transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="w-10 text-center text-text-secondary dark:text-text-footer-link">…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setParam('page', String(p))}
          aria-current={p === page ? 'page' : undefined}
          className={`flex items-center justify-center w-10 h-10 rounded-btn-sm border text-nav-sm transition-colors ${
            p === page
              ? 'border-primary bg-primary text-text-on-dark font-semibold'
              : 'border-border-primary/30 dark:border-white/20 text-text-primary dark:text-text-on-dark hover:border-primary hover:text-primary'
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="w-10 text-center text-text-secondary dark:text-text-footer-link">…</span>
          )}
          <button
            onClick={() => setParam('page', String(totalPages))}
            className="flex items-center justify-center w-10 h-10 rounded-btn-sm border border-border-primary/30 dark:border-white/20 text-nav-sm text-text-primary dark:text-text-on-dark hover:border-primary hover:text-primary transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => setParam('page', String(page + 1))}
        disabled={page === totalPages}
        aria-label={t.shop.nextPage}
        className="flex items-center justify-center w-10 h-10 rounded-btn-sm border border-border-primary/30 dark:border-white/20 text-text-primary dark:text-text-on-dark disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
