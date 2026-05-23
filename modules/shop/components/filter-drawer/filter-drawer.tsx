'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterSidebar } from '../filter-sidebar/filter-sidebar';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { filterDrawerTokens } from './filter-drawer.tokens';
import type { FilterDrawerProps } from './filter-drawer.types';

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
        className={filterDrawerTokens.triggerBtn}
        aria-label={t.shop.openFilters}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t.shop.filters}
      </button>

      {open && (
        <>
          <div
            className={filterDrawerTokens.overlay}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className={filterDrawerTokens.panel}
            role="dialog"
            aria-modal="true"
            aria-label={t.shop.filters}
          >
            <div className={filterDrawerTokens.header}>
              <h2 className={filterDrawerTokens.headerTitle}>{t.shop.filters}</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.shop.closeFilters}
                className={filterDrawerTokens.closeBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={filterDrawerTokens.body}>
              <FilterSidebar categories={categories} brands={brands} />
            </div>

            <div className={filterDrawerTokens.footer}>
              <button
                onClick={() => setOpen(false)}
                className={filterDrawerTokens.applyBtn}
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
