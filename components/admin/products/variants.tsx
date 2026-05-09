'use client';

import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2, X } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { useProductForm } from './product-form-provider';
import { useAttrNames } from './use-attribute-names';
import { SectionShell } from './sectionSheel';


export function VariantsSection() {
  const { form } = useProductForm();
  const { control, register, watch, setValue, formState: { errors } } = form;
  const { t } = useLocale();

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  const { attrNames, newAttrName, setNewAttrName, addAttrName, removeAttrName } = useAttrNames();

  const handleAddVariant = () => {
    const slug = watch('slug') || 'product';
    const attrs: Record<string, string> = {};
    attrNames.forEach((name:any) => { attrs[name.toLowerCase()] = ''; });
    append({
      sku: `${slug}-${fields.length + 1}`,
      attributes: attrs,
      stockCount: 0,
      priceOverrideEgp: null,
      imageUrl: null,
    });
  };

  return (
    <SectionShell title={t.admin.variants}>
      <p className="text-xs text-gray-400 -mt-2 mb-5">{t.admin.variantsDesc}</p>

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {t.admin.attributeColumns}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {attrNames.map((name:any) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
            >
              {name}
              {attrNames.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttrName(name)}
                  className="text-gray-400 hover:text-red-500 transition-colors leading-none"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-xs">
          <input
            value={newAttrName}
            onChange={(e) => setNewAttrName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAttrName(); } }}
            placeholder="e.g. Material"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={addAttrName}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors font-medium"
          >
            {t.admin.add}
          </button>
        </div>
      </div>

      {fields.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {attrNames.map((name:any) => (
                  <th key={name} className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase capitalize">
                    {name}
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
                  {attrNames.map((attrName:any) => {
                    const key = attrName.toLowerCase();
                    const val = watch(`variants.${i}.attributes.${key}`) ?? '';
                    const isColorAttr = key === 'color';
                    const colorVal = isColorAttr && !val ? '#000000' : val;

                    return (
                      <td key={attrName} className="px-3 py-2">
                        {isColorAttr ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={colorVal}
                              onChange={(e) => {
                                const current = { ...(watch(`variants.${i}.attributes`) ?? {}) };
                                current[key] = e.target.value;
                                setValue(`variants.${i}.attributes`, current);
                              }}
                              className="w-8 h-8 p-0.5 border border-gray-300 rounded cursor-pointer bg-white shrink-0"
                            />
                            <span className="text-xs font-mono text-gray-500">{colorVal}</span>
                          </div>
                        ) : (
                          <input
                            value={val}
                            onChange={(e) => {
                              const current = { ...(watch(`variants.${i}.attributes`) ?? {}) };
                              current[key] = e.target.value;
                              setValue(`variants.${i}.attributes`, current);
                            }}
                            placeholder={attrName}
                            className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
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
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic mb-4">{t.admin.noVariantsYet}</p>
      )}

      <button
        type="button"
        onClick={handleAddVariant}
        className="flex items-center gap-1.5 text-sm text-primary-btn font-medium hover:underline border border-dashed border-gray-300 rounded-md px-3 py-2 hover:border-primary transition-colors"
      >
        <Plus className="w-4 h-4" /> {t.admin.addVariant}
      </button>
    </SectionShell>
  );
}