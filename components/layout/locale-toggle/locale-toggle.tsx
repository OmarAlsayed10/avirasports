'use client';

import { useTransition } from 'react';
import { setLocale } from '@/modules/_shared/i18n/locale.service';
import { localeToggleTokens as tk } from './locale-toggle.tokens';
import type { LocaleToggleProps } from './locale-toggle.types';
import type { Locale } from '@/modules/_shared/i18n/locale';

export function LocaleToggle({ locale }: LocaleToggleProps) {
  const [isPending, startTransition] = useTransition();
  const next: Locale = locale === 'en' ? 'ar' : 'en';

  return (
    <button
      onClick={() => startTransition(() => setLocale(next))}
      disabled={isPending}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      className={tk.btn}
    >
      {locale === 'en' ? 'ع' : 'EN'}
    </button>
  );
}
