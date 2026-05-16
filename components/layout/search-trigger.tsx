'use client';

import { Search } from 'lucide-react';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

interface SearchTriggerProps {
  iconOnly?: boolean;
}

export function SearchTrigger({ iconOnly = false }: SearchTriggerProps) {
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const { t } = useLocale();

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label={t.search.open}
        className="p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn transition-colors"
      >
        <Search className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      className="w-full max-w-lg flex items-center gap-2 h-12 px-6 border-2 border-border-primary dark:border-white/20 rounded-input text-text-placeholder dark:text-text-footer-link font-light text-base bg-transparent dark:bg-bg-dark hover:bg-bg-page dark:hover:bg-bg-surface transition-colors"
      aria-label={t.search.openShortcut}
    >
      <span className="flex-1 text-start">{t.search.placeholder}</span>
      <Search className="w-5 h-5 text-text-primary dark:text-text-on-dark flex-shrink-0" aria-hidden="true" />
    </button>
  );
}
