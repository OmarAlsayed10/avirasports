'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterSidebar } from './filter-sidebar';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { shopTokens } from '../shop.tokens';

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
        className={shopTokens.filterDrawer.triggerBtn}
        aria-label={t.shop.openFilters}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t.shop.filters}
      </button>

      {open && (
        <>
          <div
            className={shopTokens.filterDrawer.overlay}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className={shopTokens.filterDrawer.panel}
            role="dialog"
            aria-modal="true"
            aria-label={t.shop.filters}
          >
            <div className={shopTokens.filterDrawer.header}>
              <h2 className={shopTokens.filterDrawer.headerTitle}>{t.shop.filters}</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.shop.closeFilters}
                className={shopTokens.filterDrawer.closeBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={shopTokens.filterDrawer.body}>
              <FilterSidebar categories={categories} brands={brands} />
            </div>

            <div className={shopTokens.filterDrawer.footer}>
              <button
                onClick={() => setOpen(false)}
                className={shopTokens.filterDrawer.applyBtn}
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
