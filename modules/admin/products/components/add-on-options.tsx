"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useLocale } from "@/modules/_shared/i18n/i18n.context";
import { useProductForm } from "./product-form-provider";
import { SectionShell } from "./section-shell";
export function AddOnOptionsSection() {
  const { form } = useProductForm();
  const { t } = useLocale();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addOnOptions",
  });
  return (
    <SectionShell title={t.admin.singlePieces}>
      <p className="-mt-2 mb-4 text-xs text-gray-500">{t.admin.singlePiecesHint}</p>
      <div className="space-y-3">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:grid-cols-[1fr_1fr_140px_auto]"
          >
            <input
              placeholder={t.admin.nameEn}
              {...form.register(`addOnOptions.${i}.name`)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
            <input
              placeholder={t.admin.nameArLabel}
              {...form.register(`addOnOptions.${i}.nameAr`)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder={t.admin.basePrice}
              {...form.register(`addOnOptions.${i}.basePriceEgp`)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ name: "", nameAr: "", basePriceEgp: 0 })}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" />
        {t.admin.add}
      </button>
    </SectionShell>
  );
}
