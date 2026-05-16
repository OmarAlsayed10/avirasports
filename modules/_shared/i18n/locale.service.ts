'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Locale } from '@/modules/_shared/i18n/locale';

export async function setLocale(locale: Locale) {
  cookies().set('locale', locale, { path: '/', maxAge: 365 * 24 * 60 * 60 });
  revalidatePath('/', 'layout');
}
