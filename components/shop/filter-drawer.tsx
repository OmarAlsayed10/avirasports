'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterSidebar } from './filter-sidebar';
import { useLocale } from '@/lib/i18n/context';

type Category = { slug: string; name: string; nameAr?: string | null };

interface FilterDrawerProps {
  categories: Category[];
  brands: string[];
}

export function FilterDrawer({ categories, brands }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border-primary dark:border-white/20 rounded-btn-sm text-base font-medium text-text-primary dark:text-text-on-dark bg-bg-white dark:bg-bg-surface"
        aria-label={t.shop.openFilters}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t.shop.filters}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[52] bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 right-0 z-[55] h-full w-80 bg-bg-white dark:bg-bg-surface shadow-xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={t.shop.filters}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary/20 dark:border-white/10 flex-shrink-0">
              <h2 className="text-base font-semibold text-text-primary dark:text-text-on-dark">{t.shop.filters}</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.shop.closeFilters}
                className="p-1 text-text-primary dark:text-text-on-dark hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              <FilterSidebar categories={categories} brands={brands} />
            </div>

            <div className="px-6 py-4 border-t border-border-primary/20 dark:border-white/10 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 bg-primary text-text-on-dark rounded-btn-sm text-base font-semibold"
              >
                {t.shop.applyFilters}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
