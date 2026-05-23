import type { Locale } from '@/modules/_shared/i18n/locale';

export interface NavCategory {
  slug: string;
  name: string;
  nameAr?: string | null;
}

export interface HeaderProps {
  locale: Locale;
  categories: NavCategory[];
}
