"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";
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
  const upload = async (i: number, file: File) => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { url?: string };
    if (data.url)
      form.setValue(`addOnOptions.${i}.imageUrl`, data.url, {
        shouldDirty: true,
      });
  };
  return (
    <SectionShell title={t.admin.offers}>
      <p className="-mt-2 mb-4 text-xs text-gray-500">
        {t.admin.offersHint}
      </p>
      <div className="space-y-3">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:grid-cols-2"
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
            <div className="flex gap-2">
              <input
                placeholder={t.admin.image}
                {...form.register(`addOnOptions.${i}.imageUrl`)}
                className="h-10 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm"
              />
              <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 text-gray-600">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(i, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <input
              placeholder={t.admin.sizesLabel}
              onChange={(e) =>
                form.setValue(
                  `addOnOptions.${i}.sizes`,
                  e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                )
              }
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
            <div className="flex gap-2">
              <input
                placeholder={t.admin.colorAttr}
                onChange={(e) =>
                  form.setValue(
                    `addOnOptions.${i}.colors`,
                    e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  )
                }
                className="h-10 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-md border border-gray-300 bg-white px-3 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          append({
            name: "",
            nameAr: "",
            imageUrl: "",
            basePriceEgp: 0,
            sizes: [],
            colors: [],
          })
        }
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" />
        {t.admin.add}
      </button>
    </SectionShell>
  );
}
