'use client';

import { Trash2 } from 'lucide-react';
import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';
import type { AdminProductInput } from '@/lib/validators/admin-product';
import type { Translations } from '@/lib/i18n/translations';

interface VariantTableProps {
  fields: FieldArrayWithId<AdminProductInput, 'variants', 'id'>[];
  attrNames: string[];
  register: UseFormRegister<AdminProductInput>;
  errors: FieldErrors<AdminProductInput>;
  onRemove: (index: number) => void;
  t: Translations;
}

/** Maps attribute keys (always stored in English) to their localized display label */
function attrLabel(key: string, t: Translations): string {
  if (key === 'size') return t.admin.sizeAttr;
  if (key === 'color') return t.admin.colorAttr;
  return key;
}

export function VariantTable({ fields, attrNames, register, errors, onRemove, t }: VariantTableProps) {
  if (fields.length === 0) {
    return <p className="text-sm text-gray-400 italic mb-4">{t.admin.noVariantsYet}</p>;
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {attrNames.map((name) => (
              <th key={name} className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
                {attrLabel(name, t)}
              </th>
            ))}
            <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">{t.admin.stockHeader}</th>
            <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase whitespace-nowrap">{t.admin.priceOverride}</th>
            <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">{t.admin.skuHeader}</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fields.map((field, i) => (
            <tr key={field.id} className="hover:bg-gray-50/50">
              {attrNames.map((attrName) => {
                const key = attrName.toLowerCase();
                const val = (field.attributes as Record<string, string>)[key] ?? '';
                return (
                  <td key={attrName} className="px-3 py-2">
                    {key === 'color' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: val }} />
                        <span className="text-xs font-mono text-gray-500">{val}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700">{val}</span>
                    )}
                  </td>
                );
              })}
              <td className="px-3 py-2">
                <input
                  {...register(`variants.${i}.stockCount`)}
                  type="number"
                  min="0"
                  className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="0"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  {...register(`variants.${i}.priceOverrideEgp`)}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder={t.admin.optional}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  {...register(`variants.${i}.sku`)}
                  className="w-36 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="SKU"
                />
                {errors.variants?.[i]?.sku && (
                  <p className="text-xs text-red-500 mt-1">{errors.variants[i]?.sku?.message}</p>
                )}
              </td>
              <td className="px-3 py-2">
                <button type="button" onClick={() => onRemove(i)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
