'use client';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './section-shell';

export function SettingsSection() {
  const { form } = useProductForm();
  const { register } = form;
  const { t } = useLocale();

  return (
    <SectionShell title={t.admin.settings}>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" {...register('isActive')} className="w-4 h-4 accent-primary rounded" />
          <span className="text-sm text-gray-700">{t.admin.activeVisible}</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-primary rounded" />
          <span className="text-sm text-gray-700">{t.admin.featuredHomepage}</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" {...register('isHolidayOffer')} className="w-4 h-4 accent-primary rounded" />
          <span className="text-sm text-gray-700">{t.admin.holidayOffer}</span>
        </label>
      </div>
    </SectionShell>
  );
}
