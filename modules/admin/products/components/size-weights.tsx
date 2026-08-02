"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useLocale } from "@/modules/_shared/i18n/i18n.context";
import { useProductForm } from "./product-form-provider";
import { SectionShell } from "./section-shell";
const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
] as const;
export function SizeWeightsSection() {
  const { form } = useProductForm();
  const { formState: { errors } } = form;
  const { t } = useLocale();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizeWeights",
  });
  return (
    <SectionShell title={t.admin.sizesLabel}>
      <p className="-mt-2 mb-4 text-xs text-gray-500">
        {t.admin.sizesLabelHint}
      </p>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
          >
            <select
              {...form.register(`sizeWeights.${i}.size`)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              <option value="">{t.admin.sizeAttr}</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
{errors.sizeWeights?.[i]?.size && <p className="col-span-4 text-xs text-red-600">{errors.sizeWeights[i]?.size?.message}</p>}
                        <input
              type="number"
              min="0"
              placeholder={t.admin.weightMinKg}
              {...form.register(`sizeWeights.${i}.minWeightKg`)}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm"
            />
                       <input
              type="number"
              min="0"
              placeholder={t.admin.weightMaxKg}
              {...form.register(`sizeWeights.${i}.maxWeightKg`)}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-md border border-gray-300 px-3 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          append({ size: "" as any, minWeightKg: null, maxWeightKg: null })
        }
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" />
        {t.admin.add}
      </button>
    </SectionShell>
  );
}
