import { cookies } from 'next/headers';
import { tr } from '@/modules/_shared/i18n/i18n.translations';
import type { Translations } from '@/modules/_shared/i18n/i18n.translations';

export type Locale = 'en' | 'ar';

export function getLocale(): Locale {
  return cookies().get('locale')?.value === 'ar' ? 'ar' : 'en';
}

export function getT(): { locale: Locale; t: Translations } {
  const locale = getLocale();
  return { locale, t: tr(locale) };
}
