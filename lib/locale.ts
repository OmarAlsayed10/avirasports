import { cookies } from 'next/headers';
import { tr } from '@/lib/i18n/translations';
import type { Translations } from '@/lib/i18n/translations';

export type Locale = 'en' | 'ar';

export function getLocale(): Locale {
  return cookies().get('locale')?.value === 'ar' ? 'ar' : 'en';
}

// Convenience for server components — returns locale + translations in one call.
// Client components use useLocale() from @/lib/i18n/context instead.
export function getT(): { locale: Locale; t: Translations } {
  const locale = getLocale();
  return { locale, t: tr(locale) };
}
