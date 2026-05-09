'use client';

import { useProductForm } from './product-form-provider'; 
import { SectionShell } from './sectionSheel';
import { useLocale } from '@/lib/i18n/context';

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-500 mt-1';

export function PricingSection() {
  const { form } = useProductForm();
  const { register, formState: { errors } } = form;
  const { t } = useLocale();

  return (
    <SectionShell title={t.admin.pricing}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>{t.admin.basePrice}</label>
          <input
            {...register('basePriceEgp')}
            type="number"
            step="0.01"
            min="0"
            className={inputCls}
            placeholder="0.00"
          />
          {errors.basePriceEgp && <p className={errorCls}>{errors.basePriceEgp.message}</p>}
        </div>
        <div>
          <label className={labelCls}>{t.admin.discountPercent}</label>
          <input
            {...register('discountPercent')}
            type="number"
            min="0"
            max="99"
            className={inputCls}
            placeholder="e.g. 20"
          />
        </div>
      </div>
    </SectionShell>
  );
}