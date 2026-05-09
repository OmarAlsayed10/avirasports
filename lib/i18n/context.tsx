'use client';

import { createContext, useContext } from 'react';
import { translations } from './translations';
import type { Locale } from '@/lib/locale';
import type { Translations } from './translations';

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  t: translations.en,
});

export function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const t = locale === 'ar' ? translations.ar : translations.en;
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
