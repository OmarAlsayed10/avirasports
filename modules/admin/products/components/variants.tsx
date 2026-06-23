'use client';

import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './section-shell';
import { VariantGenerator } from './variant-generator';
import { VariantTable } from './variant-table';

export function VariantsSection() {
  const { form, pendingFiles, setPendingFiles } = useProductForm();
  const { control, register, watch, setValue, formState: { errors } } = form;
  const { t } = useLocale();

  const { fields, remove, append } = useFieldArray({ control, name: 'variants' });

  const attrNames = useMemo(() => {
    const hasColor = fields.some((f) => Boolean((f.attributes as Record<string, string>)?.color));
    return hasColor ? ['size', 'color'] : ['size'];
  }, [fields]);

  const handleImageUpload = (index: number, file: File) => {
    const current = watch(`variants.${index}.imageUrl`);
    if (current?.startsWith('pending:')) {
      setPendingFiles((prev) => {
        const next = new Map(prev);
        const p = next.get(current);
        if (p) URL.revokeObjectURL(p.preview);
        next.delete(current);
        return next;
      });
    }
    const tempId = `pending:variant-img-${crypto.randomUUID()}`;
    const preview = URL.createObjectURL(file);
    setPendingFiles((prev) => new Map(prev).set(tempId, { file, preview }));
    setValue(`variants.${index}.imageUrl`, tempId, { shouldDirty: true });
  };

  const handleImageRemove = (index: number) => {
    const current = watch(`variants.${index}.imageUrl`);
    if (current?.startsWith('pending:')) {
      setPendingFiles((prev) => {
        const next = new Map(prev);
        const p = next.get(current);
        if (p) URL.revokeObjectURL(p.preview);
        next.delete(current);
        return next;
      });
    }
    setValue(`variants.${index}.imageUrl`, null, { shouldDirty: true });
  };

  return (
    <SectionShell title={t.admin.variants}>
      <p className="text-xs text-gray-400 -mt-2 mb-5">{t.admin.variantsDesc}</p>

      <VariantGenerator slug={watch('slug')} onGenerate={(newVariants) => append(newVariants)} />

      <VariantTable
        fields={fields}
        attrNames={attrNames}
        register={register}
        errors={errors}
        onRemove={remove}
        watch={watch}
        pendingFiles={pendingFiles}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        t={t}
      />
    </SectionShell>
  );
}
