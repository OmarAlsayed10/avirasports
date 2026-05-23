'use client';

import { Search } from 'lucide-react';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { searchTriggerTokens as tk } from './search-trigger.tokens';
import type { SearchTriggerProps } from './search-trigger.types';

export function SearchTrigger({ iconOnly = false }: SearchTriggerProps) {
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const { t } = useLocale();

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label={t.search.open}
        className={tk.iconBtn}
      >
        <Search className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      className={tk.searchBar}
      aria-label={t.search.openShortcut}
    >
      <span className={tk.searchBarText}>{t.search.placeholder}</span>
      <Search className="w-5 h-5 text-text-primary dark:text-text-on-dark flex-shrink-0" aria-hidden="true" />
    </button>
  );
}
