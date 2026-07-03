'use client';

import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { imageUploadError } from '@/modules/_shared/constants/image-upload.constants';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './section-shell';
import { VariantGenerator } from './variant-generator';
import { VariantTable } from './variant-table';

export function VariantsSection() {
  const { form, pendingFiles, setPendingFiles } = useProductForm();
  const { control, register, watch, setValue, getValues, formState: { errors } } = form;
  const { t } = useLocale();

  const { fields, remove, append } = useFieldArray({ control, name: 'variants' });

  const attrNames = useMemo(() => {
    const hasColor = fields.some((f) => Boolean((f.attributes as Record<string, string>)?.color));
    return hasColor ? ['size', 'color'] : ['size'];
  }, [fields]);

  // Every variant index sharing the same colour as `index` (so a colour image applies
  // to that colour across all sizes). Falls back to just `index` when there's no colour.
  const sameColorIndexes = (index: number): number[] => {
    const variants = getValues('variants');
    const color = (variants[index]?.attributes as Record<string, string> | undefined)?.color;
    if (!color) return [index];
    return variants.reduce<number[]>((acc, v, i) => {
      if ((v.attributes as Record<string, string> | undefined)?.color === color) acc.push(i);
      return acc;
    }, []);
  };

  const revokePending = (next: typeof pendingFiles, indexes: number[]) => {
    const variants = getValues('variants');
    for (const i of indexes) {
      const current = variants[i]?.imageUrl;
      if (current?.startsWith('pending:')) {
        const p = next.get(current);
        if (p) URL.revokeObjectURL(p.preview);
        next.delete(current);
      }
    }
  };

  const handleImageUpload = (index: number, file: File) => {
    const err = imageUploadError(file);
    if (err) {
      toast.error(err === 'size' ? t.admin.imageTooLarge : t.admin.unsupportedImageType);
      return;
    }

    const targets = sameColorIndexes(index);
    const tempId = `pending:variant-img-${crypto.randomUUID()}`;
    const preview = URL.createObjectURL(file);

    setPendingFiles((prev) => {
      const next = new Map(prev);
      revokePending(next, targets);
      next.set(tempId, { file, preview });
      return next;
    });
    for (const i of targets) setValue(`variants.${i}.imageUrl`, tempId, { shouldDirty: true });
  };

  const handleImageRemove = (index: number) => {
    const targets = sameColorIndexes(index);
    setPendingFiles((prev) => {
      const next = new Map(prev);
      revokePending(next, targets);
      return next;
    });
    for (const i of targets) setValue(`variants.${i}.imageUrl`, null, { shouldDirty: true });
  };

  return (
    <SectionShell title={t.admin.variants}>
      <p className="text-xs text-gray-400 -mt-2 mb-1">{t.admin.variantsDesc}</p>
      <p className="text-xs text-gray-400 mb-5">{t.admin.maxImageSize}</p>

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
