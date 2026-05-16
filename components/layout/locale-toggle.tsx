'use client';

import { useTransition } from 'react';
import { setLocale } from '@/modules/_shared/i18n/locale.service';
import type { Locale } from '@/modules/_shared/i18n/locale';

export function LocaleToggle({ locale }: { locale: Locale }) {
  const [isPending, startTransition] = useTransition();
  const next: Locale = locale === 'en' ? 'ar' : 'en';

  return (
    <button
      onClick={() => startTransition(() => setLocale(next))}
      disabled={isPending}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-current text-xs font-bold text-text-primary dark:text-text-on-dark hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 shrink-0 [.bg-primary_&]:text-white [.bg-primary_&]:hover:bg-white/10"
    >
      {locale === 'en' ? 'ع' : 'EN'}
    </button>
  );
}
