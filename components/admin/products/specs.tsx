'use client';

import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './sectionSheel';

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';

export function SpecsSection() {
  const { form } = useProductForm();
  const { register, control } = form;
  const { t } = useLocale();

  const { fields, append, remove } = useFieldArray({ control, name: 'specs' });

  return (
    <SectionShell
      title={t.admin.specifications}
      action={
        <button
          type="button"
          onClick={() => append({ key: '', keyAr: '', value: '', valueAr: '' })}
          className="flex items-center gap-1 text-xs text-primary-btn font-medium hover:underline"
        >
          <Plus className="w-3.5 h-3.5" /> {t.admin.addSpec}
        </button>
      }
    >
      <div className="space-y-3">
        {fields.map((field, i) => (
          <div key={field.id} className="border border-gray-100 rounded-md p-3 space-y-2 bg-gray-50/50">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium text-gray-400 w-6 shrink-0">EN</span>
              <input {...register(`specs.${i}.key`)} className={inputCls} placeholder="Key (e.g. Material)" />
              <input {...register(`specs.${i}.value`)} className={inputCls} placeholder="Value (e.g. Nylon)" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium text-amber-500 w-6 shrink-0">ع</span>
              <input {...register(`specs.${i}.keyAr`)} dir="rtl" className={inputCls} placeholder="مثلاً: المادة" />
              <input {...register(`specs.${i}.valueAr`)} dir="rtl" className={inputCls} placeholder="مثلاً: نايلون" />
              <div className="w-9 shrink-0" />
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">{t.admin.noSpecsYet}</p>
        )}
      </div>
    </SectionShell>
  );
}