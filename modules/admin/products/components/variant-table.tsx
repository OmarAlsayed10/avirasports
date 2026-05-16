'use client';

import { Trash2 } from 'lucide-react';
import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';
import type { AdminProductInput } from '@/modules/product/product.validators';
import type { Translations } from '@/modules/_shared/i18n/i18n.translations';

interface VariantTableProps {
  fields: FieldArrayWithId<AdminProductInput, 'variants', 'id'>[];
  attrNames: string[];
  register: UseFormRegister<AdminProductInput>;
  errors: FieldErrors<AdminProductInput>;
  onRemove: (index: number) => void;
  t: Translations;
}

function attrLabel(key: string, t: Translations): string {
  if (key === 'size') return t.admin.sizeAttr;
  if (key === 'color') return t.admin.colorAttr;
  return key;
}

const inputCls =
  'px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

function EditableRow({
  field,
  fieldIdx,
  colorKey,
  otherAttrNames,
  register,
  errors,
  onRemove,
  t,
}: {
  field: FieldArrayWithId<AdminProductInput, 'variants', 'id'>;
  fieldIdx: number;
  colorKey: string | undefined;
  otherAttrNames: string[];
  register: UseFormRegister<AdminProductInput>;
  errors: FieldErrors<AdminProductInput>;
  onRemove: (i: number) => void;
  t: Translations;
}) {
  const attrs = field.attributes as Record<string, string>;
  const colorVal = colorKey ? (attrs[colorKey] ?? '') : '';

  return (
    <tr key={field.id} className="hover:bg-gray-50/50">
      {colorKey && (
        <td className="px-3 py-2 w-36">
          {colorVal ? (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border border-gray-300 shrink-0"
                style={{ backgroundColor: colorVal }}
              />
              <span className="text-xs font-mono text-gray-500">{colorVal}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </td>
      )}

      {otherAttrNames.map((attrName) => {
        const key = attrName.toLowerCase();
        const val = attrs[key] ?? '';
        return (
          <td key={attrName} className="px-3 py-2">
            <span className="text-sm text-gray-700">{val}</span>
          </td>
        );
      })}

      <td className="px-3 py-2">
        <input
          {...register(`variants.${fieldIdx}.stockCount`)}
          type="number"
          min="0"
          className={`w-20 ${inputCls}`}
          placeholder="0"
        />
      </td>

      <td className="px-3 py-2">
        <input
          {...register(`variants.${fieldIdx}.priceOverrideEgp`)}
          type="number"
          step="0.01"
          min="0"
          className={`w-28 ${inputCls}`}
          placeholder={t.admin.optional}
        />
      </td>

      <td className="px-3 py-2">
        <input
          {...register(`variants.${fieldIdx}.sku`)}
          className={`w-36 ${inputCls}`}
          placeholder="SKU"
        />
        {errors.variants?.[fieldIdx]?.sku && (
          <p className="text-xs text-red-500 mt-1">{errors.variants[fieldIdx]?.sku?.message}</p>
        )}
      </td>

      <td className="px-3 py-2">
        <button
          type="button"
          onClick={() => onRemove(fieldIdx)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

function TableHead({
  colorKey,
  otherAttrNames,
  t,
}: {
  colorKey: string | undefined;
  otherAttrNames: string[];
  t: Translations;
}) {
  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        {colorKey && (
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
            {attrLabel('color', t)}
          </th>
        )}
        {otherAttrNames.map((name) => (
          <th key={name} className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
            {attrLabel(name.toLowerCase(), t)}
          </th>
        ))}
        <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
          {t.admin.stockHeader}
        </th>
        <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase whitespace-nowrap">
          {t.admin.priceOverride}
        </th>
        <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
          {t.admin.skuHeader}
        </th>
        <th className="w-8" />
      </tr>
    </thead>
  );
}

export function VariantTable({ fields, attrNames, register, errors, onRemove, t }: VariantTableProps) {
  if (fields.length === 0) {
    return <p className="text-sm text-gray-400 italic mb-4">{t.admin.noVariantsYet}</p>;
  }

  const sizeKey = attrNames.find((n) => n.toLowerCase() === 'size');
  const colorKey = attrNames.find((n) => n.toLowerCase() === 'color');
  const otherAttrNames = attrNames.filter(
    (n) => n.toLowerCase() !== 'size' && n.toLowerCase() !== 'color'
  );

  if (sizeKey) {
    const groupOrder: string[] = [];
    const groups: Record<string, number[]> = {};

    fields.forEach((field, i) => {
      const attrs = field.attributes as Record<string, string>;
      const sizeVal = attrs[sizeKey.toLowerCase()] ?? attrs[sizeKey] ?? '—';
      if (!groups[sizeVal]) {
        groupOrder.push(sizeVal);
        groups[sizeVal] = [];
      }
      groups[sizeVal].push(i);
    });

    return (
      <div className="space-y-3 mb-4">
        {groupOrder.map((size) => {
          const indices = groups[size];
          const colors = colorKey
            ? indices
                .map((i) => (fields[i].attributes as Record<string, string>)[colorKey.toLowerCase()] ?? '')
                .filter(Boolean)
            : [];

          return (
            <div key={size} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-3 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t.admin.sizeAttr}
                </span>
                <span className="text-sm font-bold text-gray-800">{size}</span>
                {colors.length > 0 && (
                  <>
                    <span className="text-gray-300 text-xs">·</span>
                    <div className="flex items-center gap-1.5">
                      {colors.map((c, ci) => (
                        <div
                          key={ci}
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </>
                )}
                <span className="ml-auto text-xs text-gray-400">
                  {indices.length} {indices.length === 1 ? 'variant' : 'variants'}
                </span>
              </div>

              <table className="w-full text-sm">
                <TableHead colorKey={colorKey} otherAttrNames={otherAttrNames} t={t} />
                <tbody className="divide-y divide-gray-100">
                  {indices.map((fieldIdx) => (
                    <EditableRow
                      key={fields[fieldIdx].id}
                      field={fields[fieldIdx]}
                      fieldIdx={fieldIdx}
                      colorKey={colorKey}
                      otherAttrNames={otherAttrNames}
                      register={register}
                      errors={errors}
                      onRemove={onRemove}
                      t={t}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {attrNames.map((name) => (
              <th
                key={name}
                className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase"
              >
                {attrLabel(name.toLowerCase(), t)}
              </th>
            ))}
            <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
              {t.admin.stockHeader}
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase whitespace-nowrap">
              {t.admin.priceOverride}
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase">
              {t.admin.skuHeader}
            </th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fields.map((field, i) => {
            const attrs = field.attributes as Record<string, string>;
            return (
              <tr key={field.id} className="hover:bg-gray-50/50">
                {attrNames.map((attrName) => {
                  const key = attrName.toLowerCase();
                  const val = attrs[key] ?? '';
                  return (
                    <td key={attrName} className="px-3 py-2">
                      {key === 'color' ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300 shrink-0"
                            style={{ backgroundColor: val }}
                          />
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
                    className={`w-20 ${inputCls}`}
                    placeholder="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    {...register(`variants.${i}.priceOverrideEgp`)}
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-28 ${inputCls}`}
                    placeholder={t.admin.optional}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    {...register(`variants.${i}.sku`)}
                    className={`w-36 ${inputCls}`}
                    placeholder="SKU"
                  />
                  {errors.variants?.[i]?.sku && (
                    <p className="text-xs text-red-500 mt-1">{errors.variants[i]?.sku?.message}</p>
                  )}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
